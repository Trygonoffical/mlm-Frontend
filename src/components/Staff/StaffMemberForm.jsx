'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';

const StaffMemberForm = ({ isOpen, onClose, staffData, roles, setRefreshKey }) => {
    const { token } = getTokens();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [staffMembers, setStaffMembers] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone_number: '',
        first_name: '',
        last_name: '',
        role: '',
        supervisor: '',
        department: '',
        employee_id: '',
        is_active: true,
        custom_permissions: []
    });
    
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [permissionsByModule, setPermissionsByModule] = useState({});

    // Fetch existing staff members (for supervisor dropdown)
    useEffect(() => {
        const fetchStaffMembers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-members/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStaffMembers(data);
                }
            } catch (error) {
                console.error('Error fetching staff members:', error);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-members/departments/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setDepartments(data);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        const fetchPermissions = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-permissions/module_permissions/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPermissionsByModule(data);
                    
                    // Flatten permissions for form handling
                    const allPermissions = [];
                    Object.values(data).forEach(modulePerms => {
                        modulePerms.forEach(perm => {
                            allPermissions.push(perm);
                        });
                    });
                    setAvailablePermissions(allPermissions);
                }
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        };

        fetchStaffMembers();
        fetchDepartments();
        fetchPermissions();
    }, [token]);

    // Initialize form data when editing existing staff
    useEffect(() => {
        if (staffData) {
            setFormData({
                username: staffData.username || '',
                email: staffData.email || '',
                phone_number: staffData.phone_number || '',
                first_name: staffData.first_name || '',
                last_name: staffData.last_name || '',
                role: staffData.role?.id || '',
                supervisor: staffData.supervisor?.id || '',
                department: staffData.department || '',
                employee_id: staffData.employee_id || '',
                is_active: staffData.is_active ?? true,
                // For editing, we don't send password unless changed
                password: '',
                custom_permissions: staffData.custom_permissions?.map(p => p.id) || []
            });
        }
    }, [staffData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePermissionChange = (permId) => {
        setFormData(prev => {
            const currentPermissions = [...prev.custom_permissions];
            if (currentPermissions.includes(permId)) {
                return {
                    ...prev,
                    custom_permissions: currentPermissions.filter(id => id !== permId)
                };
            } else {
                return {
                    ...prev,
                    custom_permissions: [...currentPermissions, permId]
                };
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.first_name) newErrors.first_name = ['First name is required'];
        if (!formData.username) newErrors.username = ['Username is required'];
        if (!formData.role) newErrors.role = ['Role is required'];
        
        // Only require password for new staff members
        if (!staffData && !formData.password) {
            newErrors.password = ['Password is required for new staff members'];
        }
        
        // Email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = ['Invalid email format'];
        }
        
        // Phone validation
        if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
            newErrors.phone_number = ['Phone number must be 10 digits'];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please correct the errors in the form');
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/staff-members/`;
            let method = 'POST';
            
            // If editing an existing staff member
            if (staffData) {
                url += `${staffData.id}/`;
                method = 'PUT';
                
                // Don't send empty password when updating
                if (!formData.password) {
                    const { password, ...dataWithoutPassword } = formData;
                    formData = dataWithoutPassword;
                }
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(staffData ? 'Staff member updated successfully' : 'Staff member created successfully');
                setRefreshKey(old => old + 1);
                onClose();
            } else {
                setErrors(data);
                
                // Display first error message in toast
                const firstErrorKey = Object.keys(data)[0];
                const firstError = data[firstErrorKey];
                toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
            }
        } catch (error) {
            console.error('Error saving staff member:', error);
            toast.error('Error saving staff member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-2xl rounded bg-white p-6 w-full max-h-[95vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <DialogTitle className="text-lg font-medium">
                            {staffData ? 'Edit Staff Member' : 'Create Staff Member'}
                        </DialogTitle>
                        <button onClick={onClose}>
                            <XMarkIcon className="h-6 w-6 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Basic User Information */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Username*</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.username ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                    required
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username.join(', ')}</p>
                                )}
                            </div>

                            {/* Password field - required for new staff, optional for editing */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password {!staffData && '*'}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                    required={!staffData}
                                    placeholder={staffData ? "Leave blank to keep current password" : ""}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.join(', ')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name*</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.first_name ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                    required
                                />
                                {errors.first_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.first_name.join(', ')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.last_name ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                />
                                {errors.last_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.last_name.join(', ')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.join(', ')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                    maxLength="10"
                                />
                                {errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone_number.join(', ')}</p>
                                )}
                            </div>

                            {/* Staff Member Specific Fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                                <input
                                    type="text"
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.employee_id ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                />
                                {errors.employee_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.employee_id.join(', ')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role*</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.role ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles && roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-600">{errors.role.join(', ')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.department ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                >
                                    <option value="">Select Department</option>
                                    {departments && departments.map((dept, index) => (
                                        <option key={index} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                                {errors.department && (
                                    <p className="mt-1 text-sm text-red-600">{errors.department.join(', ')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Supervisor</label>
                                <select
                                    name="supervisor"
                                    value={formData.supervisor}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.supervisor ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                >
                                    <option value="">None</option>
                                    {staffMembers && staffMembers
                                        .filter(staff => staff.id !== (staffData?.id || -1)) // Don't show self as supervisor
                                        .map(staff => (
                                            <option key={staff.id} value={staff.id}>
                                                {staff.user?.first_name || ''} {staff.user?.last_name || ''} ({staff.employee_id || staff.user?.username})
                                            </option>
                                        ))}
                                </select>
                                {errors.supervisor && (
                                    <p className="mt-1 text-sm text-red-600">{errors.supervisor.join(', ')}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                                    Active
                                </label>
                            </div>
                        </div>

                        {/* Custom Permissions Section */}
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Custom Permissions</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                These permissions will be added to the role's default permissions
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(permissionsByModule).map(([module, permissions]) => (
                                    <div key={module} className="border rounded-md p-4">
                                        <h4 className="font-medium text-gray-800 mb-2">{module}</h4>
                                        <div className="space-y-2">
                                            {permissions.map(permission => (
                                                <div key={permission.id} className="flex items-start">
                                                    <input
                                                        type="checkbox"
                                                        id={`perm-${permission.id}`}
                                                        checked={formData.custom_permissions.includes(permission.id)}
                                                        onChange={() => handlePermissionChange(permission.id)}
                                                        className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded"
                                                    />
                                                    <div className="ml-2">
                                                        <label htmlFor={`perm-${permission.id}`} className="block text-sm font-medium text-gray-700">
                                                            {permission.name}
                                                        </label>
                                                        {permission.description && (
                                                            <p className="text-xs text-gray-500">{permission.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? (staffData ? 'Updating...' : 'Creating...') : (staffData ? 'Update Staff' : 'Create Staff')}
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default StaffMemberForm;