// constants/navItems.js
import { 
    Home, ShoppingCart, UserPlus, Wallet, 
    Network, FileText, Bell, User, TicketPercent 
  } from 'lucide-react';
  
  export const sidebarItemsAdmin = [
    { icon: Home, label: 'Dashboard', active: true, bgColor: 'bg-[#DEB887]' ,  href : '#' },
    { icon: ShoppingCart, label: 'Reports' ,  href : '#' },
    { icon: UserPlus, label: 'New Registration' ,  href : 'register' },
    { icon: Wallet, label: 'Level' ,  href : 'position' },
    { icon: Wallet, label: 'Wallet' ,  href : '#' },
    { icon: Network, label: 'Networks' ,  href : '#' },
    { icon: FileText, label: 'KYC' ,  href : '#' },
    { icon: FileText, label: 'Reports' ,  href : '#' },
    { icon: Bell, label: 'Notification'  ,  href : '#' },
    { icon: User, label: 'Profile' ,  href : 'profile' },
    { icon: TicketPercent, label: 'Ticket' ,  href : '#' },
    { icon: TicketPercent, label: 'Sliders' , href : 'sliders' },
    { icon: Bell, label: 'Categories' , href : 'category' },
    { icon: ShoppingCart, label: 'Products' , href : 'product' },
    { icon: ShoppingCart, label: 'Testimonials' , href : 'testimonial' },
    { icon: FileText, label: 'Advertisements' , href : 'ads' },
    { icon: TicketPercent, label: 'Success Story' , href : 'successstory' },
    { icon: TicketPercent, label: 'Customer Pick' , href : 'customerpick' },
    { icon: FileText, label: 'About' , href : 'about' },
    { icon: FileText, label: 'Home Section' , href : 'homesection' },
    { icon: FileText, label: 'Menu' , href : 'menu' },
  ];