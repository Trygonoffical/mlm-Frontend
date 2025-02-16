"use client"
import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

const MLMCartBanner = () => {
  const { 
    cartItems, 
    total, 
    totalBPPoints,
    mlmDiscount 
  } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  if (cartItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0  z-50">
      <div className="max-w-fit mx-auto grid grid-cols-3 text-center py-2 bg-green-600 border-t rounded-sm shadow-lg">
        <div className="flex items-center justify-center gap-2 border-r px-2 text-gray-100">
          <span>₹{total}</span>
          <ShoppingCart className="w-4 h-4" />
        </div>
        
        <div className="border-r px-2">
          <span className="text-gray-100">{totalBPPoints} BP</span>
        </div>
        
        <div className="text-gray-100 px-2">
          {userInfo?.user_data?.position?.discount_percentage}% Discount
        </div>
      </div>
    </div>
  );
};

export default MLMCartBanner;