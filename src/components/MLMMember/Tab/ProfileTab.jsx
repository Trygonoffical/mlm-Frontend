import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';

export const ProfileTab = ({ member }) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [bankDetails, setBankDetails] = useState(member.bank_details);
    const { token } = getTokens();

    const handleVerifyBankDetails = async (status) => {
        try {
            setIsVerifying(true);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/${member.member_id}/verify-bank/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status
                })
            });

            if (response.ok) {
                const data = await response.json();
                setBankDetails(data);
                toast.success(`Bank details ${status.toLowerCase()} successfully`);
            } else {
                throw new Error('Failed to verify bank details');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update bank details verification');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <p className="mt-1 text-gray-900">{`${member.user.first_name} ${member.user.last_name}`}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1 text-gray-900">{member.user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Phone</label>
                        <p className="mt-1 text-gray-900">{member.user.phone_number}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Join Date</label>
                        <p className="mt-1 text-gray-900">{new Date(member.join_date).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* MLM Information */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">MLM Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Position</label>
                        <p className="mt-1 text-gray-900">{member.position.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Sponsor</label>
                        <p className="mt-1 text-gray-900">{member.sponsor_name || 'Direct'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Total BP</label>
                        <p className="mt-1 text-gray-900">{member.total_bp}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Total Earnings</label>
                        <p className="mt-1 text-gray-900">₹{member.total_earnings}</p>
                    </div>
                </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Bank Information</h3>
                    {bankDetails && (
                        <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                ${bankDetails.is_verified 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'}`}>
                                {bankDetails.is_verified ? 'Verified' : 'Pending Verification'}
                            </span>
                        </div>
                    )}
                </div>
                
                {bankDetails ? (
                    <div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Bank Name</label>
                                <p className="mt-1 text-gray-900">{bankDetails.bank_name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Account Number</label>
                                <p className="mt-1 text-gray-900">{bankDetails.account_number}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">IFSC Code</label>
                                <p className="mt-1 text-gray-900">{bankDetails.ifsc_code}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Branch</label>
                                <p className="mt-1 text-gray-900">{bankDetails.branch_name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Account Holder</label>
                                <p className="mt-1 text-gray-900">{bankDetails.account_holder_name}</p>
                            </div>
                        </div>

                        {/* Verification Controls */}
                        {!bankDetails.is_verified && (
                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={() => handleVerifyBankDetails('VERIFIED')}
                                    disabled={isVerifying}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify Bank Details'}
                                </button>
                                <button
                                    onClick={() => handleVerifyBankDetails('REJECTED')}
                                    disabled={isVerifying}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                    {isVerifying ? 'Rejecting...' : 'Reject Bank Details'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">Bank details not updated</p>
                )}
            </div>
        </div>
    );
};