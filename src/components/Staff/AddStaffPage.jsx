// pages/admin/staff/add.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { ChevronLeft, Save, Check } from '@mui/icons-material';

const AddStaffPage = () => {
  const router = useRouter();
  const { token } = getTokens();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [supervisors, setSupervisors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal info
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    username: '',
    password: '',
    employee_id: '',
    department: '',
    
    // Role & permissions
    role_id: '',
    supervisor_id: '',
    permissions: {},
    
    // Status
    is_active: true
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (token) {
      Promise.all([
        fetchRoles(),
        fetchPermissions(),
        fetchSupervisors()
      ]).then(() => {
        setLoadingData(false);
      }).catch(error => {
        console.error('Error loading form data:', error);
        setLoadingData(false);
      });
    }
  }, [token]);
  
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/staff-roles?is_active=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      
      const data = await response.json();
      setRoles(data.results || data);
      
      // Set default role if available
      if ((data.results || data).length > 0) {
        setFormData(prev => ({
          ...prev,
          role_id: (data.results || data)[0].id
        }));
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
    }
  };
  
  const fetchPermissions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/staff-permissions/module_permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      
      const data = await response.json();
      setPermissions(data);
      
      // Initialize permissions object in form data
      const initialPermissions = {};
      Object.keys(data).forEach(module => {
        initialPermissions[module] = [];
      });
      
      setFormData(prev => ({
        ...prev,
        permissions: initialPermissions
      }));
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
    }
  };
  
  const fetchSupervisors = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/staff-members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch supervisors');
      }
      
      const data = await response.json();
      setSupervisors(data.results || data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      toast.error('Failed to load supervisors');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handlePermissionChange = (module, permissionId, checked) => {
    const modulePermissions = [...(formData.permissions[module] || [])];
    
    if (checked) {
      // Add permission if not already there
      if (!modulePermissions.includes(permissionId)) {
        modulePermissions.push(permissionId);
      }
    } else {
      // Remove permission
      const index = modulePermissions.indexOf(permissionId);
      if (index !== -1) {
        modulePermissions.splice(index, 1);
      }
    }
    
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: modulePermissions
      }
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = ['first_name', 'email', 'username', 'password', 'role_id'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Username validation (minimum length)
    if (formData.username && formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    
    // Password validation (minimum length)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Phone validation (if provided)
    if (formData.phone_number && !/^\d{10,12}$/.test(formData.phone_number.replace(/[^0-9]/g, ''))) {
      newErrors.phone_number = 'Please enter a valid phone number (10-12 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare permission data
      const permissionData = {};
      Object.entries(formData.permissions).forEach(([module, ids]) => {
        const fieldName = `${module}_permissions`;
        permissionData[fieldName] = ids;
      });
      
      // Create request payload
      const payload = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        role_id: formData.role_id,
        supervisor_id: formData.supervisor_id || null,
        department: formData.department,
        employee_id: formData.employee_id,
        is_active: formData.is_active,
        ...permissionData
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/staff-members/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create staff member');
      }
      
      toast.success('Staff member created successfully');
      router.push('/admin/staff');
    } catch (error) {
      console.error('Error creating staff member:', error);
      toast.error(error.message || 'Failed to create staff member');
    } finally {
      setLoading(false);
    }
  };
  
  const goBack = () => {
    router.push('/admin/staff');
  };
  
  if (loadingData) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={goBack}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Add Staff Member</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-medium">Personal Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className={`w-full p-2 border ${errors.phone_number ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>
                )}
              </div>
              
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData