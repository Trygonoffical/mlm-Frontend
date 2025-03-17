import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { ChevronLeft, Save } from '@mui/icons-material';

const AddStaffPage = () => {
  const router = useRouter();
  const { token } = getTokens();
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // State for dropdown data
  const [roles, setRoles] = useState([]);
  const [modulePermissions, setModulePermissions] = useState({});
  const [supervisors, setSupervisors] = useState([]);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    username: '',
    password: '',
    employee_id: '',
    department: '',
    
    // Role and Organizational Details
    role_id: '',
    supervisor_id: '',
    is_active: true,

    // Module-specific Permissions
    user_management_permissions: [],
    order_management_permissions: [],
    product_management_permissions: [],
    kyc_management_permissions: [],
    report_management_permissions: [],
    wallet_management_permissions: [],
    settings_management_permissions: [],
    
    // Custom Permissions
    custom_permission_ids: []
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Fetch initial data when component mounts
  useEffect(() => {
    if (token) {
      Promise.all([
        fetchRoles(),
        fetchModulePermissions(),
        fetchSupervisors()
      ]).then(() => {
        setLoadingData(false);
      }).catch(error => {
        console.error('Error loading form data:', error);
        toast.error('Failed to load form data');
        setLoadingData(false);
      });
    }
  }, [token]);
  
  // Fetch staff roles
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-roles?is_active=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      
      const data = await response.json();
      setRoles(data);
      
      // Set default role if available
      if (data.length > 0) {
        setFormData(prev => ({
          ...prev,
          role_id: data[0].id
        }));
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
    }
  };
  
  // Fetch module-specific permissions
  const fetchModulePermissions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-permissions/module_permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch module permissions');
      }
      
      const data = await response.json();
      setModulePermissions(data);
    } catch (error) {
      console.error('Error fetching module permissions:', error);
      toast.error('Failed to load permissions');
    }
  };
  
  // Fetch supervisors
  const fetchSupervisors = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch supervisors');
      }
      
      const data = await response.json();
      setSupervisors(data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      toast.error('Failed to load supervisors');
    }
  };
  
  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear corresponding error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle permission checkbox changes
  const handlePermissionChange = (module, permissionId, checked) => {
    const moduleKey = `${module}_permissions`;
    
    setFormData(prev => {
      const currentPermissions = prev[moduleKey] || [];
      
      if (checked) {
        // Add permission if not already there
        return {
          ...prev,
          [moduleKey]: [...new Set([...currentPermissions, permissionId])]
        };
      } else {
        // Remove permission
        return {
          ...prev,
          [moduleKey]: currentPermissions.filter(id => id !== permissionId)
        };
      }
    });
  };
  
  // Form validation
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
    
    // Username validation
    if (formData.username && formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    
    // Password validation
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
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare payload for API
      const payload = {
        // Personal Info
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name || '',
        phone_number: formData.phone_number || '',
        
        // Role & Organizational Details
        role_id: formData.role_id,
        supervisor_id: formData.supervisor_id || null,
        department: formData.department || '',
        employee_id: formData.employee_id || '',
        is_active: formData.is_active,
        
        // Module-specific Permissions
        user_management_permissions: formData.user_management_permissions,
        order_management_permissions: formData.order_management_permissions,
        product_management_permissions: formData.product_management_permissions,
        kyc_management_permissions: formData.kyc_management_permissions,
        report_management_permissions: formData.report_management_permissions,
        wallet_management_permissions: formData.wallet_management_permissions,
        settings_management_permissions: formData.settings_management_permissions,
        
        // Custom Permissions (if any)
        custom_permission_ids: formData.custom_permission_ids
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-members/`, {
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
  
  // Render permission checkboxes for a module
  const renderModulePermissions = (moduleName) => {
    const modulePerms = modulePermissions[moduleName] || [];
    const moduleKey = `${moduleName}_permissions`;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {modulePerms.map(perm => (
          <label key={perm.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={(formData[moduleKey] || []).includes(perm.id)}
              onChange={(e) => handlePermissionChange(moduleName, perm.id, e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="text-sm">{perm.name}</span>
          </label>
        ))}
      </div>
    );
  };
  
  // If data is still loading, show loading spinner
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
            onClick={() => router.push('/admin/staff')}
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
                Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                )}
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
                Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
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
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500">{errors.department}</p>
                )}
              </div>
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              
              {/* Other form fields similar to first name */}
              {/* Add remaining fields for Last Name, Email, Phone, etc. */}
            </div>
          </div>
          
          {/* Role and Permissions Section */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-medium">Role and Permissions</h2>
            </div>
            <div className="p-6">
              {/* Roles Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Module Permissions */}
              {Object.keys(modulePermissions).map(module => (
                <div key={module} className="mb-6">
                  <h3 className="text-md font-semibold mb-3 capitalize">
                    {module.replace('_', ' ')} Permissions
                  </h3>
                  {renderModulePermissions(module)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Form Submission Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              {loading ? 'Creating...' : 'Create Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddStaffPage;