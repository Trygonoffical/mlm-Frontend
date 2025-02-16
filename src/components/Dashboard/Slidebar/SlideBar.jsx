"use client"
import React, { useEffect, useState } from 'react';
import { sidebarItems } from './NavItems';
import { sidebarItemsAdmin } from './AdminNavItem'; 
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const SlideBar = ({admin=false}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [sideItems , setSideItems] = useState([])
    

    useEffect(()=>{
      if(admin){
        setSideItems(sidebarItemsAdmin)
      }else{
        setSideItems(sidebarItems)
      }
    } , [admin])


  return (
    <>
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'}  bg-gradient-to-r from-[#204866] to-[#257449] transition-all duration-300 relative  hidden lg:block`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-4 bg-white rounded-full p-1 shadow-lg"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Sidebar Items */}
        <div className="flex flex-col pt-16">

          {sideItems.map((item, index) => (
            <Link 
              key={index} 
              className={`flex items-center px-4 py-3 text-white hover:bg-[#D9D9D9] hover:text-black cursor-pointer
                ${item.active ? item.bgColor || 'bg-[#34495E]' : ''}`}
                href={admin ? `/auth/dashboard/${item.href}` : `/mu/dashboard/${item.href}`}
            >
              {/* <Link href={`${item.href}`}> */}
                <item.icon className="w-6 h-6 min-w-[24px]" />
                {isSidebarOpen && (
                  <span className="ml-3 whitespace-nowrap">{item.label}</span>
                )}
              {/* </Link> */}
              
            </Link>
          ))}

        </div>
      </div>
    </>
    
  )
}

export default SlideBar