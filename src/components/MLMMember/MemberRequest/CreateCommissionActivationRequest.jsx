// components/CreateCommissionActivationRequest.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  BanknotesIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const CreateCommissionActivationRequest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { token } = getTokens();

  // Fetch user's MLM profile to determine sponsorship status
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/dashboard/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch user profile');
      
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load user profile');
    }
  };

  // Submit commission activation request
  const submitRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/commission-activation-requests/`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({}) // Empty object - let the backend handle everything
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }
      
      toast.success('Commission activation request submitted successfully');
      setIsOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
      >
        <BanknotesIcon className="h-5 w-5 mr-2" />
        Request Commission Activation
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>
            <div className="flex items-center">
              <BanknotesIcon className="h-6 w-6 mr-2 text-blue-500" />
              Request Commission Activation
            </div>
          </DialogTitle>

          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg flex items-center">
              <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
              <p className="text-sm text-blue-700">
                Submit a request to activate commission earnings for your account.
              </p>
            </div>

            {userProfile && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Your Current Details
                </h3>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Current Position:</span> {userProfile.current_rank}
                  </p>
                  {userProfile.sponsor && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Sponsor:</span> {userProfile.sponsor.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-700">
                Your request will be reviewed by both your sponsor (if applicable) and the admin.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={submitRequest}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"></div>
                ) : null}
                Submit Request
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateCommissionActivationRequest;