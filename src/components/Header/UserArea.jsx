'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { setUserLogout } from '@/redux/slices/authSlice';
import SendOtp from '../CustomerLogin/SendOtp';
import { removeTokens } from '@/utils/cookies'; 
const UserArea = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { userInfo } = useSelector((state) => state.auth);

  // Check authentication status on mount and when token changes
  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    try {
      // Clear cookies
      removeTokens();
      
      // Clear Redux state
      dispatch(setUserLogout());
      
      // Close dropdown
      setShowProfileDropdown(false);
      
      // Update authentication state
      setIsAuthenticated(false);
      
      // Redirect to home page
      router.push('/');
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileDropdown]);

  if (!isAuthenticated) {
    return <SendOtp />;
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
      >
        <User className="w-6 h-6" />
        {userInfo?.firstName && (
          <span className="text-sm font-medium hidden md:block">
            {userInfo.firstName}
          </span>
        )}
      </div>

      {showProfileDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 py-1">
          {/* User Info Section */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {userInfo?.firstName} {userInfo?.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {userInfo?.phone_number}
            </p>
          </div>

          {/* Menu Items */}
          <ul className="py-1">
            {userInfo?.role === 'CUSTOMER' ? (
              <>
                <li>
                  <Link 
                    href="/account" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  href="/auth/dashboard" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
              </li>
            )}
            
            {/* Logout Button */}
            <li className="border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserArea;