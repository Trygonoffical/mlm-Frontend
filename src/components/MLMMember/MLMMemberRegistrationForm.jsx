'use client'
import React, { useState, useEffect, useRef } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Phone, 
  Mail, 
  Upload, 
  Check, 
  X,
  FileText,
  CreditCard,
  Bank
} from 'lucide-react';

const MLMMemberRegistrationForm = () => {
  const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    position_id: ''
  });
  const [kycDocuments, setKycDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { token } = getTokens();

  // Fetch positions and document types on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch positions
        const positionsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/positions/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!positionsResponse.ok) {
          throw new Error('Failed to fetch positions');
        }

        const positionsData = await positionsResponse.json();
        setPositions(positionsData);

        // Set predefined document types
        setDocumentTypes([
          { value: 'AADHAR', label: 'Aadhar Card', icon: FileText },
          { value: 'PAN', label: 'PAN Card', icon: CreditCard },
          { value: 'BANK_STATEMENT', label: 'Bank Statement', icon: Bank },
          { value: 'CANCELLED_CHEQUE', label: 'Cancelled Cheque', icon: Bank }
        ]);
      } catch (error) {
        toast.error('Error fetching initial data');
        console.error(error);
      }
    };

    fetchInitialData();
  }, [token]);

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

    // Add files and ensure we have matching document types
    const newDocuments = validFiles.map(file => ({
      file,
      type: '', // Will be selected by user
      number: '' // Optional document number
    }));

    setKycDocuments(prev => [...prev, ...newDocuments]);
  };

  const updateDocumentType = (index, type) => {
    const updatedDocuments = [...kycDocuments];
    updatedDocuments[index].type = type;
    setKycDocuments(updatedDocuments);
  };

  const updateDocumentNumber = (index, number) => {
    const updatedDocuments = [...kycDocuments];
    updatedDocuments[index].number = number;
    setKycDocuments(updatedDocuments);
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

    // Validate KYC documents
    if (kycDocuments.length === 0) {
      toast.error('Please upload at least one KYC document');
      return;
    }

    // Validate document types
    const invalidDocuments = kycDocuments.filter(doc => !doc.type);
    if (invalidDocuments.length > 0) {
      toast.error('Please select a document type for all uploaded documents');
      return;
    }

    // Prepare form data for submission
    const submitData = new FormData();
    
    // Add text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitData.append(key, value);
    });

    // Add KYC documents
    kycDocuments.forEach((doc, index) => {
      submitData.append(`kyc_documents`, doc.file);
      submitData.append(`document_types`, doc.type);
      
      // Add optional document number
      if (doc.number) {
        submitData.append(`${doc.type.toLowerCase()}_number`, doc.number);
      }
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
        email: '',
        position_id: ''
      });
      setKycDocuments([]);
      
    } catch (error) {
      toast.error(error.message);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
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
                maxLength="10"
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

        {/* Position Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Position
          </label>
          <select
            name="position_id"
            value={formData.position_id}
            onChange={handleInputChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Position (Optional)</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </select>
        </div>

        {/* KYC Document Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            KYC Documents *
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
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium mb-2">Uploaded Documents</h4>
              {kycDocuments.map((doc, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 p-3 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{doc.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(doc.file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Document Type Selector */}
                    <select
                      value={doc.type}
                      onChange={(e) => updateDocumentType(index, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select Type</option>
                      {documentTypes.map((docType) => (
                        <option key={docType.value} value={docType.value}>
                          {docType.label}
                        </option>
                      ))}
                    </select>

                    {/* Optional Document Number */}
                    <input
                      type="text"
                      placeholder="Document Number"
                      value={doc.number}
                      onChange={(e) => updateDocumentNumber(index, e.target.value)}
                      className="border rounded px-2 py-1 text-sm w-32"
                    />

                    {/* Remove Document Button */}
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
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

export default MLMMemberRegistrationForm;