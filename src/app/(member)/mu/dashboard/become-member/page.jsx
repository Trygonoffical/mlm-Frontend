import CreateCommissionActivationRequest from '@/components/MLMMember/MemberRequest/CreateCommissionActivationRequest'
import StatusList from '@/components/MLMMember/MemberRequest/StatusList'
import React from 'react'

const BecomeMemberPage = () => {
  return (
    <>
    {/* <div className='p-4 text-center mt-5 py-5'>
        <h2 className='font-bold text-2xl text-blue-600'>Become MLM Earning Member </h2>
        <p className='pb-4 text-gray-600 pt-3'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime sed, reiciendis tempore aperiam totam id sequi accusamus quo voluptates. Ipsa, ad minus! Incidunt ea amet temporibus quos alias in rerum.
        </p>
        <div className='flex justify-center'>
             <CreateCommissionActivationRequest />
        </div>

    </div> */}
    <div className='py-5'>
        <CreateCommissionActivationRequest />
    </div>
    <StatusList />
        
    </>
  )
}

export default BecomeMemberPage