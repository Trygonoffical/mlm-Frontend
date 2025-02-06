"use client"
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, FileText, Search, Eye, Download } from 'lucide-react';
import Cookies from 'js-cookie';

const KYCAdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    documentType: '',
    search: ''
  });
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [verificationData, setVerificationData] = useState({
    status: '',
    rejectionReason: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  const fetchDocuments = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        document_type: filters.documentType,
        search: filters.search
      }).toString();
      const token = Cookies.get('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/?${queryParams}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
       
      });
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!selectedDoc || !verificationData.status) return;
    
    if (verificationData.status === 'REJECTED' && !verificationData.rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
         const token = Cookies.get('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/${selectedDoc.id}/verify/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      if (response.ok) {
        fetchDocuments();
        setSelectedDoc(null);
        setVerificationData({ status: '', rejectionReason: '' });
      } else {
        const error = await response.json();
        alert(error.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };

  const handleDownload = (documentUrl, fileName) => {
    fetch(documentUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => console.error('Error downloading file:', error));
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
        <AlertCircle size={16} /> Pending
      </span>,
      VERIFIED: <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
        <CheckCircle size={16} /> Verified
      </span>,
      REJECTED: <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
        <XCircle size={16} /> Rejected
      </span>
    };
    return badges[status] || status;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">KYC Document Management</h1>
        
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
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select 
              className="w-full border rounded-lg p-2"
              value={filters.documentType}
              onChange={(e) => setFilters({...filters, documentType: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="AADHAR">Aadhar Card</option>
              <option value="PAN">PAN Card</option>
              <option value="BANK_STATEMENT">Bank Statement</option>
              <option value="CANCELLED_CHEQUE">Cancelled Cheque</option>
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

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-indigo-500"></div>
            <p className="mt-2 text-gray-500">Loading documents...</p>
          </div>
        ) : (
          /* Documents List */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No documents found
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{doc.mlm_member_name}</div>
                          <div className="text-sm text-gray-500">ID: {doc.member_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText size={16} className="mr-2" />
                            <span className="text-sm text-gray-900">{doc.document_type_display}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.document_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(doc.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            >
                              <Eye size={16} className="mr-1" /> Review
                            </button>
                            <button
                              onClick={() => handleDownload(doc.document_file, `${doc.document_type}_${doc.member_id}`)}
                              className="text-gray-600 hover:text-gray-900 flex items-center"
                            >
                              <Download size={16} className="mr-1" /> Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Document Review Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Review Document</h2>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Member Name</p>
                  <p className="font-medium">{selectedDoc.mlm_member_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member ID</p>
                  <p className="font-medium">{selectedDoc.member_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Document Type</p>
                  <p className="font-medium">{selectedDoc.document_type_display}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Document Number</p>
                  <p className="font-medium">{selectedDoc.document_number}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Verification Status</label>
                <select 
                  className="w-full border rounded-lg p-2"
                  value={verificationData.status}
                  onChange={(e) => setVerificationData({...verificationData, status: e.target.value})}
                >
                  <option value="">Select Status</option>
                  <option value="VERIFIED">Verify</option>
                  <option value="REJECTED">Reject</option>
                </select>
              </div>

              {verificationData.status === 'REJECTED' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Rejection Reason</label>
                  <textarea
                    className="w-full border rounded-lg p-2"
                    rows="3"
                    value={verificationData.rejectionReason}
                    onChange={(e) => setVerificationData({...verificationData, rejectionReason: e.target.value})}
                    placeholder="Please provide a reason for rejection..."
                  ></textarea>
                </div>
              )}

              {/* Document Preview */}
              <div className="border rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium mb-2">Document Preview</h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  {selectedDoc.document_file && (
                    <img 
                      src={selectedDoc.document_file}
                      alt="Document Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedDoc(null);
                  setVerificationData({ status: '', rejectionReason: '' });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerification}
                disabled={!verificationData.status}
                className={`px-4 py-2 rounded-lg ${
                  !verificationData.status 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                Submit Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCAdminDashboard;