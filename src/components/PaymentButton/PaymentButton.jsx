'use client'
import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';

// PaymentButton Component
const PaymentButton = ({ amount, keyId }) => {
    const [loading, setLoading] = useState(false);
  


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {

      const Orderresponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount// amount in INR
        }),
      });
      const Orderdata = await Orderresponse.json();
      if(!Orderresponse.ok)  console.error('Server response:', Orderdata.details);
      const order_id = Orderdata.order_id ;


    const options = {
      key: keyId,
      amount: amount * 100,
      currency: "INR",
      name: "TRYGON TECHNOLGIES",
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
        try {
          const verifyData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-payment/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const result = await verifyData.json();
          if (result.success) {
            alert('Payment successful!');
            console.log('logs - ', result)
          } else {
            alert('Payment verification failed');
            console.log('Payment verification failed logs - ', result)

          }
          console.log('result logs - ', result)

        } catch (err) {
          console.error(err);
          alert('Payment verification failed');
          
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#3399cc"
      }
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    console.log('payment object - ' , paymentObject)
    if(paymentObject.open()){
    console.log('payment object Open - ' )

    }else{
      console.log('payment object Closed - ' )

    }
  }catch (error) {
      console.error('Error:', error);
      setLoading(false);
    } 
  }

  return (
    <button 
      onClick={handlePayment}
      disabled={loading}
      // className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
                  transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
          'Processing...'
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Place Order
        </>
        )}
    {/* <CreditCard className="w-5 h-5" />  Pay Now */}
    </button>
  );
};



export default PaymentButton;
