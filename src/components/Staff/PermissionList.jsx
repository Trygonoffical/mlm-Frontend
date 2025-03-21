'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/DataTable/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';
import PermissionForm from './PermissionForm';
import { getTokens } from '@/utils/cookies';

const columnHelper = createColumnHelper();

const PermissionList = () => {
    const [permissions, setPermissions] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editPermissionData, setEditPermissionData] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [modules, setModules] = useState([]);
    const { token } = getTokens();
    const router = useRouter();

    const columns = [
        columnHelper.accessor('name', {
            header: 'Permission Name',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('module', {
            header: 'Module',
            cell: info => info.getValue() || 'General',
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: info => info.getValue() || '-',
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

    const handleToggleStatus = async (permissionId) => {
        if (!confirm('Are you sure you want to change this permission\'s status?')) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-permissions/${permissionId}/toggle-status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Permission status updated successfully');
                setRefreshKey(prev => prev + 1);
            } else {
                toast.error(data.error || 'Error updating permission status');
                console.error('Error response:', data);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error updating permission status');
        }
    };

    const handleEdit = (permission) => {
        setEditPermissionData(permission);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditPermissionData(null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditPermissionData(null);
    };

    // Fetch all modules for filtering and form selection
    const fetchModules = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-permissions/modules/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setModules(data);
            } else {
                console.error('Error fetching modules:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    const fetchPermissions = async () => {
        try {
            setLoading(true);
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
                console.error('Error response:', errorText);
                toast.error('Error fetching permissions');
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Error fetching permissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
        fetchModules();
    }, [refreshKey]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Permissions</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-1" />
                    Add New Permission
                </button>
            </div>

            {/* Module Filter */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-2">Filter by Module</h2>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setPermissions(permissions)} // Reset filter
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                    >
                        All
                    </button>
                    {modules.map((module, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                const filtered = permissions.filter(p => p.module === module);
                                if (filtered.length > 0) {
                                    setPermissions(filtered);
                                } else {
                                    toast.info(`No permissions found in ${module} module`);
                                }
                            }}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200"
                        >
                            {module}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={permissions} 
                    />
                )}
            </div>

            {isFormOpen && (
                <PermissionForm 
                    isOpen={isFormOpen}
                    onClose={closeForm}
                    permissionData={editPermissionData}
                    modules={modules}
                    setRefreshKey={setRefreshKey}
                />
            )}
        </div>
    );
};

export default PermissionList;