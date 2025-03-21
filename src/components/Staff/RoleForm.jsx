'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';

const RoleForm = ({ isOpen, onClose, roleData, permissions, setRefreshKey }) => {
    const { token } = getTokens();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [permissionsByModule, setPermissionsByModule] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [],
        is_active: true
    });

    // Group permissions by module for better organization
    useEffect(() => {
        const groupedPermissions = {};
        
        if (permissions && permissions.length > 0) {
            permissions.forEach(permission => {
                const module = permission.module || 'Other';
                if (!groupedPermissions[module]) {
                    groupedPermissions[module] = [];
                }
                groupedPermissions[module].push(permission);
            });
        }
        
        setPermissionsByModule(groupedPermissions);
    }, [permissions]);

    // Initialize form data when editing existing role
    useEffect(() => {
        if (roleData) {
            setFormData({
                name: roleData.name || '',
                description: roleData.description || '',
                permissions: roleData.permissions?.map(p => p.id) || [],
                is_active: roleData.is_active ?? true
            });
        }
    }, [roleData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePermissionChange = (permId) => {
        setFormData(prev => {
            const currentPermissions = [...prev.permissions];
            if (currentPermissions.includes(permId)) {
                return {
                    ...prev,
                    permissions: currentPermissions.filter(id => id !== permId)
                };
            } else {
                return {
                    ...prev,
                    permissions: [...currentPermissions, permId]
                };
            }
        });
    };

    const handleModuleSelectAll = (module, modulePermissions) => {
        const modulePermIds = modulePermissions.map(p => p.id);
        const allSelected = modulePermissions.every(p => formData.permissions.includes(p.id));
        
        if (allSelected) {
            // If all are selected, deselect all
            setFormData(prev => ({
                ...prev,
                permissions: prev.permissions.filter(id => !modulePermIds.includes(id))
            }));
        } else {
            // Otherwise, select all
            setFormData(prev => {
                const currentPermissions = [...prev.permissions];
                const newPermissions = [...currentPermissions];
                
                modulePermIds.forEach(id => {
                    if (!newPermissions.includes(id)) {
                        newPermissions.push(id);
                    }
                });
                
                return {
                    ...prev,
                    permissions: newPermissions
                };
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = ['Role name is required'];
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
            let url = `${process.env.NEXT_PUBLIC_API_URL}/staff-roles/`;
            let method = 'POST';
            
            // If editing an existing role
            if (roleData) {
                url += `${roleData.id}/`;
                method = 'PUT';
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
                toast.success(roleData ? 'Role updated successfully' : 'Role created successfully');
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
            console.error('Error saving role:', error);
            toast.error('Error saving role');
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
                            {roleData ? 'Edit Role' : 'Create Role'}
                        </DialogTitle>
                        <button onClick={onClose}>
                            <XMarkIcon className="h-6 w-6 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.join(', ')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.description ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm p-2`}
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description.join(', ')}</p>
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

                        {/* Permissions Section */}
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Permissions</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Select the permissions that will be assigned to this role
                            </p>

                            <div className="space-y-6">
                                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                                    <div key={module} className="border rounded-md p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-gray-800">{module}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleModuleSelectAll(module, modulePermissions)}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                {modulePermissions.every(p => formData.permissions.includes(p.id)) 
                                                    ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {modulePermissions.map(permission => (
                                                <div key={permission.id} className="flex items-start">
                                                    <input
                                                        type="checkbox"
                                                        id={`perm-${permission.id}`}
                                                        checked={formData.permissions.includes(permission.id)}
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
                                {loading ? (roleData ? 'Updating...' : 'Creating...') : (roleData ? 'Update Role' : 'Create Role')}
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default RoleForm;