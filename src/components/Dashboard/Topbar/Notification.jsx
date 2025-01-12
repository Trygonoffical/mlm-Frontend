'use client'

import { Bell } from "lucide-react";
import { useState } from "react";

const Notification = () => {
      const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    
  return (
    <div className="relative">
                <Bell 
                  className="w-6 h-6 cursor-pointer" 
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                />
                {showNotificationDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
                    {/* Notification items */}
                  </div>
                )}
              </div>
  )
}

export default Notification