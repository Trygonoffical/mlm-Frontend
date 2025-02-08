import React from 'react'
import PaymentButton from '@/components/PaymentButton/PaymentButton';
const PayOrder = () => {
  return (
    <>
        <PaymentButton
        amount={1}
        keyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}
        />
    </>
  )
}

export default PayOrder