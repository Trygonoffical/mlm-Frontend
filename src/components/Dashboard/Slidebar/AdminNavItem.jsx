// constants/navItems.js
import { 
    Home, ShoppingCart, UserPlus, Wallet, 
    Network, FileText, Bell, User, TicketPercent 
  } from 'lucide-react';
  
  export const sidebarItemsAdmin = [
    { icon: Home, label: 'Dashboard', active: true, bgColor: 'bg-[#DEB887]' ,  href : '#' },
    { icon: ShoppingCart, label: 'Reports' ,  href : 'reports' },
    { icon: UserPlus, label: 'New Registration' ,  href : 'register' },
    { icon: Wallet, label: 'Level' ,  href : 'position' },
    { icon: Wallet, label: 'Wallet' ,  href : 'wallet' },
    { icon: Network, label: 'Networks' ,  href : 'networks' },
    { icon: FileText, label: 'KYC' ,  href : 'kyc' },
    { icon: Bell, label: 'Orders'  ,  href : 'orders' },
    { icon: UserPlus, label: 'Password Reset'  ,  href : 'password-resets' },
    { icon: UserPlus, label: 'Become MLM'  ,  href : 'become-member' },
    { icon: Bell, label: 'Notification'  ,  href : 'notification' },
    { icon: Bell, label: 'Newsletters'  ,  href : 'newsletter' },
    { icon: User, label: 'Customers'  ,  href : 'customers' },
    { icon: User, label: 'Members'  ,  href : 'members' },
    { icon: User, label: 'Profile' ,  href : 'profile' },
    { icon: TicketPercent, label: 'Ticket' ,  href : 'ticket' },
    { icon: TicketPercent, label: 'Sliders' , href : 'sliders' },
    { icon: Bell, label: 'Categories' , href : 'category' },
    { icon: ShoppingCart, label: 'Products' , href : 'product' },
    { icon: ShoppingCart, label: 'Shipment Manegement' , href : 'shippingmanagement' },
    { icon: ShoppingCart, label: 'Shipment Configuration' , href : 'shipmentconfiguration' },
    { icon: ShoppingCart, label: 'Testimonials' , href : 'testimonial' },
    { icon: FileText, label: 'Advertisements' , href : 'ads' },
    { icon: TicketPercent, label: 'Success Story' , href : 'successstory' },
    { icon: TicketPercent, label: 'Customer Pick' , href : 'customerpick' },
    { icon: FileText, label: 'About' , href : 'about' },
    { icon: FileText, label: 'Home Section' , href : 'homesection' },
    { icon: FileText, label: 'Menu' , href : 'menu' },
    { icon: FileText, label: 'Pages' , href : 'customPage' },
    { icon: FileText, label: 'Blogs' , href : 'blogs' },
  ];