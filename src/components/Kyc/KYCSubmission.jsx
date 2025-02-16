'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Upload, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';

const KYCSubmission = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [documents, setDocuments] = useState({
    AADHAR: null,
    PAN: null,
    BANK_STATEMENT: null,
    CANCELLED_CHEQUE: null
  });
  const [documentNumbers, setDocumentNumbers] = useState({
    AADHAR: '',
    PAN: '',
    BANK_STATEMENT: '',
    CANCELLED_CHEQUE: ''
  });
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState({});

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const { token } = getTokens();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/status/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setKycStatus(data);
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    }
  };

  const handleFileChange = (type, file) => {
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size should be less than 5MB');
      return;
    }
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const handleNumberChange = (type, value) => {
    setDocumentNumbers(prev => ({ ...prev, [type]: value }));
  };

  const handleSubmit = async (type) => {
    if (!documents[type]) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!documentNumbers[type]) {
      toast.error('Please enter the document number');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('document_type', type);
    formData.append('document_file', documents[type]);
    formData.append('document_number', documentNumbers[type]);

    try {
      const { token } = getTokens();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Document uploaded successfully');
        fetchKYCStatus();
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Error uploading document');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-500';
      case 'REJECTED': return 'text-red-500';
      case 'PENDING': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">KYC Documentation</h2>
      
      <div className="space-y-6">
        {['AADHAR', 'PAN', 'BANK_STATEMENT', 'CANCELLED_CHEQUE'].map((type) => (
          <div key={type} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{type.replace('_', ' ')}</h3>
              {kycStatus[type] && (
                <div className="flex items-center gap-2">
                  {getStatusIcon(kycStatus[type].status)}
                  <span className={getStatusColor(kycStatus[type].status)}>
                    {kycStatus[type].status}
                  </span>
                </div>
              )}
            </div>

            {kycStatus[type]?.status === 'REJECTED' && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
                Reason: {kycStatus[type].rejection_reason}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {type.replace('_', ' ')} Number
                </label>
                <input
                  type="text"
                  value={documentNumbers[type]}
                  onChange={(e) => handleNumberChange(type, e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                  placeholder={`Enter your ${type.replace('_', ' ')} number`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Document
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(type, e.target.files[0])}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id={`file-${type}`}
                  />
                  <label
                    htmlFor={`file-${type}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </label>
                  {documents[type] && (
                    <span className="text-sm text-gray-600">
                      {documents[type].name}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleSubmit(type)}
                disabled={loading || !documents[type] || !documentNumbers[type]}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Submit'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KYCSubmission;