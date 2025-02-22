// // 'use client';

// // import React, { useEffect } from 'react';
// // import { CheckCircle, Home, User, ShoppingBag } from 'lucide-react';
// // import { useRouter } from 'next/navigation';
// // import { motion } from 'framer-motion';

// // const ThankYouPage = () => {
// //     const router = useRouter();
// //     const orderDetails = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orderDetails') || '{}') : {};

// //     useEffect(() => {
// //         const timer = setTimeout(() => {
// //             localStorage.removeItem('orderDetails');
// //         }, 5000);

// //         return () => clearTimeout(timer);
// //     }, []);

// //     const navigationButtons = [
// //         {
// //             label: 'Go to Home',
// //             icon: <Home className="w-5 h-5" />,
// //             action: () => router.push('/'),
// //             className: 'bg-green-600 hover:bg-green-700'
// //         },
// //         {
// //             label: 'My Account',
// //             icon: <User className="w-5 h-5" />,
// //             action: () => router.push('/account'),
// //             className: 'bg-blue-600 hover:bg-blue-700'
// //         },
// //         {
// //             label: 'Continue Shopping',
// //             icon: <ShoppingBag className="w-5 h-5" />,
// //             action: () => router.push('/shop'),
// //             className: 'bg-purple-600 hover:bg-purple-700'
// //         }
// //     ];

// //     return (
// //         <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
// //             <div className="max-w-md w-full space-y-8 text-center">
// //                 {/* Success Animation */}
// //                 <motion.div
// //                     initial={{ scale: 0 }}
// //                     animate={{ scale: 1 }}
// //                     transition={{ duration: 0.5 }}
// //                     className="flex justify-center"
// //                 >
// //                     <div className="relative">
// //                         <motion.div
// //                             initial={{ opacity: 0 }}
// //                             animate={{ opacity: 1 }}
// //                             transition={{ delay: 0.3 }}
// //                             className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse"
// //                         />
// //                         <CheckCircle className="relative w-24 h-24 text-green-500" />
// //                     </div>
// //                 </motion.div>

// //                 {/* Thank You Message */}
// //                 <motion.div
// //                     initial={{ opacity: 0, y: 20 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     transition={{ delay: 0.5, duration: 0.5 }}
// //                 >
// //                     <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
// //                         Payment Successful!
// //                     </h2>
// //                     <p className="mt-2 text-sm text-gray-600">
// //                         Thank you for your purchase. Your order has been confirmed.
// //                     </p>
// //                 </motion.div>

// //                 {/* Order Details */}
// //                 <motion.div
// //                     initial={{ opacity: 0 }}
// //                     animate={{ opacity: 1 }}
// //                     transition={{ delay: 1, duration: 0.5 }}
// //                 >
// //                     {orderDetails.orderId && (
// //                         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
// //                             <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
// //                             <div className="space-y-2 text-sm text-gray-600">
// //                                 <p className="flex justify-between">
// //                                     <span>Order ID:</span>
// //                                     <span className="font-medium">{orderDetails.orderId}</span>
// //                                 </p>
// //                                 <p className="flex justify-between">
// //                                     <span>Amount:</span>
// //                                     <span className="font-medium">₹{orderDetails.amount}</span>
// //                                 </p>
// //                                 <p className="flex justify-between">
// //                                     <span>Payment ID:</span>
// //                                     <span className="font-medium">{orderDetails.paymentId}</span>
// //                                 </p>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </motion.div>

// //                 {/* Navigation Buttons */}
// //                 <motion.div
// //                     initial={{ opacity: 0, y: 20 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     transition={{ delay: 1.2, duration: 0.5 }}
// //                     className="grid gap-3 mt-8"
// //                 >
// //                     {navigationButtons.map((button, index) => (
// //                         <button
// //                             key={button.label}
// //                             onClick={button.action}
// //                             className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white transition-colors ${button.className} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
// //                         >
// //                             {button.icon}
// //                             {button.label}
// //                         </button>
// //                     ))}
// //                 </motion.div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default ThankYouPage;


// 'use client';

// import React, { useEffect, useState } from 'react';
// import { CheckCircle, Home, User, ShoppingBag, Package, Truck } from 'lucide-react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { getTokens } from '@/utils/cookies';
// import { useSelector } from 'react-redux';

// const ThankYouPage = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const [orderDetails, setOrderDetails] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [cust, setCust] = useState(true);
//     const { userInfo } = useSelector((state) => state.auth);

//     useEffect(()=>{
//         if(userInfo.role == 'MLM_MEMBER'){
//             setCust(false)
//         }
//     },[userInfo])
//     useEffect(() => {
//         const fetchOrderDetails = async () => {
//             try {
//                 const orderId = searchParams.get('order_id');
//                 if (!orderId) {
//                     throw new Error('No order ID found');
//                 }

