// components/MLMMember/Tab/AccountManagementTab.jsx
'use client'

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';

const AccountManagementTab = ({ member }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: member.user.first_name || '',
        last_name: member.user.last_name || '',
        email: member.user.email || '',
        phone_number: member.user.phone_number || '',
        new_password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { token } = getTokens();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/${member.member_id}/update-profile/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update profile');
            
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!formData.new_password) {
            toast.error('Please enter a new password');
            return;
        }

        setLoading(true);
        const { token } = getTokens();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/${member.member_id}/reset-password/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    new_password: formData.new_password
                })
            });

            if (!response.ok) throw new Error('Failed to reset password');
            
            toast.success('Password reset successfully');
            setFormData({ ...formData, new_password: '' });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Profile Information</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 rounded-md border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 rounded-md border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 rounded-md border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 rounded-md border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 px-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Reset Password</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md p-2 border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountManagementTab;