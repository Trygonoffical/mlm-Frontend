// 'use client'
// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useRouter } from 'next/navigation';
// // import { setUserLogin } from '@/redux/reducers/authSlice';
// import { Phone } from 'lucide-react';
// import { setUserLogin } from '@/redux/slices/authSlice';
// const CustomerLogin = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const dispatch = useDispatch();
//   const router = useRouter();

//   const handleSendOtp = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const response = await fetch('http://127.0.0.1:8000/api/v1/generate-otp/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ phone_number: phoneNumber }),
//       });
      
//       const data = await response.json();
      
//       if (data.status) {
//         setIsOtpSent(true);
//       } else {
//         setError(data.message || 'Failed to send OTP');
//       }
//     } catch (error) {
//       setError('Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const response = await fetch('http://127.0.0.1:8000/api/v1/verify-otp/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ phone_number: phoneNumber, otp }),
//       });
      
//       const data = await response.json();
      
//       if (data.status) {
//         // Store user info and token in Redux
//         dispatch(setUserLogin({
//           token: data.token,
//           ...data.user_info
//         }));

//         // Redirect to home or dashboard
//         router.push('/');
//       } else {
//         setError(data.message || 'Invalid OTP');
//       }
//     } catch (error) {
//       setError('Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
//         <div>
//           <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
//             Welcome Back!
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Login with your phone number
//           </p>
//         </div>

//         <div className="mt-8 space-y-6">
//           {error && (
//             <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
//               {error}
//             </div>
//           )}

//           <div className="space-y-4">
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone Number
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Phone className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   required
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
//                   className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 
//                     border border-gray-300 placeholder-gray-500 text-gray-900 
//                     focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter your phone number"
//                   maxLength={10}
//                   disabled={loading || isOtpSent}
//                 />
//               </div>
//             </div>

//             {isOtpSent && (
//               <div>
//                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
//                   Enter OTP
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="otp"
//                     name="otp"
//                     type="text"
//                     required
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
//                     className="appearance-none rounded-md relative block w-full px-3 py-2
//                       border border-gray-300 placeholder-gray-500 text-gray-900 
//                       focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter 6-digit OTP"
//                     maxLength={6}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             )}

//             <button
//               onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
//               disabled={loading || (isOtpSent ? otp.length !== 6 : phoneNumber.length !== 10)}
//               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent 
//                 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
//                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
//                 disabled:bg-blue-300 disabled:cursor-not-allowed
//                 transition-colors duration-200`}
//             >
//               {loading ? (
//                 <div className="flex items-center">
//                   <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
//                   Loading...
//                 </div>
//               ) : isOtpSent ? (
//                 'Verify OTP'
//               ) : (
//                 'Send OTP'
//               )}
//             </button>

//             {isOtpSent && (
//               <div className="text-center">
//                 <button
//                   onClick={() => {
//                     setIsOtpSent(false);
//                     setOtp('');
//                     setError('');
//                   }}
//                   className="text-sm text-blue-600 hover:text-blue-500 font-medium"
//                 >
//                   Change phone number?
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerLogin;