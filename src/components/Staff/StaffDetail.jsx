'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';
import { ArrowLeftIcon, PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import StaffMemberForm from './StaffMemberForm';

export default function StaffDetail({ params }) {
    const staffId = params.id;
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roles, setRoles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { token } = getTokens();
    const router = useRouter();

    // Fetch staff roles for the edit form
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-roles/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setRoles(data);
                } else {
                    throw new Error('Failed to fetch roles');
                }
            } catch (err) {
                console.error("Error fetching roles:", err);
                toast.error("Error loading roles");
            }
        };

        fetchRoles();
    }, [token]);

    // Fetch staff member details
    useEffect(() => {
        const fetchStaffDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-members/${staffId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch staff details');
                }
                
                const data = await response.json();
                setStaff(data);
            } catch (err) {
                console.error("Error fetching staff details:", err);
                setError(err.message);
                toast.error("Error loading staff details");
            } finally {
                setLoading(false);
            }
        };

        if (staffId && token) {
            fetchStaffDetails();
        }
    }, [staffId, token, refreshKey]);

    const handleResetPassword = async () => {
        if (!confirm("Are you sure you want to reset this staff member's password?")) return;
        
        try {
            const newPassword = prompt("Enter new password:");
            if (!newPassword) return;
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-members/${staffId}/reset-password/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ new_password: newPassword })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reset password');
            }
            
            toast.success("Password reset successfully");
        } catch (err) {
            console.error("Error resetting password:", err);
            toast.error(err.message || "Error resetting password");
        }
    };

    const handleToggleStatus = async () => {
        if (!confirm(`Are you sure you want to ${staff.is_active ? 'deactivate' : 'activate'} this staff member?`)) return;
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-members/${staffId}/toggle-status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            
            toast.success(`Staff member ${staff.is_active ? 'deactivated' : 'activated'} successfully`);
            setRefreshKey(prev => prev + 1);
        } catch (err) {
            console.error("Error toggling status:", err);
            toast.error("Error updating staff status");
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p>Error: {error}</p>
                    <button 
                        onClick={() => router.push('/auth/dashboard/staff')}
                        className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Staff List
                    </button>
                </div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                    <p>Staff member not found</p>
                    <button 
                        onClick={() => router.push('/auth/dashboard/staff')}
                        className="mt-2 inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-800"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Staff List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <button 
                        onClick={() => router.push('/auth/dashboard/staff')}
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-bold">Staff Details</h1>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <PencilIcon className="h-4 w-4 mr-1" /> Edit
                    </button>
                    <button
                        onClick={handleToggleStatus}
                        className={`flex items-center px-3 py-2 ${staff.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded`}
                    >
                        <TrashIcon className="h-4 w-4 mr-1" /> {staff.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <UserCircleIcon className="h-20 w-20 text-gray-300" />
                        </div>
                        <div className="ml-6">
                            <h2 className="text-xl font-semibold">
                                {staff.user?.first_name} {staff.user?.last_name}
                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    staff.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {staff.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </h2>
                            <p className="text-gray-500">{staff.role?.name || 'No Role Assigned'}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Employee ID: {staff.employee_id || 'Not Assigned'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Username</p>
                            <p>{staff.user?.username}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p>{staff.user?.email || 'Not Provided'}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Phone Number</p>
                            <p>{staff.user?.phone_number || 'Not Provided'}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Department</p>
                            <p>{staff.department || 'Not Assigned'}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Supervisor</p>
                            <p>
                                {staff.supervisor ? 
                                    `${staff.supervisor.user?.first_name || ''} ${staff.supervisor.user?.last_name || ''}`.trim() || 
                                    staff.supervisor.user?.username : 
                                    'None'
                                }
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Password</p>
                            <div className="flex items-center">
                                <p>••••••••</p>
                                <button 
                                    onClick={handleResetPassword}
                                    className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
                    
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Role Permissions</h4>
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-500">
                                This staff member inherits all permissions from the <strong>{staff.role?.name}</strong> role.
                            </p>
                        </div>
                    </div>

                    {staff.custom_permissions && staff.custom_permissions.length > 0 ? (
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Additional Custom Permissions</h4>
                            <div className="bg-blue-50 p-3 rounded">
                                <ul className="list-disc list-inside space-y-1">
                                    {staff.custom_permissions.map(perm => (
                                        <li key={perm.id} className="text-sm">
                                            <span className="font-medium">{perm.name}</span>
                                            {perm.description && (
                                                <span className="text-gray-600"> - {perm.description}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">
                            No additional custom permissions assigned.
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Created At</p>
                            <p>
                                {new Date(staff.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                            <p>
                                {new Date(staff.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <StaffMemberForm
                    isOpen={isEditing}
                    onClose={() => setIsEditing(false)}
                    staffData={staff}
                    roles={roles}
                    setRefreshKey={setRefreshKey}
                />
            )}
        </div>
    );
}