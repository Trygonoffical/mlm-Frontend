'use client'
import React, { useState, useRef } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Phone, 
  Mail, 
  Upload, 
  Check, 
  X 
} from 'lucide-react';

const MLMMemberRegistration = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: ''
  });
  const [kycDocuments, setKycDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { token } = getTokens();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      
      return true;
    });

    setKycDocuments(prev => [...prev, ...validFiles]);
  };

  const removeDocument = (indexToRemove) => {
    setKycDocuments(prev => 
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.first_name || !formData.phone_number) {
      toast.error('First Name and Phone Number are required');
      return;
    }

    // Prepare form data for submission
    const submitData = new FormData();
    
    // Add text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitData.append(key, value);
    });

    // Add KYC documents
    kycDocuments.forEach((file, index) => {
      submitData.append(`kyc_documents`, file);
    });

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/register-member/`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Registration failed');
      }

      toast.success('Member registered successfully');
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: ''
      });
      setKycDocuments([]);
      
      // Optional: show additional details or redirect
    } catch (error) {
      toast.error(error.message);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Register New MLM Member
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Enter first name"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>

        {/* KYC Document Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            KYC Documents
          </label>
          <div 
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
            />
            <div className="flex justify-center mb-4">
              <Upload className="text-gray-400" size={40} />
            </div>
            <p className="text-gray-500">
              Drag and drop or click to upload KYC documents
            </p>
            <p className="text-xs text-gray-400 mt-2">
              (PDF, JPG, PNG - Max 5MB per file)
            </p>
          </div>

          {/* Uploaded Documents List */}
          {kycDocuments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Uploaded Documents</h4>
              <div className="space-y-2">
                {kycDocuments.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                  >
                    <span className="text-sm">{file.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
            ) : (
              'Register Member'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MLMMemberRegistration;