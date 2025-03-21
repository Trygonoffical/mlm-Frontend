// 'use client'
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import DataTable from '@/components/DataTable/DataTable';
// import { createColumnHelper } from '@tanstack/react-table';
// import Cookies from 'js-cookie';
// import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/20/solid';
// import { toast } from 'react-hot-toast';
// import MLMMemberForm from './MlmMember';
// // import MLMMemberForm from './MLMMemberForm';  // Import your MLM Member form


// const columnHelper = createColumnHelper();

// const ListMLMMember = () => {
//     const [members, setMembers] = useState([]);
//     const [refreshKey, setRefreshKey] = useState(0);
//     const router = useRouter();

//     const columns = [
//         columnHelper.accessor('member_id', {
//             header: 'Member ID',
//             cell: info => info.getValue(),
//         }),
//         columnHelper.accessor('user', {
//             header: 'Name',
//             cell: info => info.getValue()?.first_name || 'N/A',
//         }),
//         columnHelper.accessor('user', {
//             id: 'username', 
//             header: 'User Name',
//             cell: info => info.getValue()?.username || 'N/A',
//         }),
//         columnHelper.accessor('user', {
//             id: 'phone',  // Unique ID for this column
//             header: 'Phone',
//             cell: info => info.getValue()?.phone_number || 'N/A',
//         }),
//         columnHelper.accessor('user', {
//             id: 'email',  // Unique ID for this column
//             header: 'Email',
//             cell: info => info.getValue()?.email || 'N/A',
//         }),
//         columnHelper.accessor('position', {
//             header: 'Position',
//             cell: info => info.getValue()?.name || 'N/A',
//         }),
//         columnHelper.accessor('sponsor', {
//             header: 'Sponsor',
//             cell: info => info.getValue()?.user?.full_name || 'Direct',
//         }),
//         columnHelper.accessor('total_bp', {
//             header: 'Total BP',
//             cell: info => info.getValue() || 0,
//         }),
//         columnHelper.accessor('is_active', {
//             header: 'Status',
//             cell: info => (
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                     info.getValue() 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                     {info.getValue() ? 'Active' : 'Inactive'}
//                 </span>
//             ),
//         }),
//         columnHelper.accessor(row => row.member_id, {
//             id: 'actions',
//             header: 'Actions',
//             cell: info => (
//                 <div className="flex space-x-2">
//                     <button 
//                         onClick={() => router.push(`/auth/dashboard/mlm/${info.getValue()}`)}
//                         className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                         title="View Details"
//                     >
//                         <EyeIcon className='w-4 h-4' />
//                     </button>
//                     <button 
//                         onClick={() => handleToggleStatus(info.getValue())}
//                         className={`p-2 ${
//                             info.row.original.is_active 
//                             ? 'bg-red-600 hover:bg-red-700' 
//                             : 'bg-green-600 hover:bg-green-700'
//                         } text-white rounded`}
//                         title={info.row.original.is_active ? 'Deactivate' : 'Activate'}
//                     >
//                         {info.row.original.is_active ? (
//                             <TrashIcon className='w-4 h-4' />
//                         ) : (
//                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                         )}
//                     </button>
//                 </div>
//             ),
//         }),
//     ];

//     const handleToggleStatus = async (memberId) => {
//         if (!confirm('Are you sure you want to change this member\'s status?')) return;

//         try {
//             const token = Cookies.get('token');
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/${memberId}/toggle-status/`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//             });
//             const data = await response.json();
//             console.log(' featch data ', data)
//             if (response.ok) {
//                 toast.success(data.message || 'Member status updated successfully');
//                 setRefreshKey(prev => prev + 1);
//             } else {
//                 toast.error(data.error || 'Error updating member status');
//                 console.error('Error response:', data);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error('Error updating member status');
//         }
//     };

//     const fetchMembers = async () => {
//         try {
//             const token = Cookies.get('token');
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
            
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log('fetch user - ' , data)
//                 setMembers(data);
//             } else {
//                 toast.error('Error fetching members');
//             }
//         } catch (error) {
//             console.error('Error fetching members:', error);
//             toast.error('Error fetching members');
//         }
//     };

//     useEffect(() => {
//         fetchMembers();
//     }, [refreshKey]);

//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-bold">MLM Members</h1>
//                 <MLMMemberForm setRefreshKey={setRefreshKey} />
//             </div>

//             <div className="bg-white rounded-lg shadow">
//                 <DataTable 
//                     columns={columns} 
//                     data={members} 
//                 />
//             </div>
//         </div>
//     );
// };

// export default ListMLMMember;


'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/DataTable/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import Cookies from 'js-cookie';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';
import MLMMemberForm from './MlmMember';

const columnHelper = createColumnHelper();

const ListMLMMember = () => {
    const [members, setMembers] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const columns = [
        columnHelper.accessor('member_id', {
            header: 'Member ID',
            cell: info => info.getValue(),
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
            header: 'User Name',
            cell: info => info.getValue()?.username || 'N/A',
        }),
        columnHelper.accessor('user', {
            id: 'phone',
            header: 'Phone',
            cell: info => info.getValue()?.phone_number || 'N/A',
        }),
        columnHelper.accessor('user', {
            id: 'email',
            header: 'Email',
            cell: info => info.getValue()?.email || 'N/A',
        }),
        columnHelper.accessor('position', {
            header: 'Position',
            cell: info => info.getValue()?.name || 'N/A',
        }),
        columnHelper.accessor('sponsor', {
            header: 'Sponsor',
            cell: info => {
                const sponsor = info.getValue();
                // Check if sponsor exists and has a user property
                if (sponsor && sponsor.user) {
                    // Check if get_full_name is a property or we need to construct it
                    if (sponsor.user.get_full_name) {
                        return sponsor.user.get_full_name;
                    } else if (sponsor.user.first_name || sponsor.user.last_name) {
                        return `${sponsor.user.first_name || ''} ${sponsor.user.last_name || ''}`.trim();
                    } else {
                        return sponsor.user.username || sponsor.member_id || 'Unknown';
                    }
                }
                // If there's no sponsor, show Direct
                return 'Direct';
            },
        }),
        columnHelper.accessor('total_bp', {
            header: 'Total BP',
            cell: info => info.getValue() || 0,
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
        columnHelper.accessor(row => row.member_id, {
            id: 'actions',
            header: 'Actions',
            cell: info => (
                <div className="flex space-x-2">
                    <button 
                        onClick={() => router.push(`/auth/dashboard/mlm/${info.getValue()}`)}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="View Details"
                    >
                        <EyeIcon className='w-4 h-4' />
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

    const handleToggleStatus = async (memberId) => {
        if (!confirm('Are you sure you want to change this member\'s status?')) return;

        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/${memberId}/toggle-status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || 'Member status updated successfully');
                setRefreshKey(prev => prev + 1);
            } else {
                toast.error(data.error || 'Error updating member status');
                console.error('Error response:', data);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error updating member status');
        }
    };

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('MLM members data:', data);
                
                // Debug the sponsor data
                data.forEach((member, index) => {
                    if (member.sponsor) {
                        console.log(`Member ${index} sponsor:`, member.sponsor);
                    }
                });
                
                setMembers(data);
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                toast.error('Error fetching members');
            }
        } catch (error) {
            console.error('Error fetching members:', error);
            toast.error('Error fetching members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [refreshKey]);

    return (
        <div className="md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">MLM Members</h1>
                <MLMMemberForm setRefreshKey={setRefreshKey} />
            </div>

            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={members} 
                    />
                )}
            </div>
        </div>
    );
};

export default ListMLMMember;