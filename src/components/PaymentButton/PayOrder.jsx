import React from 'react'
import PaymentButton from '@/components/PaymentButton/PaymentButton';
const PayOrder = ({amount}) => {
  return (
    <>
        <PaymentButton
        amount={amount}
        keyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}
        />
    </>
  )
}

export default PayOrder