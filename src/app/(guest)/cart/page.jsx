'use client'

import React, { useState } from 'react';
import { Minus, Plus, X, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Collagen Herbal Blend Powder',
      price: 1000,
      oldPrice: 2000,
      image: '/Products/p4.jpeg',
      quantity: 1
    },
    {
      id: 2,
      name: 'Herbal Supplement',
      price: 800,
      oldPrice: 1600,
      image: '/Products/p4.jpeg',
      quantity: 2
    }
  ]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shipping;

  // Update quantity
  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link 
              href="/products" 
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
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    {/* Product Details */}
                    <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="flex items-center justify-center sm:justify-start mt-1 space-x-2">
                        <span className="text-gray-400 line-through">₹{item.oldPrice}</span>
                        <span className="text-lg font-bold">₹{item.price}</span>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center sm:justify-start mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-4 min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="mt-4 sm:mt-0 text-center sm:text-right">
                      <p className="font-semibold text-lg">₹{item.price * item.quantity}</p>
                      <button
                        onClick={() => removeItem(item.id)}
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
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {shipping === 0 ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Truck className="w-4 h-4" />
                    <span>Yay! You get free shipping</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Add ₹{1000 - subtotal} more for free shipping
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