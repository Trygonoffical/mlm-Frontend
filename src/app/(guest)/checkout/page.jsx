'use client'

import React, { useEffect, useState } from 'react';
import { ChevronLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

import Cookies from 'js-cookie';
import UserArea from '@/components/Header/UserArea';
import PayOrder from '@/components/PaymentButton/PayOrder';
import { getTokens } from '@/utils/cookies';
import AddressManager from '@/components/Profile/AddressManager';
import PaymentHandler from '@/components/PaymentButton/PaymentHandler';
import CustomerProfile from '@/components/Profile/CustomerProfile';

const CheckoutPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
// Check authentication status on mount and when token changes

const [formData, setFormData] = useState({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
});

  useEffect(() => {
    const { token } = getTokens();
    setIsAuthenticated(!!token);
    if(userInfo){
      setFormData({
        first_name: userInfo.first_name || '',
        last_name: userInfo.last_name || '',
        email: userInfo.email || '',
        phone_number: userInfo.phone_number || '',
      });
    }
    

  }, [userInfo]);

  const router = useRouter();
  const { 
    cartItems, 
    subTotal, 
    totalGST,
    total,
    totalBPPoints 
  } = useSelector((state) => state.cart);

  // Calculate shipping and final total
  const shipping = subTotal > 1000 ? 0 : 0;
  const finalTotal = total + shipping;

  

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // const updateProfile = async () => {
  //     setLoading(true);
  //     const { token } = getTokens();
  //     if(userInfo.first_name == ''){
  //       toast.success('First Name is missing');
  //     }
  //     if(userInfo.last_name == ''){
  //       toast.success('Last Name is missing');
  //     }
  //     if(userInfo.email == ''){
  //       toast.success('email is missing');
  //     }
  
  //     try {
        
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/update/`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`
  //         },
  //         body: JSON.stringify({
  //           first_name: formData.first_name,
  //           last_name: formData.last_name,
  //           email: formData.email,
  //         })
  //       });
  
  //       const data = await response.json();
  //       console.log('updated pro data - ', data)
  //       if (response.ok) {
  //         dispatch(updateUserInfo(data.userinfo));
  //         toast.success('Profile updated successfully!');
  //       } else {
  //         console.log('pro data - ', data)
  //         throw new Error(data.message || 'Failed to update profile');
  //       }
  //     } catch (error) {
  //       toast.error(error.message || 'Error updating profile');
  //       console.log('pro error data  - ', error)
  
  //     } finally {
  //       setLoading(false);
  //     }
  //   };


  const handleSubmit = async (e) => {
    e.preventDefault();
      setLoading(true);
      // updateProfile();
    try {
      // Create order payload
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.qnt,
          price: item.selling_price,
          gst_amount: item.gst_amount,
          total_price: item.total_price
        })),
        subtotal: subTotal,
        gst: totalGST,
        shipping,
        total: finalTotal,
        bp_points: totalBPPoints
      };

      // Make API call to create order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      
      // Handle different payment methods
      if (formData.paymentMethod === 'cod') {
        router.push(`/order-confirmation/${data.id}`);
      } else {
        // Redirect to payment gateway
        router.push(data.payment_url);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  // if (cartItems.length === 0) {
  //   router.push('/shop');
  //   return null;
  // }

  return (
    <div className=" bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Link 
          href="/cart" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
       
              <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              {/* <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div> */}
                { isAuthenticated ? (
                // <div>
                //   <label className="block text-sm font-medium text-gray-700 mb-1">
                //     Phone Number *
                //   </label>
                //   <input
                //     type="tel"
                //     name="phone"
                //     disabled
                //     value={formData.phone_number}
                //     onChange={handleInputChange}
                //     required
                //     pattern="[0-9]{10}"
                //     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                //   />
                // </div>
                <CustomerProfile />
              ):(
              <UserArea checkoutpage={true} />
            )}
              {/* </form> */}
            </div>
            
            
            { isAuthenticated && (
          <AddressManager /> )}

            {/* Payment Method */}
            {/* <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="text-green-600"
                  />
                  <span className="ml-2">Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="text-green-600"
                  />
                  <span className="ml-2">UPI Payment</span>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="text-green-600"
                  />
                  <span className="ml-2">Cash on Delivery</span>
                </label>
              </div>
            </div> */}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">Quantity: {item.qnt}</p>
                      <p className="text-sm text-gray-500">
                        GST ({item.gst_percentage}%): ₹{item.gst_amount}
                      </p>
                      {/* {item.bp_value > 0 && (
                        <p className="text-sm text-blue-600">
                          BP Points: {item.bp_value * item.qnt}
                        </p>
                      )} */}
                    </div>
                    <span className="font-semibold">₹{item.total_price}</span>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
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
                {/* {totalBPPoints > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Total BP Points</span>
                    <span>{totalBPPoints}</span>
                  </div>
                )} */}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Benefits */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Free delivery on orders above ₹1000</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure payment processing</span>
                </div>
              </div>

              {/* Place Order Button */}
              {isAuthenticated ? (
              //   <button
              //   onClick={handleSubmit}
              //   disabled={loading}
              //   className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
              //            transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              // >
              //   {loading ? (
              //     'Processing...'
              //   ) : (
              //     <>
              //       <CreditCard className="w-5 h-5" />
              //       Place Order
              //     </>
              //   )}
              // </button>
              // <PayOrder amount={finalTotal} />
                <PaymentHandler  amount={finalTotal} />
              ):(
                <UserArea checkoutpage={true} />
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;