'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';

const AdminWalletManagement = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: 'all'
  });
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { token } = getTokens();

  useEffect(() => {
    fetchWithdrawalRequests();
  }, [filters]);

  const fetchWithdrawalRequests = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        date_range: filters.dateRange
      });

      // Updated endpoint to match backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/withdrawal-requests/?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch withdrawal requests');
      }

      const data = await response.json();
      setWithdrawalRequests(data);
    } catch (error) {
      toast.error(error.message || 'Error fetching withdrawal requests');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalAction = async (requestId, action) => {
    try {
      // Updated endpoints to match backend
      const endpoint = action === 'approve' 
        ? `/admin/wallet/withdrawals/${requestId}/approve/`
        : `/admin/wallet/withdrawals/${requestId}/reject/`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${action} withdrawal`);
      }

      toast.success(`Withdrawal ${action}d successfully`);
      setSelectedRequest(null);
      fetchWithdrawalRequests();
    } catch (error) {
      toast.error(error.message || `Error ${action}ing withdrawal`);
      console.error('Action error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Withdrawal Requests Management</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <div className="relative">
            <input
              type="text"
              className="w-full border rounded-lg p-2 pl-8"
              placeholder="Search by member ID or name..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Withdrawal Requests Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawalRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                withdrawalRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.member_name}</div>
                      <div className="text-sm text-gray-500">ID: {request.member_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold">₹{request.amount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Review
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Review Withdrawal Request</h2>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Member Name</p>
                  <p className="font-medium">{selectedRequest.member_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member ID</p>
                  <p className="font-medium">{selectedRequest.member_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-lg">₹{selectedRequest.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Request Date</p>
                  <p className="font-medium">
                    {new Date(selectedRequest.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Bank Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Account Holder</p>
                    <p className="font-medium">{selectedRequest.bank_details?.account_holder_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-medium">{selectedRequest.bank_details?.account_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IFSC Code</p>
                    <p className="font-medium">{selectedRequest.bank_details?.ifsc_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bank Name</p>
                    <p className="font-medium">{selectedRequest.bank_details?.bank_name}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleWithdrawalAction(selectedRequest.id, 'reject')}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleWithdrawalAction(selectedRequest.id, 'approve')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWalletManagement;