'use client';

import React, { useEffect } from 'react';
import { CheckCircle, Home, User, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const ThankYouPage = () => {
    const router = useRouter();
    const orderDetails = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('orderDetails') || '{}') : {};

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.removeItem('orderDetails');
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const navigationButtons = [
        {
            label: 'Go to Home',
            icon: <Home className="w-5 h-5" />,
            action: () => router.push('/'),
            className: 'bg-green-600 hover:bg-green-700'
        },
        {
            label: 'My Account',
            icon: <User className="w-5 h-5" />,
            action: () => router.push('/account'),
            className: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            label: 'Continue Shopping',
            icon: <ShoppingBag className="w-5 h-5" />,
            action: () => router.push('/shop'),
            className: 'bg-purple-600 hover:bg-purple-700'
        }
    ];

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
                    {orderDetails.orderId && (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p className="flex justify-between">
                                    <span>Order ID:</span>
                                    <span className="font-medium">{orderDetails.orderId}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Amount:</span>
                                    <span className="font-medium">₹{orderDetails.amount}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Payment ID:</span>
                                    <span className="font-medium">{orderDetails.paymentId}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Navigation Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="grid gap-3 mt-8"
                >
                    {navigationButtons.map((button, index) => (
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