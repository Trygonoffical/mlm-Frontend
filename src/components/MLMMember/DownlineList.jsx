

'use client'
import React, { useState, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle2, CircleDashed, Eye, UserPlus, Info } from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getTokens } from '@/utils/cookies';

const columnHelper = createColumnHelper();

const MLMDownlineList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [downline, setDownline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [usernameCheck, setUsernameCheck] = useState({
    isChecking: false,
    isAvailable: null,
    message: ''
  });
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
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('position', {
      header: 'Position',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('depth', {
      header: 'Level',
      cell: info => `Level ${info.getValue() || 1}`,
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
    // columnHelper.accessor('member_id', {
    //   id: 'actions',
    //   header: 'Actions',
    //   cell: info => (
    //     <button 
    //       onClick={() => handleViewMember(info.getValue())}
    //       className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    //       title="View Details"
    //     >
    //       <Eye className="w-4 h-4" />
    //     </button>
    //   ),
    // }),
  ];

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    position_id: '',
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
    fetchMemberData();
    fetchPositions();
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

  const fetchMemberData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Member dashboard data:", data);
        setMemberData(data);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/positions/?is_active=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch positions');
      }
      
      const data = await response.json();
      console.log('All positions:', data);
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast.error('Error fetching positions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (positions.length > 0 && memberData) {
      filterAvailablePositions();
    }
  }, [positions, memberData]);

  const filterAvailablePositions = () => {
    if (!memberData || !positions.length) {
      console.log("No member data or positions available");
      return;
    }
  
    console.log("Filtering positions...");
    console.log("Current member data:", memberData);
    
    // Map position name to level
    const positionMap = {
      'Preferred Customer': 1,
      'Business Associates': 2,
      'Business Executive': 3,
      'Marketing Director': 4,
      'Executive Marketing Director': 5
    };
    
    // Try to determine the current member's position level
    let currentMemberLevel = 0;
    
    // Check the current_rank first
    if (memberData.current_rank) {
      currentMemberLevel = positionMap[memberData.current_rank] || 0;
      console.log("Using mapped position from current_rank:", currentMemberLevel);
    }
    // Then try other methods if current_rank didn't work
    else if (memberData.current_position_level) {
      currentMemberLevel = memberData.current_position_level;
    } 
    else if (memberData.position && memberData.position.level_order) {
      currentMemberLevel = memberData.position.level_order;
    }
    
    console.log("Current member level:", currentMemberLevel);
  
    // Filter positions based on business rules
    let availablePositions = [];
  
    // Fix the filtering logic to match your business rules
    if (currentMemberLevel >= 3) {
      // Business Executive and higher can create both PC and BA
      availablePositions = positions.filter(position => 
        position.level_order === 1 || position.level_order === 2);
    } 
    else if (currentMemberLevel === 2) {
      // Business Associates can only create Preferred Customers
      availablePositions = positions.filter(position => 
        position.level_order === 1);
    }
    else {
      // Level 1 members can't create other members
      availablePositions = [];
    }
  
    console.log("Available positions:", availablePositions);
    setFilteredPositions(availablePositions);
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 5) return;
    
    setUsernameCheck({
      isChecking: true,
      isAvailable: null,
      message: 'Checking username...'
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-username/?username=${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUsernameCheck({
          isChecking: false,
          isAvailable: data.available,
          message: data.available ? 'Username is available' : 'Username is taken'
        });
      } else {
        setUsernameCheck({
          isChecking: false,
          isAvailable: null,
          message: 'Error checking username'
        });
      }
    } catch (error) {
      setUsernameCheck({
        isChecking: false,
        isAvailable: null,
        message: 'Error checking username'
      });
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

    // Check username availability with debounce
    if (name === 'username') {
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
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
    let { value } = e.target;
    
    // Format document numbers based on type
    if (type === 'PAN') {
      // Convert to uppercase
      value = value.toUpperCase();
    }
    
    setDocumentNumbers(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }
  
      const formDataToSend = new FormData();
  
      // Add basic information
      formDataToSend.append('username', formData.username);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name || '');
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('position_id', formData.position_id);
      
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
        } else if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError('Registration failed. Please try again.');
          toast.error('Registration failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Registration failed. Please try again.');
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to reset the form
  const resetForm = () => {
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      position_id: ''
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
    setError('');
    setUsernameCheck({
      isChecking: false,
      isAvailable: null,
      message: ''
    });
  };
  
  // Form validation function
  const validateForm = () => {
    // Username validation
    if (!formData.username || formData.username.length < 5) {
      setError('Username must be at least 5 characters');
      return false;
    }
    
    if (usernameCheck.isAvailable === false) {
      setError('Username is already taken');
      return false;
    }
    
    // Password validation
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
  
    // Required fields validation
    if (!formData.first_name || !formData.phone_number || !formData.password) {
      setError('Please fill all required fields');
      return false;
    }
  
    // Phone number validation
    if (!/^\d{10}$/.test(formData.phone_number)) {
      setError('Phone number must be 10 digits');
      return false;
    }
  
    // Email validation if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
  
    // Required documents validation
    if (!kycDocuments.AADHAR || !kycDocuments.PAN) {
      setError('Aadhar and PAN documents are required');
      return false;
    }
  
    // Document number validation
    if (!documentNumbers.AADHAR || !documentNumbers.PAN) {
      setError('Aadhar and PAN numbers are required');
      return false;
    }
    
    // Aadhar validation - must be 12 digits
    if (!/^\d{12}$/.test(documentNumbers.AADHAR)) {
      setError('Aadhar number must be exactly 12 digits');
      return false;
    }
    
    // PAN validation - must follow the pattern AAAAA0000A
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(documentNumbers.PAN)) {
      setError('PAN number must be in the format AAAAA0000A');
      return false;
    }

    // Position validation
    if (!formData.position_id) {
      setError('Please select a position');
      return false;
    }
  
    return true;
  };

  // Check if current member can add new members
  // const canAddMembers = () => {
  //   if (!memberData) return false;
    
  //   // Get current member's level
  //   let currentLevel = 0;
    
  //   if (memberData.current_position_level) {
  //     currentLevel = memberData.current_position_level;
  //   } 
  //   else if (memberData.position && memberData.position.level_order) {
  //     currentLevel = memberData.position.level_order;
  //   }
    
  //   // Members can only add new members if they are at level 2 or higher
  //   return currentLevel >= 2;
  // };

  const canAddMembers = () => {
    if (!memberData) {
      console.log("No member data available");
      return false;
    }
    
    // Get current member's level based on current_rank
    let currentLevel = 0;
    
    if (memberData.current_position_level) {
      currentLevel = memberData.current_position_level;
      console.log("Using current_position_level:", currentLevel);
    } 
    else if (memberData.position && memberData.position.level_order) {
      currentLevel = memberData.position.level_order;
      console.log("Using position.level_order:", currentLevel);
    }
    // Add a check for current_rank
    else if (memberData.current_rank) {
      // Map position name to level
      const positionMap = {
        'Preferred Customer': 1,
        'Business Associates': 2,
        'Business Executive': 3,
        'Marketing Director': 4,
        'Executive Marketing Director': 5
      };
      
      currentLevel = positionMap[memberData.current_rank] || 0;
      console.log("Using mapped position from current_rank:", currentLevel);
    }
    
    console.log("Final current level:", currentLevel);
    
    // Members can only add new members if they are at level 2 or higher
    const canAdd = currentLevel >= 2;
    console.log("Can add members:", canAdd);
    return canAdd;
  };



  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Downline Members</h1>
        {canAddMembers() ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <UserPlus className="w-5 h-5" />
            Register New Member
          </button>
        ) : (
          <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md flex items-center gap-2">
            <Info className="w-5 h-5" />
            Your current position doesn't allow adding new members
          </div>
        )}
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
          
          {memberData && filteredPositions.length === 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No positions available for you to create members. This may be due to your current position level.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    usernameCheck.isAvailable === true 
                      ? 'border-green-300' 
                      : usernameCheck.isAvailable === false
                        ? 'border-red-300'
                        : 'border-gray-300'
                  } px-3 py-2`}
                  required
                  minLength={5}
                />
                {usernameCheck.message && (
                  <p className={`mt-1 text-sm ${
                    usernameCheck.isAvailable === true 
                      ? 'text-green-600' 
                      : usernameCheck.isAvailable === false
                        ? 'text-red-600'
                        : 'text-gray-500'
                  }`}>
                    {usernameCheck.isChecking ? 'Checking...' : usernameCheck.message}
                  </p>
                )}
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-xs text-gray-500 mt-1">Must be 10 digits</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position *</label>
                <select
                  name="position_id"
                  value={formData.position_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select Position</option>
                  {filteredPositions && filteredPositions.map(position => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
                {filteredPositions && filteredPositions.length === 0 && (
                  <p className="text-xs text-yellow-600 mt-1">
                    No positions available for you to assign.
                  </p>
                )}
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
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
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
                    placeholder="12-digit Aadhar Number"
                    value={documentNumbers.AADHAR}
                    onChange={(e) => handleDocumentNumberChange(e, 'AADHAR')}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    pattern="[0-9]{12}"
                    required
                  />
                  <p className="text-xs text-gray-500">Must be exactly 12 digits</p>
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
                    placeholder="10-character PAN Number"
                    value={documentNumbers.PAN}
                    onChange={(e) => handleDocumentNumberChange(e, 'PAN')}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    required
                  />
                  <p className="text-xs text-gray-500">Format: AAAAA0000A (5 letters, 4 digits, 1 letter)</p>
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
                disabled={loading || usernameCheck.isChecking || filteredPositions.length === 0}
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