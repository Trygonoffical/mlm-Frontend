import React from 'react'
import UserArea from './UserArea'
import Notification from './Notification'
import MobileSidebar from '../Slidebar/MobileSidebar'
import CartArea from '@/components/Cart/ShopingCart'
import Link from 'next/link'
import { Bell } from 'lucide-react'

const TopBar = ({shop=false , admin=false}) => {
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
              <Link href={admin ? '/auth/dashboard/notification': '/mu/dashboard/notification'}>
                <Bell  className="w-6 h-6 " />
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