'use client'
import React, { useState, useEffect } from 'react';
import { 
  Bank, CheckCircle, XCircle, AlertCircle, Search, User, 
  Banknote
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';

const BankDetailsManagement = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    verificationStatus: ''
  });
  const [selectedBankDetail, setSelectedBankDetail] = useState(null);

  const { token } = getTokens();

  // Fetch Bank Details
  const fetchBankDetails = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: filters.search,
        verification_status: filters.verificationStatus
      }).toString();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/bank-details/?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setBankDetails(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast.error('Failed to fetch bank details');
    } finally {
      setLoading(false);
    }
  };

  // Verify Bank Details
  const handleBankDetailVerification = async (bankDetailId, status) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/bank-details/${bankDetailId}/verify/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success(`Bank details ${status.toLowerCase()}d successfully`);
        fetchBankDetails();
        setSelectedBankDetail(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Error verifying bank details:', error);
      toast.error('Verification failed');
    }
  };

  // Effect to fetch bank details
  useEffect(() => {
    fetchBankDetails();
  }, [filters]);

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      VERIFIED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };

    const statusIcons = {
      PENDING: <AlertCircle size={16} />,
      VERIFIED: <CheckCircle size={16} />,
      REJECTED: <XCircle size={16} />
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm flex items-center gap-1 ${statusStyles[status] || ''}`}>
        {statusIcons[status]} {status}
      </span>
    );
  };

  // Bank Details Modal
  const BankDetailsModal = () => {
    if (!selectedBankDetail) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Bank Details</h2>
            <button 
              onClick={() => setSelectedBankDetail(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <User className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold">{selectedBankDetail.mlm_member_name}</h3>
                <p className="text-sm text-gray-500">{selectedBankDetail.member_id}</p>
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Account Holder Name</p>
                <p className="font-medium">{selectedBankDetail.account_holder_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="font-medium">{selectedBankDetail.account_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank Name</p>
                <p className="font-medium">{selectedBankDetail.bank_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="font-medium">{selectedBankDetail.ifsc_code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <StatusBadge status={selectedBankDetail.is_verified ? 'VERIFIED' : 'PENDING'} />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleBankDetailVerification(selectedBankDetail.id, 'VERIFIED')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Verify
              </button>
              <button
                onClick={() => handleBankDetailVerification(selectedBankDetail.id, 'REJECTED')}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Banknote className="mr-2" /> Bank Details Management
      </h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by member name, ID, or bank name..."
            className="w-full p-3 pl-10 border rounded-lg"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        </div>

        {/* Verification Status Filter */}
        <select
          className="w-full p-3 border rounded-lg"
          value={filters.verificationStatus}
          onChange={(e) => setFilters({...filters, verificationStatus: e.target.value})}
        >
          <option value="">All Verification Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-indigo-500"></div>
          <p className="mt-2 text-gray-500">Loading bank details...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bankDetails.map((bankDetail) => (
            <div 
              key={bankDetail.id} 
              className="bg-white border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedBankDetail(bankDetail)}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <User className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{bankDetail.mlm_member_name}</h3>
                  <p className="text-sm text-gray-500">{bankDetail.member_id}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-medium">{bankDetail.bank_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-medium">
                    {bankDetail.account_number.slice(0, -4).replace(/./g, '*') + bankDetail.account_number.slice(-4)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Verification Status</p>
                  <StatusBadge status={bankDetail.is_verified ? 'VERIFIED' : 'PENDING'} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bank Details Modal */}
      {selectedBankDetail && <BankDetailsModal />}
    </div>
  );
};

export default BankDetailsManagement;