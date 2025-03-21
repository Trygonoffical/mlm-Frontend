'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/DataTable/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import Cookies from 'js-cookie';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';
import StaffMemberForm from './StaffMemberForm';
import { getTokens } from '@/utils/cookies';

const columnHelper = createColumnHelper();

const StaffList = () => {
    const [staffMembers, setStaffMembers] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const router = useRouter();
    const { token } = getTokens();

    const columns = [
        columnHelper.accessor('employee_id', {
            header: 'Employee ID',
            cell: info => info.getValue() || 'N/A',
        }),
        columnHelper.accessor('user', {
            header: 'Name',
            cell: info => {
                const user = info.getValue();
                if (!user) return 'N/A';
                return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'N/A';
            },
        }),
        columnHelper.accessor('user', {
            id: 'username', 
            header: 'Username',
            cell: info => info.getValue()?.username || 'N/A',
        }),
        columnHelper.accessor('user', {
            id: 'email',
            header: 'Email',
            cell: info => info.getValue()?.email || 'N/A',
        }),
        columnHelper.accessor('user', {
            id: 'phone',
            header: 'Phone',
            cell: info => info.getValue()?.phone_number || 'N/A',
        }),
        columnHelper.accessor('role', {
            header: 'Role',
            cell: info => info.getValue()?.name || 'N/A',
        }),
        columnHelper.accessor('department', {
            header: 'Department',
            cell: info => info.getValue() || 'N/A',
        }),
        columnHelper.accessor('supervisor', {
            header: 'Supervisor',
            cell: info => {
                const supervisor = info.getValue();
                if (supervisor && supervisor.user) {
                    return `${supervisor.user.first_name || ''} ${supervisor.user.last_name || ''}`.trim() || supervisor.user.username || 'N/A';
                }
                return 'N/A';
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
                        onClick={() => router.push(`/auth/dashboard/staff/${info.getValue()}`)}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="View Details"
                    >
                        <EyeIcon className='w-4 h-4' />
                    </button>
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

    const fetchStaffRoles = async () => {
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
                const errorText = await response.text();
                console.error('Error fetching staff roles:', errorText);
            }
        } catch (error) {
            console.error('Error fetching staff roles:', error);
        }
    };

    const handleToggleStatus = async (staffId) => {
        if (!confirm('Are you sure you want to change this staff member\'s status?')) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-members/${staffId}/toggle-status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || 'Staff member status updated successfully');
                setRefreshKey(prev => prev + 1);
            } else {
                toast.error(data.error || 'Error updating staff member status');
                console.error('Error response:', data);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error updating staff member status');
        }
    };

    const [editStaffData, setEditStaffData] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleEdit = (staffMember) => {
        setEditStaffData(staffMember);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditStaffData(null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditStaffData(null);
    };

    const fetchStaffMembers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff-members/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Staff members data:', data);
                setStaffMembers(data);
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                toast.error('Error fetching staff members');
            }
        } catch (error) {
            console.error('Error fetching staff members:', error);
            toast.error('Error fetching staff members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffMembers();
        fetchStaffRoles();
    }, [refreshKey]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Staff Members</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add New Staff
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
                        data={staffMembers} 
                    />
                )}
            </div>

            {isFormOpen && (
                <StaffMemberForm 
                    isOpen={isFormOpen}
                    onClose={closeForm}
                    staffData={editStaffData}
                    roles={roles}
                    setRefreshKey={setRefreshKey}
                />
            )}
        </div>
    );
};

export default StaffList;