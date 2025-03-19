'use client'

import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { showCartSidebar, hideCartSidebar, removeItemFromCart, updateQuantity } from '@/redux/slices/cartSlice';
import { XMarkIcon, ShoppingBagIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

function CartArea() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [mlmDiscountPercentage , setMlmDiscountPercentage] = useState(0)

    // Get cart state from Redux
    const {
        cartItems = [],
        cartCount = 0,
        subTotal = 0,
        totalGST = 0,
        total = 0,
        isCartSidebarVisible = false,
        regular_price = 0,
        mlmDiscount= 0,
        discountedSubTotal= 0,
        // mlmDiscountPercentage=0,
    } = useSelector((state) => state.cart);

    const [isMember, setIsMember] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(()=>{
        if(userInfo){
            if(userInfo.role != "CUSTOMER"){
                setIsMember(true);
            }
        }
        console.log('cart Iteams values - ', cartItems)
        console.log('cartCount Iteams values - ', cartCount)
        console.log('subTotal Iteams values - ', subTotal)
        console.log('totalGST Iteams values - ', totalGST)
        console.log('total Iteams values - ', total)
        console.log('regular_price Iteams values - ', regular_price)
        console.log('mlmDiscount Iteams values - ', mlmDiscount)
        console.log('discountedSubTotal Iteams values - ', discountedSubTotal)
        console.log('mlmDiscountPercentage Iteams values - ', userInfo?.user_data?.position?.discount_percentage)
        setMlmDiscountPercentage( userInfo?.user_data?.position?.discount_percentage)
    },[userInfo , cartItems]);
    // const calculateTotalAmount = (product) => {
    //     // Make sure the values exist and are numbers
    //     const sellingPrice = typeof product.selling_price === 'number' 
    //         ? product.selling_price 
    //         : parseFloat(product.selling_price) || 0;
            
    //     const gstPercentage = typeof product.gst_percentage === 'number'
    //         ? product.gst_percentage
    //         : parseFloat(product.gst_percentage) || 0;

    //     const gstAmount = (sellingPrice * gstPercentage) / 100;
    //     return parseFloat((sellingPrice + gstAmount).toFixed(2));
    // }
    const handleRemoveItem = (itemId, selectedAttributes) => {
        dispatch(removeItemFromCart({ itemID: itemId, selectedAttributes ,mlmDiscountPercentage}));
    };

    const handleQuantityChange = (itemId, selectedAttributes, change , mlmDiscountPercentage) => {
        dispatch(updateQuantity({ 
            itemID: itemId, 
            selectedAttributes, 
            change ,
            mlmDiscountPercentage
        }));
    };

    return (
        <>
            <button 
                className="group flex items-center p-2" 
                onClick={() => dispatch(showCartSidebar())}
                aria-label="Shopping cart"
            >
                <ShoppingBagIcon
                    className="h-6 w-6 flex-shrink-0 group-hover:text-gray-600"
                    aria-hidden="true"
                />
                <span className="ml-1 text-sm font-medium group-hover:text-gray-600">
                    {cartCount}
                </span>
                <span className="sr-only">items in cart, view bag</span>
            </button>

            {/* Cart Sidebar Dialog */}
            <Dialog 
                open={isCartSidebarVisible} 
                onClose={() => dispatch(hideCartSidebar())}
                className="relative z-[9999]"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <DialogPanel className="pointer-events-auto w-screen max-w-md">
                                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                    {/* Header */}
                                    <div className="flex items-start justify-between p-4">
                                        <DialogTitle className="text-lg font-medium">
                                            Shopping Cart ({cartCount} items)
                                        </DialogTitle>
                                        <button
                                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                            onClick={() => dispatch(hideCartSidebar())}
                                        >
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="flex-1 overflow-y-auto p-4">
                                        <div className="space-y-4">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="flex space-x-4">
                                                    <div className="relative h-24 w-24 flex-shrink-0">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="rounded-md object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-medium">{item.name}</h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                ₹{item.standard_price.toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => handleQuantityChange(item.id, item.selectedAttributes, -1 , mlmDiscountPercentage)}
                                                                    className="rounded-full p-1 hover:bg-gray-100"
                                                                >
                                                                    <MinusIcon className="h-4 w-4" />
                                                                </button>
                                                                <span>{item.qnt}</span>
                                                                <button
                                                                    onClick={() => handleQuantityChange(item.id, item.selectedAttributes, 1 , mlmDiscountPercentage)}
                                                                    className="rounded-full p-1 hover:bg-gray-100"
                                                                >
                                                                    <PlusIcon className="h-4 w-4" />
                                                                </button>
                                                            </div>

                                                            <button
                                                                onClick={() => handleRemoveItem(item.id, item.selectedAttributes , mlmDiscountPercentage)}
                                                                className="text-red-500 hover:text-red-600"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cart Footer */}
                                    <div className="border-t border-gray-200 p-4">
                                        {/* <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal</span>
                                                <span>₹{subTotal}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Discout</span>
                                                <span>₹{mlmDiscount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>GST</span>
                                                <span>₹{totalGST}</span>
                                            </div>
                                            <div className="flex justify-between text-base font-medium">
                                                <span>Total</span>
                                                <span>₹{total.toFixed(2)}</span>
                                            </div>
                                        </div> */}

                                        <div className="mt-4">
                                            <button
                                                className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                                onClick={() => {
                                                    dispatch(hideCartSidebar());
                                                    if(isMember){
                                                        router.push('/mu/dashboard/cart');
                                                    }else{
                                                        router.push('/cart');
                                                    }
                                                }}
                                            >
                                                Checkout
                                            </button>
                                        </div>

                                        <div className="mt-4 text-center text-sm text-gray-500">
                                            or {' '}
                                            <Link
                                                href={ isMember ? `/mu/dashboard/shop` : `/shop`} 
                                                className="text-green-600 hover:text-green-500"
                                                onClick={() => dispatch(hideCartSidebar())}
                                            >
                                                Continue Shopping
                                                <span aria-hidden="true"> →</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default CartArea;