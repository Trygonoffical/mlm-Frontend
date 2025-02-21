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
const UserArea = ({admin=false}) => {
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
            <ul className="">
                <li className=" w-full px-4 py-2 hover:bg-gray-100"> <Link href='/' onClick={()=>setShowProfileDropdown(false)} className=" w-full pb-3">Website</Link>  </li>
                <li className=" w-full px-4 py-2 hover:bg-gray-100"> <Link href={admin?  `/auth/dashboard/profile` : `/mu/dashboard/profile`} onClick={()=>setShowProfileDropdown(false)} className=" w-full pb-3">Profile</Link>  </li>
                <li> <button className="w-full px-4 py-2 text-left hover:bg-gray-100" onClick={handleLogout}>logout</button>  </li>
            </ul>
            </div>
        )}
    </div>
  )
}

export default UserArea