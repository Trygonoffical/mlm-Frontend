
import StoreProvider from "@/redux/storeProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Toaster } from 'react-hot-toast';

export default function GuestLayout({ children }) {
  
  return (
    <>
      <StoreProvider>
        <Header />
          {children}
          <Toaster position="top-right" />
        <Footer />
      </StoreProvider>
    </>
  );
}
