'use client'

import React from 'react';
import { Minus, Plus, X, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { removeItemFromCart, updateQuantity } from '@/redux/slices/cartSlice';
import Image from 'next/image';

const CartPage = () => {
  const dispatch = useDispatch();
  const { 
    cartItems, 
    cartCount,
    subTotal, 
    totalGST,
    total,
    totalBPPoints 
  } = useSelector((state) => state.cart);

  // Constants
  const FREE_SHIPPING_THRESHOLD = 1000;
  const shipping = subTotal > FREE_SHIPPING_THRESHOLD ? 0 : 100;
  const finalTotal = total + shipping;

  // Update quantity
  const handleQuantityChange = (itemId, selectedAttributes, change) => {
    dispatch(updateQuantity({ 
      itemID: itemId, 
      selectedAttributes, 
      change 
    }));
  };

  // Remove item
  const handleRemoveItem = (itemId, selectedAttributes) => {
    dispatch(removeItemFromCart({ 
      itemID: itemId, 
      selectedAttributes 
    }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center border-b pb-6">
                    {/* Product Image */}
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                    
                    {/* Product Details */}
                    <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                      </Link>
                      <div className="flex items-center justify-center sm:justify-start mt-1 space-x-2">
                        <span className="text-gray-400 line-through">₹{item.regular_price}</span>
                        {item.regular_price >  item.sellingPrice && (
                            <span className="text-gray-400 line-through">₹{item.regular_price}</span> 
                        )}
                        <span className="text-lg font-bold">₹{item.selling_price}</span>
                      </div>

                      {/* GST and BP Points */}
                      {/* <div className="text-sm text-gray-500 mt-1">
                        <p>GST: {item.gst_percentage}%</p>
                        {item.bp_value > 0 && (
                          <p className="text-blue-600">BP Points: {item.bp_value * item.qnt}</p>
                        )}
                      </div> */}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center sm:justify-start mt-4">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.selectedAttributes, -1)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          disabled={item.qnt <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-4 min-w-[2rem] text-center">{item.qnt}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.selectedAttributes, 1)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          disabled={item.qnt >= item.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="mt-4 sm:mt-0 text-center sm:text-right">
                      <p className="font-semibold text-lg">₹{item.total_price}</p>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.selectedAttributes)}
                        className="mt-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Cart Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST</span>
                  <span>₹{totalGST}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {totalBPPoints > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Total BP Points</span>
                    <span>{totalBPPoints}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                {shipping === 0 ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Truck className="w-4 h-4" />
                    <span>Yay! You get free shipping</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Add ₹{FREE_SHIPPING_THRESHOLD - subTotal} more for free shipping
                  </div>
                )}

                <Link 
                  href="/checkout"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors mt-6"
                >
                  Proceed to Checkout
                </Link>
                
                <Link 
                  href="/shop"
                  className="block w-full text-center text-green-600 hover:text-green-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;