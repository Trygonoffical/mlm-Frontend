// middleware.js
import { NextResponse } from 'next/server';

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_NAME = 'token';
const REFRESH_TOKEN_NAME = 'refreshToken';

// Route definitions
const ROUTES = {
    LOGIN: '/auth/login',
    HOME: '/',
    CUSTOMER_DASHBOARD: '/account',
    MLM_DASHBOARD: '/mu/dashboard',
    ADMIN_DASHBOARD: '/auth/dashboard'
};

// Role definitions
const ROLES = {
    CUSTOMER: 'CUSTOMER',
    MLM_MEMBER: 'MLM_MEMBER',
    ADMIN: 'ADMIN'
};

// Token refresh function with improved error handling
async function refresh_Token(refreshToken) {
    try {
        console.log('Attempting to refresh token');
        const response = await fetch(`${API_URL}/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('Token refresh successful');
            return data.access;
        }
        
        console.error('Token refresh failed:', data);
        return null;
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
}

// Token validation function with comprehensive checks
async function validateToken(token) {
    try {
        console.log('Validating token:', token ? token.substring(0, 10) + '...' : 'no token');
        
        const response = await fetch(`${API_URL}/validate-token/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Validation response:', {
            status: response.status,
            ok: response.ok,
            data: data
        });

        if (response.ok) {
            return {
                isValid: true,
                userData: {
                    role: data.role,
                    username: data.username,
                    email: data.email
                }
            };
        }

        return { isValid: false, userData: null };
    } catch (error) {
        console.error('Token validation error:', error);
        return { isValid: false, userData: null };
    }
}

// Handle invalid token situations
function handleInvalidToken(request) {
    console.log('Handling invalid token - redirecting to login');
    const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    response.cookies.delete(TOKEN_NAME, { path: '/' });
    response.cookies.delete(REFRESH_TOKEN_NAME, { path: '/' });
    return response;
}

// Route protection logic with role-based access
function handleRouteProtection(request, userRole) {
    const path = request.nextUrl.pathname;
    console.log(`Checking route protection for path: ${path}, role: ${userRole}`);

    const routeRules = {
        [ROUTES.CUSTOMER_DASHBOARD]: {
            allowed: [ROLES.CUSTOMER],
            redirect: ROUTES.HOME
        },
        [ROUTES.ADMIN_DASHBOARD]: {
            allowed: [ROLES.ADMIN],
            redirect: {
                [ROLES.CUSTOMER]: ROUTES.CUSTOMER_DASHBOARD,
                [ROLES.MLM_MEMBER]: ROUTES.MLM_DASHBOARD
            }
        },
        [ROUTES.MLM_DASHBOARD]: {
            allowed: [ROLES.MLM_MEMBER],
            redirect: ROUTES.CUSTOMER_DASHBOARD
        }
    };

    const currentRule = Object.entries(routeRules).find(([route]) => 
        path.startsWith(route)
    );

    if (currentRule) {
        const [_, rule] = currentRule;
        
        if (!rule.allowed.includes(userRole)) {
            console.log(`Access denied for role ${userRole} to path ${path}`);
            const redirectPath = typeof rule.redirect === 'object' 
                ? rule.redirect[userRole] || ROUTES.HOME
                : rule.redirect;
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
    }

    console.log('Access granted');
    return NextResponse.next();
}

// Main middleware function
export async function middleware(request) {
    console.log('Middleware triggered for:', request.nextUrl.pathname);
    
    const token = request.cookies.get(TOKEN_NAME)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;

    console.log('Tokens present:', {
        hasToken: !!token,
        hasRefreshToken: !!refreshToken
    });

    if (!token && !refreshToken) {
        console.log('No tokens found, redirecting to login');
        return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }

    try {
        let currentToken = token;
        let validation = await validateToken(currentToken);

        if (!validation.isValid && refreshToken) {
            console.log('Token invalid, attempting refresh');
            const newToken = await refresh_Token(refreshToken);
            
            if (newToken) {
                console.log('Got new token, validating');
                currentToken = newToken;
                validation = await validateToken(newToken);

                if (validation.isValid) {
                    console.log('New token valid, setting cookie');
                    const response = NextResponse.next();
                    response.cookies.set(TOKEN_NAME, newToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 60 * 60 * 6 // 1 day
                    });
                    return response;
                }
            }
        }

        if (!validation.isValid) {
            console.log('All validation attempts failed');
            return handleInvalidToken(request);
        }

        console.log('Proceeding with route protection check');
        return handleRouteProtection(request, validation.userData.role);

    } catch (error) {
        console.error('Middleware error:', error);
        return handleInvalidToken(request);
    }
}

// Matcher configuration for protected routes
export const config = {
    matcher: [
        '/account',
        '/account/:path*',
        '/auth/dashboard',
        '/auth/dashboard/:path*',
        '/mu/dashboard',
        '/mu/dashboard/:path*'
    ]
};