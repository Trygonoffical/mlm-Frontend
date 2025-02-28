// import BankDetailsForm from '@/components/Kyc/BankDetailsForm'
// import CompanyInfoForm from '@/components/Profile/CompanyInfoForm'
// import React from 'react'

// const ProfilePage = () => {
//   return (
//     <>
//         {/* <CompanyInfoForm /> */}
//         {/* Add Bank Details section */}
//         <div className="my-8">
//           <h2 className="text-xl font-semibold mb-4">Bank Account Information</h2>
//           <BankDetailsForm />
//         </div>
//     </>
//   )
// }

// export default ProfilePage

'use client'
import React, { useState, useEffect } from 'react'
import { getTokens } from '@/utils/cookies'
import { toast } from 'react-hot-toast'
import BankDetailsForm from '@/components/Kyc/BankDetailsForm'
import { User, Mail, Phone, MapPin, Shield, Award } from 'lucide-react'
import AddressManager from '@/components/Profile/AddressManager'

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const { token } = getTokens()

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/MLMprofile/details/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch profile data')
      }

      const data = await response.json()
      console.log('mlm user data - ' , data)
      setProfileData(data)
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone_number: data.phone_number || ''
      })
      setLoading(false)
    } catch (error) {
      toast.error('Error loading profile data')
      console.error(error)
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/MLMprofile/update/`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const responseData = await response.json()

      if (response.ok) {
        toast.success('Profile updated successfully')
        setProfileData(responseData.userinfo)
        setEditMode(false)
      } else {
        throw new Error(responseData.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-1 gap-6">
        <div className='bg-white shadow-md rounded-lg p-6 '>
            <div className='flex'>
              <p className="text-md  flex items-center">
                  <User className="mr-2 text-gray-300" /> User Name :
                </p> 
                <p className='ml-2 text-gray-900 p-2'>
                  {profileData.username}
                </p>
            </div>
          <div className='flex'>
              <p className="text-md  flex items-center">
                <User className="mr-2 text-gray-300" /> Member ID :
              </p> 
              <p className='ml-2 text-gray-900 p-2'>
                {profileData.member_id}
              </p>
          </div>

          <div className='flex'>
              <p className="text-md  flex items-center">
                <Award className="mr-2 text-gray-300" /> Position :
              </p> 
              <p className='ml-2 text-gray-900 p-2'>
                {profileData.position}
              </p>
          </div>
              
        </div>
        {/* Personal Information Section */}
        <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="mr-2 text-gray-600" /> Personal Information
            </h2>
            {!editMode && (
              <button 
                onClick={() => setEditMode(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit Profile
              </button>
            )}
          </div>
            
          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="mr-3 text-gray-600" />
                <p className="font-medium">{profileData.first_name} {profileData.last_name}</p>
              </div>
              <div className="flex items-center">
                <Mail className="mr-3 text-gray-600" />
                <p>{profileData.email}</p>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 text-gray-600" />
                <p>{profileData.phone_number}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        {/* <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="mr-2 text-gray-600" /> Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full py-2 border rounded-md hover:bg-gray-50">
              Change Password
            </button>
            <button className="w-full py-2 border rounded-md hover:bg-gray-50">
              Security Settings
            </button>
          </div>
        </div> */}

        <div className="bg-white shadow-md rounded-lg p-6">
          <AddressManager />
        </div>

        {/* Bank Details Section */}
        <div className="md:col-span-2">
          <BankDetailsForm />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage