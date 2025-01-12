'use client'
import { useState } from "react";
import { 
  Bell, Menu, Home, ShoppingCart, UserPlus, Wallet, 
  Network, FileText, User, TicketPercent, X 
} from 'lucide-react';
import Link from "next/link";

const UserArea = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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
                <li> <Link href='#'>logout</Link>  </li>
            </ul>
            </div>
        )}
    </div>
  )
}

export default UserArea