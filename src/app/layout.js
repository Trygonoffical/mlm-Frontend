import { Geist, Geist_Mono , Jost } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import localFont from 'next/font/local';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});



export const metadata = { 
  title: "Herbal Power India",
  description: "Herbal Power India ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${jost.variable} antialiased`}
      >
      
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
