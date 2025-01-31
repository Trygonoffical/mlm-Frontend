'use client'
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  Bell, Menu, Home, ShoppingCart, UserPlus, Wallet, 
  Network, FileText, User, TicketPercent, X 
} from 'lucide-react';
import Link from "next/link";
import { setUserLogout } from '@/redux/slices/authSlice';
import { removeTokens } from '@/utils/cookies'; 
const UserArea = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
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
        
        router.push('/');
        // Redirect to home page
        //window.location.reload(); // Force reload to update all states
        
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
  return (
    <div className="relative">
        <User
            className="w-6 h-6 cursor-pointer" 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        />
        {showProfileDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-lg z-50">
            {/* Profile items */}
            <ul className="p-4">
                <li className=" w-full "> <Link href='#' className=" w-full pb-3">Profile</Link>  </li>
                <li> <button onClick={handleLogout}>logout</button>  </li>
            </ul>
            </div>
        )}
    </div>
  )
}

export default UserArea