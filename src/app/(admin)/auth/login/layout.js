
import StoreProvider from "@/redux/storeProvider";

import { Toaster } from 'react-hot-toast';


export default function GuestLayout({ children }) {
  
  return (
    <>
      <StoreProvider>
        <div>
          {children}
        </div>

      </StoreProvider>
    </>
  );
}
