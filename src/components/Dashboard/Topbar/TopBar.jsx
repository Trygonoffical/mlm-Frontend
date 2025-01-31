import React from 'react'
import UserArea from './UserArea'
import Notification from './Notification'
import MobileSidebar from '../Slidebar/MobileSidebar'
import CartArea from '@/components/Cart/ShopingCart'

const TopBar = ({shop=false , admin=false}) => {
  return (
    <>
     
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MobileSidebar admin={admin} />
              <div className='flex items-center gap-2'>
                <img src="/Images/logo.png" alt="Logo" className="h-auto w-8" />
                <span className="text-green-600">Commission - ₹ 1000.00</span>
              </div>
              
            </div>

            <div className="flex items-center gap-4">
              {/* Shoping Cart Dropdown */}
              {shop &&  <CartArea />}
               

              {/* Notification Dropdown */}
              <Notification />

              {/* Profile Dropdown */}
              <UserArea />
            </div>
          </div>
        </header>
    </>
  )
}

export default TopBar