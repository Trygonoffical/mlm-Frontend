
import StoreProvider from "@/redux/storeProvider";
import SlideBar from '@/components/Dashboard/Slidebar/SlideBar';
import TopBar from '@/components/Dashboard/Topbar/TopBar';
import { Toaster } from 'react-hot-toast';
export default function GuestLayout({ children }) {
  
  return (
    <>
      <StoreProvider>
        <div className="flex  bg-gray-100">
            {/* Sidebar  bg-[#2C3E50] */}
            <SlideBar admin={true} />
            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {/* Header */}
                <TopBar admin={true} shop={false} />

                {/* Main Content Area */}
                <div className="p-4 overflow-auto h-[calc(100vh-4rem)]">
                {/* Notifications */}
                {children}
                <Toaster position="top-right" />
                </div>
            </div>
            </div>
      </StoreProvider>
    </>
  );
}
