"use client";

import { useEffect, useState } from 'react';
// import { toast} from "react-toastify";
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '@/redux/slices/authSlice';
import { getTokens } from '@/utils/cookies';

export default function CustomerProfile() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });

  // Fixed handleInputChange to properly handle the input names
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateProfile = async () => {
    setLoading(true);
    const { token } = getTokens();

    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
        })
      });

      const data = await response.json();
      console.log('updated pro data - ', data)
      if (response.ok) {
        dispatch(updateUserInfo(data.userinfo));
        toast.success('Profile updated successfully!');
      } else {
        console.log('pro data - ', data)
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.message || 'Error updating profile');
      console.log('pro error data  - ', error)

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      console.log('user Info details - ', userInfo);
      setFormData({
        first_name: userInfo.first_name || '',
        last_name: userInfo.last_name || '',
        email: userInfo.email || '',
        phone_number: userInfo.phone_number || '',
      });
    }
  }, [userInfo]);

  return (
    <div className="space-y-12">
      <div className="border-b border-gray-900/10 pb-6">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          This information will be displayed publicly so be careful what you share.
        </p>
      </div>

      <div className="border-b border-gray-900/10 pb-6">
        {/* Phone Number */}
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Phone no
          </label>
          <div className="mt-2">
            <input
              disabled
              type="text"
              name="phone_number"
              value={formData.phone_number}
              className="block w-full px-2 border-0 border-b-2 border-gray-300 py-1.5 text-gray-500 bg-gray-50 ring-1 ring-inset ring-white focus:outline-none text-sm"
            />
          </div>
        </div>
        <hr className='my-5' />

        {/* First Name */}
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            First Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="block w-full px-2 border-0 border-b-2 border-red-800 py-1.5 text-red-600 ring-1 ring-inset ring-white focus:outline-none text-sm"
            />
          </div>
        </div>
        <hr className='my-5' />

        {/* Last Name */}
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Last Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="block w-full px-2 border-0 border-b-2 border-red-800 py-1.5 text-red-600 ring-1 ring-inset ring-white focus:outline-none text-sm"
            />
          </div>
        </div>
        <hr className='my-5' />

        {/* Email */}
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Email Address
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full px-2 border-0 border-b-2 border-red-800 py-1.5 text-red-600 ring-1 ring-inset ring-white focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          onClick={updateProfile}
          disabled={loading}
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
}