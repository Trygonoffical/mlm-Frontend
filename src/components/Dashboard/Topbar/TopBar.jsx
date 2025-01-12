import React from 'react'
import UserArea from './UserArea'
import Notification from './Notification'
import MobileSidebar from '../Slidebar/MobileSidebar'

const TopBar = () => {
  return (
    <>
     
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MobileSidebar />
              <div className='flex items-center gap-2'>
                <img src="/images/logo.png" alt="Logo" className="h-auto w-8" />
                <span className="text-green-600">Commission - ₹ 1000.00</span>
              </div>
              
            </div>

            <div className="flex items-center gap-4">
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