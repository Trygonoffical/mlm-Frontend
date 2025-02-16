// constants/navItems.js
import { 
    Home, ShoppingCart, UserPlus, Wallet, 
    Network, FileText, Bell, User, TicketPercent 
  } from 'lucide-react';
  
  export const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true, bgColor: 'bg-[#DEB887]', href : '/'},
    { icon: ShoppingCart, label: 'Shop Now', href : 'shop'},
    { icon: UserPlus, label: 'New Registration' , href : 'register'},
    { icon: Wallet, label: 'Wallet' , href : 'wallet'},
    { icon: Network, label: 'Networks' , href : 'networks'},
    { icon: FileText, label: 'KYC', href : 'kyc' },
    { icon: FileText, label: 'Reports' , href : 'reports'},
    { icon: Bell, label: 'Notification' , href : 'notification'},
    { icon: User, label: 'Profile' , href : 'profile'},
    { icon: TicketPercent, label: 'Orders' , href : 'orders'}
  ];