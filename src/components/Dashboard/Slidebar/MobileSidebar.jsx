"use client"
// components/MobileSidebar.js
import React, { useEffect, useState } from 'react';
import { 
  Bell, Menu, Home, ShoppingCart, UserPlus, Wallet, 
  Network, FileText, User, TicketPercent, X 
} from 'lucide-react';
import { sidebarItems } from './NavItems';
import { sidebarItemsAdmin } from './AdminNavItem'; 
import { sidebarPrefredItems } from './NavItems';
import Link from 'next/link';
import { useSelector } from 'react-redux';


const MobileSidebar = ({admin=false}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sideItems , setSideItems] = useState([])
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(()=>{
        console.log('sidebar userinfo - ' , userInfo
        )
        if(admin){
          setSideItems(sidebarItemsAdmin)
        }else if(userInfo.user_data.position.name == 'Preferred Customer') {
          setSideItems(sidebarPrefredItems)
        }else{
          setSideItems(sidebarItems)
  
        }
      } , [admin])

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="block lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-0 z-[999] lg:hidden
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar Content */}
        <div className="relative w-5/6 md:w-64 h-full bg-gradient-to-br from-[#204866] to-[#257449] ">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="pt-16 max-h-[100vh] overflow-y-auto">
            {sideItems.map((item, index) => (
              <Link 
                key={index} 
                className={`
                  flex items-center px-4 py-3 text-white hover:bg-[#34495E] cursor-pointer
                  ${item.active ? item.bgColor || 'bg-[#34495E]' : ''}`
                }
                // href={`/auth/dashboard/${item.href}`}
                href={admin ? `/auth/dashboard/${item.href}` : `/mu/dashboard/${item.href}`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-6 h-6" />
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;