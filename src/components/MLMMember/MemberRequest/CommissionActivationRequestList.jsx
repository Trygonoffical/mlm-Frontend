// components/CommissionActivationRequestList.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  BanknotesIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CommissionActivationRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const { token } = getTokens();
  const { userInfo } = useSelector((state) => state.auth);
  // Fetch requests based on user role
  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/commission-activation-requests/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch requests');
      
      const data = await response.json();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load commission activation requests');
      setLoading(false);
    }
  };

  // Process request (for admin)
  const processRequest = async (requestId, status) => {

    console.log(`Processing request ${requestId} with status: ${status}`);
  console.log(`Current user role: ${userRole}`);
  console.log(`User info from Redux:`, userInfo);


    try {
        console.log(`Sending request to: ${process.env.NEXT_PUBLIC_API_URL}/commission-activation-requests/${requestId}/process_request/`);
      // Use the exact path format that matches your Django REST Framework URL pattern
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/commission-activation-requests/${requestId}/process_request/`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            status: status,
            reason: status === 'REJECTED' ? 'Admin review' : ''
          })
        }
      );
  
      // Add this line to debug the response
      console.log('Process request response:', await response.clone().text());
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to process request');
      }
      
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process request: ' + error.message);
    }
  };

//   useEffect(() => {
//     // Determine user role from token
//     const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
//     setUserRole(userInfo.role);
//     fetchRequests();
//   }, []);

  useEffect(() => {
    // Determine user role from token
    console.log('User Role:', userInfo?.role);
    console.log('Is Admin?', userInfo?.role === 'ADMIN');
    setUserRole(userInfo?.role);
    fetchRequests();
  }, [userInfo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <BanknotesIcon className="h-6 w-6 mr-2 text-blue-500" />
        Commission Activation Requests
      </h2>

      {requests.length === 0 ? (
        <div className="text-center text-gray-500">
          No commission activation requests found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sponsor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {userRole === 'ADMIN' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.requester_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.requester_member_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.sponsor_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.sponsor_member_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.current_position_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.target_position_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.status === 'PENDING' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        <ClockIcon className="h-4 w-4 mr-1" /> Pending
                      </span>
                    )}
                    {request.status === 'APPROVED' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" /> Approved
                      </span>
                    )}
                    {request.status === 'REJECTED' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <XCircleIcon className="h-4 w-4 mr-1" /> Rejected
                      </span>
                    )}
                  </td>
                  {userRole === 'ADMIN' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => processRequest(request.id, 'APPROVED')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => processRequest(request.id, 'REJECTED')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  );
};

export default CommissionActivationRequestList;