//                 const { token } = getTokens();
//                 const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch order details');
//                 }

//                 const data = await response.json();
//                 setOrderDetails(data);
                
//                 // Store in localStorage as backup
//                 localStorage.setItem('orderDetails', JSON.stringify(data));
//             } catch (error) {
//                 console.error('Error fetching order details:', error);
//                 // Fallback to localStorage if available
//                 const storedDetails = localStorage.getItem('orderDetails');
//                 if (storedDetails) {
//                     setOrderDetails(JSON.parse(storedDetails));
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrderDetails();

//         // Cleanup localStorage after 5 minutes
//         const timer = setTimeout(() => {
//             localStorage.removeItem('orderDetails');
//         }, 5 * 60 * 1000);

//         return () => clearTimeout(timer);
//     }, [searchParams]);

//     const navigationButtons = [
//         {
//             label: 'Go to Home',
//             icon: <Home className="w-5 h-5" />,
//             action: () => router.push('/'),
//             className: 'bg-green-600 hover:bg-green-700'
//         },
//         {
//             label: 'My Orders',
//             icon: <Package className="w-5 h-5" />,
//             action: () => {
//                 if(cust) {

//                     router.push('/account?tab=orders')
//                 }else {
//                     router.push('/mu/dashboard/orders')
//                 }
            
//             },
//             className: 'bg-blue-600 hover:bg-blue-700'
//         },
//         {
//             label: 'Continue Shopping',
//             icon: <ShoppingBag className="w-5 h-5" />,
//             action: () => router.push('/shop'),
//             className: 'bg-purple-600 hover:bg-purple-700'
//         }
//     ];

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8 text-center">
//                 {/* Success Animation */}
//                 <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ duration: 0.5 }}
//                     className="flex justify-center"
//                 >
//                     <div className="relative">
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.3 }}
//                             className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse"
//                         />
//                         <CheckCircle className="relative w-24 h-24 text-green-500" />
//                     </div>
//                 </motion.div>

//                 {/* Thank You Message */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.5, duration: 0.5 }}
//                 >
//                     <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//                         Payment Successful!
//                     </h2>
//                     <p className="mt-2 text-sm text-gray-600">
//                         Thank you for your purchase. Your order has been confirmed.
//                     </p>
//                 </motion.div>

//                 {/* Order Details */}
//                 {orderDetails && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 1, duration: 0.5 }}
//                     >
//                         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
//                             <div className="space-y-2 text-sm text-gray-600">
//                                 <p className="flex justify-between">
//                                     <span>Order Number:</span>
//                                     <span className="font-medium">{orderDetails.order_number}</span>
//                                 </p>
//                                 <p className="flex justify-between">
//                                     <span>Total Amount:</span>
//                                     <span className="font-medium">₹{parseFloat(orderDetails.final_amount).toFixed(2)}</span>
//                                 </p>
//                                 <p className="flex justify-between">
//                                     <span>Order Date:</span>
//                                     <span className="font-medium">
//                                         {new Date(orderDetails.order_date).toLocaleDateString()}
//                                     </span>
//                                 </p>
//                                 <p className="flex justify-between">
//                                     <span>Order Status:</span>
//                                     <span className="font-medium text-green-600">
//                                         {orderDetails.status}
//                                     </span>
//                                 </p>
//                                 <p className="flex justify-between">
//                                     <span>Total BP Points:</span>
//                                     <span className="font-medium">
//                                         {orderDetails.total_bp}
//                                     </span>
//                                 </p>
//                             </div>

//                             {/* Order Items */}
//                             <div className="mt-6">
//                                 <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Items</h4>
//                                 {orderDetails.items && orderDetails.items.map((item, index) => (
//                                     <div 
//                                         key={index} 
//                                         className="flex justify-between items-center py-2 border-b last:border-b-0"
//                                     >
//                                         <div className="flex items-center">
//                                             <span className="text-sm">{item.product.name}</span>
//                                             <span className="text-xs text-gray-500 ml-2">
//                                                 (Qty: {item.quantity})
//                                             </span>
//                                         </div>
//                                         <span className="text-sm font-medium">
//                                             ₹{parseFloat(item.final_price).toFixed(2)}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}

//                 {/* Navigation Buttons */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 1.2, duration: 0.5 }}
//                     className="grid gap-3 mt-8"
//                 >
//                     {navigationButtons.map((button) => (
//                         <button
//                             key={button.label}
//                             onClick={button.action}
//                             className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white transition-colors ${button.className} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
//                         >
//                             {button.icon}
//                             {button.label}
//                         </button>
//                     ))}
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default ThankYouPage;


