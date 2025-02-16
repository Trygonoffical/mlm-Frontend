'use client'
import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle, XCircle, FileText, Search, 
  Eye, Download, User, CreditCard, Bank, File, 
  Banknote
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';

const KYCManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDocuments, setMemberDocuments] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);
  const [filters, setFilters] = useState({
    search: ''
  });

  const { token } = getTokens();

  // Fetch member list
  const fetchMembers = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: filters.search
      }).toString();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setMembers(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  // Fetch member documents
  const fetchMemberDocuments = async (memberId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/?member_id=${memberId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setMemberDocuments(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching member documents:', error);
      toast.error('Failed to fetch member documents');
    }
  };

  // Fetch bank details
  const fetchBankDetails = async (memberId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/bank-details/?member_id=${memberId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBankDetails(data);
      } else {
        setBankDetails(null);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast.error('Failed to fetch bank details');
    }
  };

  // Verify Bank Details
  const handleBankDetailVerification = async (status) => {
    if (!bankDetails) {
      toast.error('No bank details to verify');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/bank-details/${bankDetails.id}/verify/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success(`Bank details ${status.toLowerCase()}d successfully`);
        fetchBankDetails(selectedMember.id);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Error verifying bank details:', error);
      toast.error('Verification failed');
    }
  };

  // Verify Document
  const handleDocumentVerification = async (document, status, rejectionReason = '') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/${document.id}/verify/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status, 
          rejection_reason: status === 'REJECTED' ? rejectionReason : '' 
        })
      });

      if (response.ok) {
        toast.success(`Document ${status.toLowerCase()}d successfully`);
        fetchMemberDocuments(selectedMember.id);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error('Verification failed');
    }
  };

  // Effect to fetch members
  useEffect(() => {
    fetchMembers();
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

  // Member Detail Modal
  const MemberDetailModal = () => {
    if (!selectedMember) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Member Details</h2>
            <button 
              onClick={() => setSelectedMember(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          {/* Member Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Member Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="mr-2" /> Personal Information
              </h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{selectedMember.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member ID</p>
                  <p className="font-medium">{selectedMember.member_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium">{selectedMember.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Documents and Bank Details */}
            <div>
              {/* Bank Details Section */}
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Banknote className="mr-2" /> Bank Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                {bankDetails ? (
                  <>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Account Holder Name</p>
                        <p className="font-medium">{bankDetails.account_holder_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-medium">{bankDetails.account_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-medium">{bankDetails.bank_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">IFSC Code</p>
                        <p className="font-medium">{bankDetails.ifsc_code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <StatusBadge status={bankDetails.is_verified ? 'VERIFIED' : 'PENDING'} />
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button 
                        onClick={() => handleBankDetailVerification('VERIFIED')}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Verify
                      </button>
                      <button 
                        onClick={() => handleBankDetailVerification('REJECTED')}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">No bank details available</p>
                )}
              </div>

              {/* Documents Section */}
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <File className="mr-2" /> Documents
              </h3>
              <div className="space-y-4">
                {memberDocuments.length > 0 ? (
                  memberDocuments.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="bg-white border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{doc.document_type_display}</p>
                        <p className="text-sm text-gray-600">{doc.document_number}</p>
                        <StatusBadge status={doc.status} />
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleDocumentVerification(doc, 'VERIFIED')}
                          className="text-green-600 hover:text-green-800"
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => handleDocumentVerification(doc, 'REJECTED', 'Invalid document')}
                          className="text-red-600 hover:text-red-800"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">KYC Management</h1>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search members by name, ID, or phone..."
          className="w-full p-3 pl-10 border rounded-lg"
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
      </div>

      {/* Members List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-indigo-500"></div>
          <p className="mt-2 text-gray-500">Loading members...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div 
              key={member.id} 
              className="bg-white border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => {
                setSelectedMember(member);
                fetchMemberDocuments(member.id);
                fetchBankDetails(member.id);
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <User className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{member.full_name}</h3>
                  <p className="text-sm text-gray-500">{member.member_id}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <div className="flex items-center">
                    <FileText size={16} className="mr-1" />
                    <span>{memberDocuments.length} uploaded</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bank Details</p>
                  <div className="flex items-center">
                    <Banknote size={16} className="mr-1" />
                    <span>{bankDetails ? 'Available' : 'Not Added'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && <MemberDetailModal />}
    </div>
  );
};

export default KYCManagement;