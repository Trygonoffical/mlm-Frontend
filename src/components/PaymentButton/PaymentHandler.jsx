// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';
// import { useSelector } from 'react-redux';
// import { getTokens } from '@/utils/cookies';

// const PaymentHandler = ({ amount, orderData }) => {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { userInfo } = useSelector((state) => state.auth);
//   const { cartItems, totalBPPoints } = useSelector((state) => state.cart);

//   const createOrder = async () => {
//     try {
//       const { token } = getTokens();
      
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/create/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           total: amount,
//           finalTotal: amount,
//           totalBPPoints,
//           items: cartItems.map(item => ({
//             id: item.id,
//             quantity: item.qnt,
//             price: item.selling_price,
//             total_price: item.total_price,
//             bp_points: item.bp_value * item.qnt
//           }))
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create order');
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Order creation error:', error);
//       throw error;
//     }
//   };

//   const initializeRazorpay = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => {
//         resolve(true);
//       };
//       script.onerror = () => {
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const makePayment = async () => {
//     setLoading(true);
//     try {
//       const res = await initializeRazorpay();

//       if (!res) {
//         toast.error('Razorpay SDK failed to load');
//         return;
//       }

//       const orderData = await createOrder();

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: "Company Name",
//         description: "Order Payment",
//         order_id: orderData.razorpay_order_id,
//         handler: async function (response) {
//           try {
//             const { token } = getTokens();
//             const verifyRes = await fetch(
//               `${process.env.NEXT_PUBLIC_API_URL}/payments/verify/`,
//               {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                   'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_signature: response.razorpay_signature
//                 })
//               }
//             );

//             if (verifyRes.ok) {
//               router.push(`/thank-you/${orderData.order_id}`);
//             } else {
//               throw new Error('Payment verification failed');
//             }
//           } catch (error) {
//             console.error('Payment verification error:', error);
//             toast.error('Payment verification failed');
//           }
//         },
//         prefill: {
//           name: userInfo?.firstName + ' ' + userInfo?.lastName,
//           email: userInfo?.email,
//           contact: userInfo?.phone
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();

//     } catch (error) {
//       console.error('Payment error:', error);
//       toast.error('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={makePayment}
//       disabled={loading}
//       className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
//                transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//     >
//       {loading ? (
//         <div className="flex items-center">
//           <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
//           Processing...
//         </div>
//       ) : (
//         'Pay Now'
//       )}
//     </button>
//   );
// };

// export default PaymentHandler;


// 'use client';

// import { CreditCard } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSelector } from 'react-redux';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';

// const PaymentHandler = ({ amount }) => {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { cartItems, totalBPPoints } = useSelector((state) => state.cart);
//   const { userInfo } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const handlePayment = async () => {
//     setLoading(true);
//     try {
//       const { token } = getTokens();
      
//       // Create order
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/create/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           items: cartItems.map(item => ({
//             id: item.id,
//             quantity: item.qnt,
//             price: item.selling_price,
//             total_price: item.total_price,
//             bp_points: item.bp_value * item.qnt
//           })),
//           total: amount,
//           totalBPPoints
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to create order');
//       }

//       // Initialize Razorpay
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: data.amount,
//         currency: data.currency,
//         name: "Trygon Technologies",
//         description: "Order Payment",
//         order_id: data.razorpay_order_id,
//         handler: async function (response) {
//           try {
//             const verifyResponse = await fetch(
//               `${process.env.NEXT_PUBLIC_API_URL}/verify-payment/`,
//               {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                   'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_signature: response.razorpay_signature
//                 })
//               }
//             );

//             const verifyData = await verifyResponse.json();

//             if (verifyData.status === 'success') {
//               router.push(`/thank-you`);
//               // router.push(`/thank-you/${data.order_id}`);
//             } else {
//               throw new Error(verifyData.message || 'Payment verification failed');
//             }
//           } catch (error) {
//             console.error('Payment verification error:', error);
//             toast.error('Payment verification failed');
//             setLoading(false);
//           }
//         },
//         prefill: {
//           name: userInfo?.first_name + ' ' + userInfo?.last_name || '',
//           email: userInfo?.email || '',
//           contact: userInfo?.phone_number || ''
//         },
//         theme: {
//           color: "#3399cc"
//         }
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();

//     } catch (error) {
//       console.error('Payment error:', error);
//       toast.error(error.message || 'Something went wrong');
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handlePayment}
//       disabled={loading}
//       className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
//                  transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//     >
//       {loading ? (
//         'Processing...'
//       ) : (
//         <>
//           <CreditCard className="w-5 h-5" />
//           Place Order
//         </>
//       )}
//     </button>
//   );
// };

// export default PaymentHandler;



// 'use client';

// import { CreditCard } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSelector, useDispatch } from 'react-redux';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import { clearCart } from '@/redux/slices/cartSlice'; // Import the clear cart action

// const PaymentHandler = ({ amount }) => {
//   const [loading, setLoading] = useState(false);
//   const [orderCreated, setOrderCreated] = useState(false);
//   const router = useRouter();
//   const dispatch = useDispatch();
  
//   const { cartItems, totalBPPoints } = useSelector((state) => state.cart);
//   const { userInfo } = useSelector((state) => state.auth);
//   const { token } = getTokens();
//   // Load Razorpay script
//   useEffect(() => {
//     const loadRazorpayScript = () => {
//       return new Promise((resolve) => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         script.onload = () => resolve(true);
//         script.onerror = () => {
//           toast.error("Failed to load payment gateway");
//           resolve(false);
//         };
//         document.body.appendChild(script);
//       });
//     };

//     loadRazorpayScript();
//   }, []);

//   const createOrder = async () => {

//     if (!token) {
//       throw new Error('Authentication required');
//     }

//     // Validate cart items
//     if (!cartItems.length) {
//       throw new Error('Cart is empty');
//     }

//     // Create order items with proper structure
//     const orderItems = cartItems.map(item => ({
//       id: item.id,
//       quantity: item.qnt,
//       price: parseFloat(item.selling_price),
//       discount_percentage: item.discount_percentage || 0,
//       total_price: item.total_price,
//       bp_points: item.bp_value * item.qnt,
//       gst_amount: (item.gst_percentage / 100) * item.selling_price * item.qnt
//     }));

//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/create/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         items: orderItems,
//         total_amount: amount,
//         total_bp: totalBPPoints,
//         // Include any additional required fields from your Order model
//         // shipping_address: userInfo?.shipping_address || '',
//         // billing_address: userInfo?.billing_address || ''
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to create order');
//     }

//     return await response.json();
//   };

//   const initializeRazorpay = (orderData) => {
//     if (!window.Razorpay) {
//       throw new Error('Razorpay not loaded');
//     }

//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       amount: orderData.amount,
//       currency: orderData.currency,
//       name: "Trygon Technologies",
//       description: `Order #${orderData.order_number}`,
//       order_id: orderData.razorpay_order_id,
//       prefill: {
//         name: `${userInfo?.first_name} ${userInfo?.last_name}`.trim(),
//         email: userInfo?.email || '',
//         contact: userInfo?.phone_number || ''
//       },
//       theme: {
//         color: "#6B8E5F"
//       },
//       handler: async (response) => {
//         try {
//           await verifyPayment(response, orderData.order_id);
//         } catch (error) {
//           console.error('Payment verification error:', error);
//           toast.error('Payment verification failed');
//           setLoading(false);
//         }
//       }
//     };

//     const razorpay = new window.Razorpay(options);
//     razorpay.on('payment.failed', (response) => {
//       toast.error('Payment failed. Please try again.');
//       setLoading(false);
//     });

//     return razorpay;
//   };

//   const verifyPayment = async (paymentResponse, orderId) => {
    
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/verify-payment/`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           order_id: orderId,
//           razorpay_payment_id: paymentResponse.razorpay_payment_id,
//           razorpay_order_id: paymentResponse.razorpay_order_id,
//           razorpay_signature: paymentResponse.razorpay_signature
//         })
//       }
//     );

//     const verifyData = await response.json();
//     if (verifyData.status === 'success') {
//       dispatch(clearCart()); // Clear the cart after successful payment
//       // router.push(`/thank-you`);
//       router.push(`/thankyou?order_id=${verifyData.order_id}`);
//       // router.push(`/thank-you/${orderId}`);
//     } else {
//       throw new Error(verifyData.message || 'Payment verification failed');
//     }
//   };

//   const handlePayment = async () => {
//     if (loading || !amount) return;

//     setLoading(true);
//     try {
//       // Create order first
//       const orderData = await createOrder();
//       setOrderCreated(true);

//       // Initialize and open Razorpay
//       const razorpay = initializeRazorpay(orderData);
//       razorpay.open();
//     } catch (error) {
//       console.error('Payment error:', error);
//       toast.error(error.message || 'Something went wrong');
//       // If order was created but payment failed, you might want to handle this case
//       if (orderCreated) {
//         // Handle order cleanup or cancellation
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!userInfo) {
//     return (
//       <div className="text-red-500 text-center p-4">
//         Please login to continue with payment
//       </div>
//     );
//   }

//   return (
//     <button
//       onClick={handlePayment}
//       disabled={loading || !cartItems.length}
//       className="w-full mt-6 bg-[#6B8E5F] text-white py-3 rounded-lg hover:bg-[#5c7a51] 
//                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed
//                  flex items-center justify-center gap-2"
//     >
//       {loading ? (
//         <span className="flex items-center gap-2">
//           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           Processing...
//         </span>
//       ) : (
//         <>
//           <CreditCard className="w-5 h-5" />
//           Place Order
//         </>
//       )}
//     </button>
//   );
// };

// export default PaymentHandler;

'use client';

import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { clearCart } from '@/redux/slices/cartSlice'; // Import the clear cart action

const PaymentHandler = ({ amount }) => {
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { cartItems, totalBPPoints } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { token } = getTokens();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => {
          toast.error("Failed to load payment gateway");
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Cleanup function in case the component unmounts during payment process
  useEffect(() => {
    return () => {
      // If order was created but payment was not completed, we might want to cancel it
      if (orderCreated && orderId && !window.location.pathname.includes('thankyou')) {
        cancelIncompleteOrder(orderId);
      }
    };
  }, [orderCreated, orderId]);

  // Function to cancel incomplete orders (can be called when user abandons checkout)
  const cancelIncompleteOrder = async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/cancel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Incomplete order cancelled');
    } catch (error) {
      console.error('Error cancelling incomplete order:', error);
    }
  };

  const createOrder = async () => {
    if (!token) {
      throw new Error('Authentication required');
    }

    // Validate cart items
    if (!cartItems.length) {
      throw new Error('Cart is empty');
    }

    // Create order items with proper structure
    const orderItems = cartItems.map(item => ({
      id: item.id,
      quantity: item.qnt,
      price: parseFloat(item.selling_price),
      discount_percentage: item.discount_percentage || 0,
      total_price: item.total_price,
      bp_points: item.bp_value * item.qnt,
      gst_amount: (item.gst_percentage / 100) * item.selling_price * item.qnt
    }));

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: orderItems,
        total_amount: amount,
        total_bp: totalBPPoints,
        // Include any additional required fields from your Order model
        // shipping_address: userInfo?.shipping_address || '',
        // billing_address: userInfo?.billing_address || ''
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    const orderData = await response.json();
    setOrderId(orderData.order_id);
    return orderData;
  };

  const initializeRazorpay = (orderData) => {
    if (!window.Razorpay) {
      throw new Error('Razorpay not loaded');
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Trygon Technologies",
      description: `Order #${orderData.order_number || orderData.razorpay_order_id}`,
      order_id: orderData.razorpay_order_id,
      prefill: {
        name: `${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`.trim(),
        email: userInfo?.email || '',
        contact: userInfo?.phone_number || ''
      },
      theme: {
        color: "#6B8E5F"
      },
      handler: async (response) => {
        try {
          await verifyPayment(response, orderData.order_id);
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error('Payment verification failed');
          setLoading(false);
        }
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
          toast.error('Payment cancelled. Your order will be held for a short time.');
        },
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', (response) => {
      toast.error('Payment failed. Please try again.');
      setLoading(false);
    });

    return razorpay;
  };

  const verifyPayment = async (paymentResponse, orderId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-payment/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            order_id: orderId,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            update_stock: true // Add this flag to ensure stock is updated
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment verification failed');
      }

      const verifyData = await response.json();
      
      if (verifyData.status === 'success') {
        // Now update the stock for all items in the cart
        await updateProductStock();
        
        dispatch(clearCart()); // Clear the cart after successful payment
        router.push(`/thankyou?order_id=${verifyData.order_id}`);
        
        // Show success notification
        toast.success('Order placed successfully!');
      } else {
        throw new Error(verifyData.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error(error.message || 'Payment verification failed');
      throw error;
    }
  };

  // Function to update product stock after successful payment
  const updateProductStock = async () => {
    try {
      // Create a list of products and quantities to update
      const stockUpdates = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.qnt
      }));

      // Send the stock update request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-stock/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: stockUpdates })
      });

      if (!response.ok) {
        console.error('Stock update failed');
        // We don't want to throw here as the payment is already successful
        // Just log the error but continue with the checkout flow
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      // Again, don't throw - just log the error
    }
  };

  const handlePayment = async () => {
    if (loading || !amount) return;

    setLoading(true);
    try {
      // Check stock availability before creating order
      const stockCheck = await checkStockAvailability();
      if (!stockCheck.success) {
        toast.error(stockCheck.message);
        return;
      }

      // Create order first
      const orderData = await createOrder();
      setOrderCreated(true);

      // Initialize and open Razorpay
      const razorpay = initializeRazorpay(orderData);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Something went wrong');
      // If order was created but payment failed, you might want to handle this case
      if (orderCreated && orderId) {
        // We'll let the cleanup function handle this
      }
    } finally {
      // Don't set loading to false here - it will be set in the payment handler
      // or when modal is dismissed
    }
  };

  // Function to check if all items in cart are available in stock
  const checkStockAvailability = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-stock/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.qnt
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { 
          success: false, 
          message: errorData.message || 'Failed to check stock availability' 
        };
      }

      const stockData = await response.json();
      return stockData;
    } catch (error) {
      console.error('Stock check error:', error);
      return { 
        success: false, 
        message: 'Failed to check stock availability' 
      };
    }
  };

  if (!userInfo) {
    return (
      <div className="text-red-500 text-center p-4">
        Please login to continue with payment
      </div>
    );
  }

  const isDisabled = loading || !cartItems.length || amount <= 0;

  return (
    <button
      onClick={handlePayment}
      disabled={isDisabled}
      className="w-full mt-6 bg-[#6B8E5F] text-white py-3 rounded-lg hover:bg-[#5c7a51] 
                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          Place Order
        </>
      )}
    </button>
  );
};

export default PaymentHandler;