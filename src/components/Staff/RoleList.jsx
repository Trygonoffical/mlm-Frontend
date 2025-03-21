'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/DataTable/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { PencilIcon, TrashIcon, EyeIcon, ShieldCheckIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';
import RoleForm from './RoleForm';
import { getTokens } from '@/utils/cookies';

const columnHelper = createColumnHelper();

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState([]);
    const [editRoleData, setEditRoleData] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { token } = getTokens();
    const router = useRouter();

    const columns = [
        columnHelper.accessor('name', {
            header: 'Role Name',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: info => info.getValue() || 'No description',
        }),
        columnHelper.accessor('permissions', {
            header: 'Permissions',
            cell: info => {
                const perms = info.getValue();
                return perms ? `${perms.length} permissions` : 'No permissions';
            },
        }),
        columnHelper.accessor('is_active', {
            header: 'Status',
            cell: info => (
                <span className={`px-2 py-1 text-xs rounded-full ${
                    info.getValue() 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                    {info.getValue() ? 'Active' : 'Inactive'}
                </span>
            ),
        }),
        columnHelper.accessor(row => row.id, {
            id: 'actions',
            header: 'Actions',
            cell: info => (
                <div className="flex space-x-2">
                    <button 
                        onClick={() => handleEdit(info.row.original)}
                        className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        title="Edit"
                    >
                        <PencilIcon className='w-4 h-4' />
                    </button>
                    <button 
                        onClick={() => handleViewPermissions(info.row.original)}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="View Permissions"
                    >
                        <ShieldCheckIcon className='w-4 h-4' />
                    </button>
                    <button 
                        onClick={() => handleToggleStatus(info.getValue())}
                        className={`p-2 ${
                            info.row.original.is_active 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white rounded`}
                        title={info.row.original.is_active ? 'Deactivate' : 'Activate'}
                    >
                        {info.row.original.is_active ? (
                            <TrashIcon className='w-4 h-4' />
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                </div>
            ),
        }),
    ];

    const handleToggleStatus = async (roleId) => {
        if (!confirm('Are you sure you want to change this role\'s status?')) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-roles/${roleId}/toggle-status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Role status updated successfully');
                setRefreshKey(prev => prev + 1);
            } else {
                toast.error(data.error || 'Error updating role status');
                console.error('Error response:', data);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error updating role status');
        }
    };

    const handleEdit = (role) => {
        setEditRoleData(role);
        setIsFormOpen(true);
    };

    const handleViewPermissions = (role) => {
        // You could navigate to a detailed view or show a modal with all permissions
        toast.success(`${role.name} has ${role.permissions.length} permissions`);
        
        // Option for a modal with permissions list
        const permNames = role.permissions.map(p => p.name).join(', ');
        alert(`Permissions for ${role.name}:\n\n${permNames}`);
    };

    const handleAddNew = () => {
        setEditRoleData(null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditRoleData(null);
    };

    // Fetch all permissions for the role form
    const fetchPermissions = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-permissions/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setPermissions(data);
            } else {
                const errorText = await response.text();
                console.error('Error fetching permissions:', errorText);
                toast.error('Error loading permissions');
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Error loading permissions');
        }
    };

    const fetchRoles = async () => {
        try {
            setLoading(true);
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
                const errorText = await response.text();
                console.error('Error response:', errorText);
                toast.error('Error fetching roles');
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Error fetching roles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, [refreshKey]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Staff Roles</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add New Role
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={roles} 
                    />
                )}
            </div>

            {isFormOpen && (
                <RoleForm 
                    isOpen={isFormOpen}
                    onClose={closeForm}
                    roleData={editRoleData}
                    permissions={permissions}
                    setRefreshKey={setRefreshKey}
                />
            )}
        </div>
    );
};

export default RoleList;