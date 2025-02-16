
import StoreProvider from "@/redux/storeProvider";
import SlideBar from '@/components/Dashboard/Slidebar/SlideBar';
import TopBar from '@/components/Dashboard/Topbar/TopBar';
import { Toaster } from 'react-hot-toast';
import MLMCartBanner from "@/components/MLMMember/MLMCartBanner";
export default function GuestLayout({ children }) {
  
  return (
    <>
      <StoreProvider>
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar  bg-[#2C3E50] */}
            <SlideBar  />
            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {/* Header */}
                <TopBar shop={true} />

                {/* Main Content Area */}
                <div className="p-4 overflow-auto h-[calc(100vh-4rem)]">
                {/* Notifications */}
                {children}
                <Toaster position="top-right" />
                </div>
            </div>
            <MLMCartBanner />
            </div>
      </StoreProvider>
    </>
  );
}
