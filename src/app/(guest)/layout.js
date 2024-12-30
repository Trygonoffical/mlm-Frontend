
// import StoreProvider from "../../redux/storeProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
export default function GuestLayout({ children }) {
  
  return (
    <>
    {/* <StoreProvider> */}
      <Header />
        {children}
      <Footer />
    {/* </StoreProvider> */}
    </>
  );
}
