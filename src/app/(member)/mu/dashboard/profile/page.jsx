import BankDetailsForm from '@/components/Kyc/BankDetailsForm'
import CompanyInfoForm from '@/components/Profile/CompanyInfoForm'
import React from 'react'

const ProfilePage = () => {
  return (
    <>
        {/* <CompanyInfoForm /> */}
        {/* Add Bank Details section */}
        <div className="my-8">
          <h2 className="text-xl font-semibold mb-4">Bank Account Information</h2>
          <BankDetailsForm />
        </div>
    </>
  )
}

export default ProfilePage