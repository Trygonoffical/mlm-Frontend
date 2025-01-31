"use client"
import { Fragment, useState , useContext, useEffect} from 'react'
import { Dialog,DialogPanel, DialogTitle,Transition ,TransitionChild } from '@headlessui/react'
import { XMarkIcon, ShoppingCartIcon , ShoppingBagIcon, TrashIcon} from '@heroicons/react/24/outline'
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { showCartSidebar, hideCartSidebar, removeItemFromCart } from '@/redux/slices/cartSlice'; // Import actions
import { useRouter } from 'next/navigation';
import { Phone , User , KeyIcon} from 'lucide-react';
import { updateUserInfo } from '@/redux/slices/authSlice';
import { setTokens } from '@/utils/cookies';
import toast from 'react-hot-toast';

export default function SendOtp({checkoutpage}) {
    const router = useRouter();
    const [isCartSidebarVisible , setisCartSidebarVisible]  = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimeout, setResendTimeout] = useState(0);
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const startResendTimer = () => {
        setResendTimeout(30);
        const timer = setInterval(() => {
          setResendTimeout((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };


    const handleSendOtp = async () => {
        try {
        setLoading(true);
        setError('');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-otp/`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: phoneNumber }),
        });
        
        const data = await response.json();
        
        if (data.status) {
            setIsOtpSent(true);
            setResendTimeout(30);
            toast.success('OTP sent successfully');
        } else {
            setError(data.message || 'Failed to send OTP');
            toast.error(data.message || 'Failed to send OTP');
        }
        } catch (error) {
        setError('Something went wrong. Please try again.');
        toast.error('Network error. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
        setLoading(true);
        setError('');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-otp/`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: phoneNumber, otp }),
        });
        
        const data = await response.json();
        console.log('data console - ' , data);
        if (data.status) {
            // Store tokens in cookies
            setTokens(data.token, data.refresh);
            console.log('after token set ' , );
            dispatch(updateUserInfo({
            ...data.userinfo
            }));
            // Clear form state
            setPhoneNumber('');
            setOtp('');
            setIsOtpSent(false);
            setResendTimeout(0);

            // Close the sidebar
            setisCartSidebarVisible(false);

            // Show success message
            toast.success('Login successful');

            // Store user info and token in Redux
            // dispatch(setUserLogin({
            // token: data.token,
            // ...data.user_info
            // }));

            // Redirect to home or dashboard
            // Redirect based on role
            // if (data.role === 'CUSTOMER') {
            //     router.push('/account');
            // } else {
            //     router.push('/auth/dashboard');
            // }
            
            // router.push('/');
        } else {
            setError(data.message || 'Invalid OTP');
            // toast.error(data.message || 'Invalid OTP');
        }
        } catch (error) {
        setError('Something went wrong. Please try again.');
        // toast.error('Network error. Please try again.');
        } finally {
        setLoading(false);
        }
    };
      const showverifyNumber = () =>{
        // setisCartSidebarVisible(true);
        if (!userInfo) { // Only show if user is not logged in
            setisCartSidebarVisible(true);
        }
      }
    //   // hide CartSidebar 
      const hideOtpSidebarStatus = ()=>{
        // console.log('vvvv')
        setisCartSidebarVisible(false);
        // Reset all form state
        setPhoneNumber('');
        setOtp('');
        setIsOtpSent(false);
        setResendTimeout(0);
        setError('');
      }

    // Add this useEffect to manage the resend timer
    useEffect(() => {
        let timer;
        if (resendTimeout > 0) {
        timer = setInterval(() => {
            setResendTimeout((prev) => prev - 1);
        }, 1000);
        }
        return () => {
        if (timer) clearInterval(timer);
        };
    }, [resendTimeout]);

    // Add this useEffect
    useEffect(() => {
        console.log('in sendotp - checkoutpage val', checkoutpage)
        // If user is logged in and sidebar is open, close it
        if (userInfo && isCartSidebarVisible) {
            setisCartSidebarVisible(false);
        }
    }, [userInfo]);


  return (
    <>
        {checkoutpage ? (
             <button
             onClick={()=>showverifyNumber()}
             className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
                      transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
           >

                 <KeyIcon className="w-5 h-5" />
                login
           </button>
        ):(
        <button className="group flex items-center p-2"  onClick={()=>showverifyNumber()}>
            <User className="w-6 h-6 cursor-pointer" />
        </button>
        )}
        
        <Transition show={isCartSidebarVisible} as={Fragment}>
        <Dialog className="relative z-[9999]" onClose={()=>hideOtpSidebarStatus()}>
            <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-400"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full md:pl-10">
                <TransitionChild
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-400"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-400"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                >
                    <DialogPanel className="pointer-events-auto w-screen max-w-md ">
                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                <div className="flex items-start justify-between">
                                    <DialogTitle className="text-lg font-medium text-gray-900"></DialogTitle>
                                    <div className="ml-3 flex h-7 items-center">
                                    <button
                                        type="button"
                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                        onClick={()=>hideOtpSidebarStatus()}
                                    >
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Close panel</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="flow-root">
                                    <div>
                                        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                                            Welcome Back!
                                        </h2>
                                        <p className="mt-2 text-center text-sm text-gray-600">
                                            Login with your phone number
                                        </p>
                                    </div>

                                        <div className="mt-8 space-y-6">
                                        {error && (
                                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                                            {error}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 z-50 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-green-400" />
                                                </div>
                                                <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 
                                                    border border-gray-300 placeholder-gray-500 text-gray-900 
                                                    focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your phone number"
                                                maxLength={10}
                                                disabled={loading || isOtpSent}
                                                />
                                            </div>
                                            </div>

                                            {isOtpSent && (
                                            <div>
                                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                                Enter OTP
                                                </label>
                                                <div className="relative">
                                                <input
                                                    id="otp"
                                                    name="otp"
                                                    type="text"
                                                    required
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                    className="appearance-none rounded-md relative block w-full px-3 py-2
                                                    border border-gray-300 placeholder-gray-500 text-gray-900 
                                                    focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter 6-digit OTP"
                                                    maxLength={6}
                                                    disabled={loading}
                                                />
                                                </div>
                                            </div>
                                            )}

                                            <button
                                            onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                                            disabled={loading || (isOtpSent ? otp.length !== 6 : phoneNumber.length !== 10)}
                                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent 
                                                text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                                disabled:bg-blue-300 disabled:cursor-not-allowed
                                                transition-colors duration-200`}
                                            >
                                            {loading ? (
                                                <div className="flex items-center">
                                                <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                                                Loading...
                                                </div>
                                            ) : isOtpSent ? (
                                                'Verify OTP'
                                            ) : (
                                                'Send OTP'
                                            )}
                                            </button>

                                            {isOtpSent && (
                                            <div className="text-center">
                                                <button
                                                onClick={() => {
                                                    setIsOtpSent(false);
                                                    setOtp('');
                                                    setError('');
                                                }}
                                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                                >
                                                Change phone number?
                                                </button>
                                            </div>
                                            )}
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </TransitionChild>
                </div>
            </div>
            </div>
        </Dialog>
        </Transition>
    </>
    
  )
}
