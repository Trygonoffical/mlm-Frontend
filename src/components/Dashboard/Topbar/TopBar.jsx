'use client'
import React, { useEffect, useState } from 'react'
import UserArea from './UserArea'
import Notification from './Notification'
import MobileSidebar from '../Slidebar/MobileSidebar'
import CartArea from '@/components/Cart/ShopingCart'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { getTokens } from '@/utils/cookies';

const TopBar = ({shop=false , admin=false}) => {
  const [unreadCount, setUnreadCount] = useState(0);
 const { token } = getTokens();
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/unread_count/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch unread count');

      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
      fetchUnreadCount();
    }, []);

  return (
    <>
     
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MobileSidebar admin={admin} />
              <div className='flex items-center gap-2'>
                <Link href={`/`}>
                  <img src="/Images/logo.png" alt="Logo" className="h-auto w-8" />
                </Link>
                {/* <span className="text-green-600">Commission - ₹ 1000.00</span> */}
              </div>
              
            </div>

            <div className="flex items-center gap-4">
              {/* Shoping Cart Dropdown */}
              {shop &&  <CartArea />}
               

              {/* Notification Dropdown */}
              <Link href={admin ? '/auth/dashboard/notification': '/mu/dashboard/notification'} className='flex'>
                <Bell  className="w-6 h-6 " />
                {unreadCount > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm" style={{fontSize:'10px'}}>
                  {unreadCount}
                </span>
                )}
              </Link>
              {/* <Notification /> */}

              {/* Profile Dropdown */}
              <UserArea admin={admin} />
            </div>
          </div>
        </header>
    </>
  )
}

export default TopBar