'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Home, User, ShoppingBag, Package, Truck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getTokens } from '@/utils/cookies';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const ThankYouPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);

    const isMlmMember = userInfo?.role === 'MLM_MEMBER';

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderId = searchParams.get('order_id');
                if (!orderId) {
                    setError('No order ID found in URL parameters');
                    console.error('No order ID found in URL parameters');
                    
                    // Try to get from localStorage as fallback
                    const storedDetails = localStorage.getItem('orderDetails');
                    if (storedDetails) {
                        setOrderDetails(JSON.parse(storedDetails));
                    } else {
                        throw new Error('No order ID found');
                    }
                    return;
                }

                // Get authentication token
                const { token } = getTokens();
                if (!token) {
                    setError('Not authenticated');
                    throw new Error('Not authenticated');
                }

                // Fetch order details from API
                console.log(`Fetching order: ${orderId}`);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allorders/${orderId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to fetch order details');
                    throw new Error(errorData.message || 'Failed to fetch order details');
                }

                const data = await response.json();
                console.log('Order details received:', data);
                setOrderDetails(data);
                
                // Store in localStorage as backup
                localStorage.setItem('orderDetails', JSON.stringify(data));
            } catch (error) {
                console.error('Error fetching order details:', error);
                toast.error('Could not fetch order details');
                
                // Fallback to localStorage if available
                const storedDetails = localStorage.getItem('orderDetails');
                if (storedDetails) {
                    try {
                        setOrderDetails(JSON.parse(storedDetails));
                    } catch (e) {
                        console.error('Error parsing stored order details:', e);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();

        // Cleanup localStorage after 5 minutes
        const timer = setTimeout(() => {
            localStorage.removeItem('orderDetails');
        }, 5 * 60 * 1000);

        return () => clearTimeout(timer);
    }, [searchParams]);

    // Determine where to redirect for "My Orders"
    const getOrdersPath = () => {
        return isMlmMember ? '/mu/dashboard/orders' : '/account?tab=orders';
    };
    const getShopPath = () => {
        return isMlmMember ? '/mu/dashboard/shop' : '/shop';
    };

    const navigationButtons = [
        {
            label: 'Go to Home',
            icon: <Home className="w-5 h-5" />,
            action: () => router.push('/'),
            className: 'bg-green-600 hover:bg-green-700'
        },
        {
            label: 'My Orders',
            icon: <Package className="w-5 h-5" />,
            action: () => router.push(getOrdersPath()),
            className: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            label: 'Continue Shopping',
            icon: <ShoppingBag className="w-5 h-5" />,
            action: () =>router.push(getShopPath()),
            className: 'bg-purple-600 hover:bg-purple-700'
        }
    ];

    // Fallback content for when details are unavailable but we know payment was successful
    const renderFallbackContent = () => (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Confirmation</h3>
            <div className="space-y-2 text-sm text-gray-600">
                <p className="text-center">
                    Your order has been placed successfully. You can view your order details in "My Orders".
                </p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center"
                >
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse"
                        />
                        <CheckCircle className="relative w-24 h-24 text-green-500" />
                    </div>
                </motion.div>

                {/* Thank You Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Payment Successful!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>
                </motion.div>

                {/* Order Details */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    {orderDetails ? (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p className="flex justify-between">
                                    <span>Order Number:</span>
                                    <span className="font-medium">{orderDetails.order_number}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Total Amount:</span>
                                    <span className="font-medium">₹{parseFloat(orderDetails.final_amount).toFixed(2)}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Order Date:</span>
                                    <span className="font-medium">
                                        {new Date(orderDetails.order_date).toLocaleDateString()}
                                    </span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Order Status:</span>
                                    <span className="font-medium text-green-600">
                                        {orderDetails.status}
                                    </span>
                                </p>
                                {orderDetails.total_bp > 0 && (
                                    <p className="flex justify-between">
                                        <span>Total BP Points:</span>
                                        <span className="font-medium">
                                            {orderDetails.total_bp}
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Order Items */}
                            {orderDetails.items && orderDetails.items.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Items</h4>
                                    <div className="max-h-40 overflow-y-auto">
                                        {orderDetails.items.map((item, index) => (
                                            <div 
                                                key={index} 
                                                className="flex justify-between items-center py-2 border-b last:border-b-0"
                                            >
                                                <div className="flex items-center">
                                                    <span className="text-sm">{item.product?.name || 'Product'}</span>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        (Qty: {item.quantity})
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    ₹{parseFloat(item.final_price).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : renderFallbackContent()}
                </motion.div>

                {/* Navigation Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="grid gap-3 mt-8"
                >
                    {navigationButtons.map((button) => (
                        <button
                            key={button.label}
                            onClick={button.action}
                            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white transition-colors ${button.className} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                        >
                            {button.icon}
                            {button.label}
                        </button>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default ThankYouPage;