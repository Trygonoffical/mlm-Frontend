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

// const caslon = localFont({
//   src: [
//     {
//       path: 'public/fonts/ITC Caslon 224 Std Book.ttf',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: 'public/fonts/ITC Caslon 224 Std Bold.ttf',
//       weight: '700',
//       style: 'normal',
//     },
//     {
//       path: 'public/fonts/ITC Caslon 224 Std Book Italic.ttf',
//       weight: '400',
//       style: 'italic',
//     },
//     {
//       path: 'public/fonts/ITC Caslon 224 Std Bold Italic.ttf',
//       weight: '700',
//       style: 'italic',
//     },
//   ],
//   variable: '--font-caslon',
// }); ${caslon.variable}

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
