// 'use client'

// import React, { useState, useEffect } from 'react';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';

// const NewsletterList = () => {
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     search: '',
//     is_active: '',
//     start_date: '',
//     end_date: ''
//   });
//   const { token } = getTokens();

//   useEffect(() => {
//     fetchSubscriptions();
//   }, [filters]);

//   const fetchSubscriptions = async () => {
//     try {
//       const queryParams = new URLSearchParams();
//       if (filters.search) queryParams.append('search', filters.search);
//       if (filters.is_active) queryParams.append('is_active', filters.is_active);
//       if (filters.start_date) queryParams.append('start_date', filters.start_date);
//       if (filters.end_date) queryParams.append('end_date', filters.end_date);

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/newsletters/?${queryParams.toString()}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) throw new Error('Failed to fetch subscriptions');
//       const data = await response.json();
//       setSubscriptions(data);
//     } catch (error) {
//       console.error('Error fetching subscriptions:', error);
//       toast.error('Failed to load subscriptions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const toggleStatus = async (id, currentStatus) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/newsletters/${id}/`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ is_active: !currentStatus })
//         }
//       );

//       if (!response.ok) throw new Error('Failed to update status');
      
//       toast.success('Status updated successfully');
//       fetchSubscriptions();
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       is_active: '',
//       start_date: '',
//       end_date: ''
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscriptions</h1>
//         <p className="mt-2 text-sm text-gray-700">
//           Manage newsletter subscriptions and export subscriber list
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 bg-white p-4 rounded-lg shadow">
//         <div className="flex flex-col md:flex-row gap-4 items-end">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//             <div className="relative">
//               <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 name="search"
//                 value={filters.search}
//                 onChange={handleFilterChange}
//                 placeholder="Search by email..."
//                 className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="w-full md:w-48">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               name="is_active"
//               value={filters.is_active}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="true">Active</option>
//               <option value="false">Inactive</option>
//             </select>
//           </div>

//           <div className="w-full md:w-48">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//             <input
//               type="date"
//               name="start_date"
//               value={filters.start_date}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>

//           <div className="w-full md:w-48">
//             <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//             <input
//               type="date"
//               name="end_date"
//               value={filters.end_date}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             onClick={clearFilters}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">Total Subscribers</div>
//           <div className="text-2xl font-bold">{subscriptions.length}</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">Active Subscribers</div>
//           <div className="text-2xl font-bold">
//           {subscriptions.filter(s => s.is_active).length}
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">Inactive Subscribers</div>
//           <div className="text-2xl font-bold">
//             {subscriptions.filter(s => !s.is_active).length}
//           </div>
//         </div>
//       </div>

//       {/* Subscriber List */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Subscribed Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {subscriptions.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                     No subscribers found
//                   </td>
//                 </tr>
//               ) : (
//                 subscriptions.map((subscription) => (
//                   <tr key={subscription.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           subscription.is_active
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {subscription.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {subscription.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(subscription.created_at).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => toggleStatus(subscription.id, subscription.is_active)}
//                         className={`text-${subscription.is_active ? 'red' : 'green'}-600 hover:text-${subscription.is_active ? 'red' : 'green'}-900 mr-4`}
//                       >
//                         {subscription.is_active ? 'Deactivate' : 'Activate'}
//                       </button>
//                       <a
//                         href={`mailto:${subscription.email}`}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         Send Email
//                       </a>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsletterList;

'use client'

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, CalendarIcon,  } from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { DownloadCloudIcon } from 'lucide-react';

const NewsletterList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    is_active: '',
    start_date: '',
    end_date: ''
  });
  const [actionLoading, setActionLoading] = useState(null);
  const { token } = getTokens();

  useEffect(() => {
    fetchSubscriptions();
  }, [filters]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.is_active) queryParams.append('is_active', filters.is_active);
      if (filters.start_date) queryParams.append('start_date', filters.start_date);
      if (filters.end_date) queryParams.append('end_date', filters.end_date);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletters/?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      setActionLoading(id);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletters/${id}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_active: !currentStatus })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      
      // Update the local state immediately
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(sub => 
          sub.id === id ? { ...sub, is_active: !currentStatus } : sub
        )
      );
      
      toast.success(`Subscription ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      is_active: '',
      start_date: '',
      end_date: ''
    });
  };

  const exportSubscribers = () => {
    // Filter only active subscribers
    const activeSubscribers = subscriptions.filter(sub => sub.is_active);
    
    // Create CSV content
    const csvContent = [
      ['Email', 'Subscribed Date'],
      ...activeSubscribers.map(sub => [
        sub.email,
        new Date(sub.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${activeSubscribers.length} active subscribers`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const activeCount = subscriptions.filter(s => s.is_active).length;
  const inactiveCount = subscriptions.filter(s => !s.is_active).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscriptions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage newsletter subscriptions and export subscriber list
          </p>
        </div>
        <button
          onClick={exportSubscribers}
          disabled={activeCount === 0}
          className={`flex items-center px-4 py-2 rounded-md text-white ${
            activeCount === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          <DownloadCloudIcon className="h-5 w-5 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by email..."
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="is_active"
              value={filters.is_active}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-150"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Subscribers</div>
          <div className="text-2xl font-bold">{subscriptions.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Active Subscribers</div>
          <div className="text-2xl font-bold text-green-600">
            {activeCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Inactive Subscribers</div>
          <div className="text-2xl font-bold text-red-600">
            {inactiveCount}
          </div>
        </div>
      </div>

      {/* Subscriber List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id} className={subscription.is_active ? '' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscription.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {subscription.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscription.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscription.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleStatus(subscription.id, subscription.is_active)}
                        disabled={actionLoading === subscription.id}
                        className={`text-${subscription.is_active ? 'red' : 'green'}-600 hover:text-${subscription.is_active ? 'red' : 'green'}-900 mr-4 ${
                          actionLoading === subscription.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {actionLoading === subscription.id ? 'Updating...' : (subscription.is_active ? 'Deactivate' : 'Activate')}
                      </button>
                      <a
                        href={`mailto:${subscription.email}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Send Email
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsletterList;