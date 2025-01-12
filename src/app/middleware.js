// middleware.js
import { NextResponse } from 'next/server';

async function refreshToken(refreshToken) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.access;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  // Get tokens from cookies
  const token = request.cookies.get('token')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // If no tokens, redirect to login
  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL('/auth/customer-login', request.url));
  }

  try {
    // First try with existing token
    let currentToken = token;
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/validate-token/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });

    // If token is invalid but we have refresh token
    if (!response.ok && refreshToken) {
      const newToken = await refreshToken(refreshToken);
      if (newToken) {
        currentToken = newToken;
        // Try again with new token
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/validate-token/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });

        // Update token in cookies if successful
        if (response.ok) {
          const newResponse = NextResponse.next();
          newResponse.cookies.set('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 day
          });
          return newResponse;
        }
      }
    }

    // If still not ok after refresh attempt
    if (!response.ok) {
      const response = NextResponse.redirect(new URL('/auth/customer-login', request.url));
      response.cookies.delete('token');
      response.cookies.delete('refreshToken');
      return response;
    }

    const data = await response.json();
    const userRole = data.role;

    // Handle route protection based on role
    const path = request.nextUrl.pathname;

    if (path === '/account') {
      if (userRole !== 'CUSTOMER') {
        return NextResponse.redirect(new URL('/auth/dashboard', request.url));
      }
    }

    if (path === '/auth/dashboard') {
      if (userRole === 'CUSTOMER') {
        return NextResponse.redirect(new URL('/account', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Clear cookies and redirect to login on any error
    const response = NextResponse.redirect(new URL('/auth/customer-login', request.url));
    response.cookies.delete('token');
    response.cookies.delete('refreshToken');
    return response;
  }
}

export const config = {
  matcher: ['/account', '/auth/dashboard']
};