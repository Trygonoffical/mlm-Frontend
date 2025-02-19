'use client'
import React, { useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle2, CircleDashed, Eye, UserPlus } from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getTokens } from '@/utils/cookies';

const columnHelper = createColumnHelper();

const MLMDownlineList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [downline, setDownline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { token } = getTokens();
  const columns = [
    columnHelper.accessor('member_id', {
      header: 'Member ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('position', {
      header: 'Position',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('is_active', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          info.getValue() 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {info.getValue() ? 'Active' : 'Pending'}
        </span>
      ),
    }),
    columnHelper.accessor('join_date', {
      header: 'Join Date',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('member_id', {
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <button 
          onClick={() => handleViewMember(info.getValue())}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    }),
  ];

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });

  const [kycDocuments, setKycDocuments] = useState({
    AADHAR: null,
    PAN: null,
    BANK_STATEMENT: null,
    CANCELLED_CHEQUE: null
  });

  const [documentNumbers, setDocumentNumbers] = useState({
    AADHAR: '',
    PAN: '',
  });

    
  
  useEffect(() => {
    fetchDownline();
  }, [refreshKey]);

  const fetchDownline = async () => {
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm/downline/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDownline(data.downline);
      } else {
        toast.error('Error fetching downline members');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching downline members');
    }
  };

  const handleViewMember = (memberId) => {
    // Implement view member details
    console.log('Viewing member:', memberId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${type} file size should be less than 5MB`);
        return;
      }
      setKycDocuments(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleDocumentNumberChange = (e, type) => {
    const { value } = e.target;
    setDocumentNumbers(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (!validateForm()) return;
  
      const formDataToSend = new FormData();
  
      // Add basic information
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name || '');
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('password', formData.password);
  
      // Add document numbers directly with their types as keys
      Object.keys(documentNumbers).forEach((type) => {
        if (documentNumbers[type]) {
          formDataToSend.append(type, documentNumbers[type]);
        }
      });
  
      // Add KYC documents and their types
      Object.keys(kycDocuments).forEach((type) => {
        if (kycDocuments[type]) {
          formDataToSend.append('document_file', kycDocuments[type]);
          formDataToSend.append('document_types[]', type);
        }
      });
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm/register-member/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Member registered successfully');
        setIsOpen(false);
        setRefreshKey(prev => prev + 1);
        resetForm();
      } else {
        console.error('Registration error:', data);
        if (data.details) {
          // Handle specific validation errors
          const errorMessages = Object.values(data.details).flat();
          errorMessages.forEach(error => toast.error(error));
        } else {
          toast.error(data.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

 // Helper function to reset the form
const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
    });
    setKycDocuments({
      AADHAR: null,
      PAN: null,
      BANK_STATEMENT: null,
      CANCELLED_CHEQUE: null
    });
    setDocumentNumbers({
      AADHAR: '',
      PAN: '',
    });
    setIsOpen(false);
  };
  
  // Form validation function
const validateForm = () => {
    // Password validation
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return false;
    }
  
    // Required fields validation
    if (!formData.first_name || !formData.phone_number || !formData.password) {
      setError('Please fill all required fields');
      setLoading(false);
      return false;
    }
  
    // Phone number validation
    if (!/^\d{10}$/.test(formData.phone_number)) {
      setError('Phone number must be 10 digits');
      setLoading(false);
      return false;
    }
  
    // Email validation if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Invalid email format');
      setLoading(false);
      return false;
    }
  
    // Required documents validation
    if (!kycDocuments.AADHAR || !kycDocuments.PAN) {
      setError('Aadhar and PAN documents are required');
      setLoading(false);
      return false;
    }
  
    // Document number validation
    if (!documentNumbers.AADHAR || !documentNumbers.PAN) {
      setError('Aadhar and PAN numbers are required');
      setLoading(false);
      return false;
    }
  
    return true;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Downline Members</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5" />
          Register New Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable 
          columns={columns} 
          data={downline} 
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Register New MLM Member</DialogTitle>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                  pattern="[0-9]{10}"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* KYC Documents */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">KYC Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhar Card */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Aadhar Card *</label>
                  <input
                    type="text"
                    placeholder="Aadhar Number"
                    value={documentNumbers.AADHAR}
                    onChange={(e) => handleDocumentNumberChange(e, 'AADHAR')}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDocumentChange(e, 'AADHAR')}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                </div>

                {/* PAN Card */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">PAN Card *</label>
                  <input
                    type="text"
                    placeholder="PAN Number"
                    value={documentNumbers.PAN}
                    onChange={(e) => handleDocumentNumberChange(e, 'PAN')}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                  <input
                    type="file"
                    onChange={(e) => handleDocumentChange(e, 'PAN')}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                </div>

                {/* Optional Documents */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Bank Statement</label>
                  <input
                    type="file"
                    onChange={(e) => handleDocumentChange(e, 'BANK_STATEMENT')}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Cancelled Cheque</label>
                  <input
                    type="file"
                    onChange={(e) => handleDocumentChange(e, 'CANCELLED_CHEQUE')}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <CircleDashed className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Register Member
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MLMDownlineList;