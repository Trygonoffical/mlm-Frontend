// 'use client'

// import React, { useState, useEffect } from 'react';
// import { CalendarIcon, CheckIcon, XIcon, SearchIcon, FilterIcon } from 'lucide-react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';

// const ContactList = () => {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     search: '',
//     is_read: '',
//     start_date: '',
//     end_date: ''
//   });
//   const { token } = getTokens();

//   useEffect(() => {
//     fetchContacts();
//   }, [filters]);

//   const fetchContacts = async () => {
//     try {
//       const queryParams = new URLSearchParams();
//       if (filters.search) queryParams.append('search', filters.search);
//       if (filters.is_read) queryParams.append('is_read', filters.is_read);
//       if (filters.start_date) queryParams.append('start_date', filters.start_date);
//       if (filters.end_date) queryParams.append('end_date', filters.end_date);

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/contacts/?${queryParams.toString()}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) throw new Error('Failed to fetch contacts');
//       const data = await response.json();
//       setContacts(data);
//     } catch (error) {
//       console.error('Error fetching contacts:', error);
//       toast.error('Failed to load contacts');
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

//   const toggleReadStatus = async (id, currentStatus) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/contacts/${id}/`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ is_read: !currentStatus })
//         }
//       );

//       if (!response.ok) throw new Error('Failed to update status');
      
//       toast.success('Status updated successfully');
//       fetchContacts();
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       is_read: '',
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
//       {/* Filters */}
//       <div className="mb-6 bg-white p-4 rounded-lg shadow">
//         <div className="flex flex-col md:flex-row gap-4 items-end">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//             <div className="relative">
//               <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 name="search"
//                 value={filters.search}
//                 onChange={handleFilterChange}
//                 placeholder="Search by name, email, or subject..."
//                 className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="w-full md:w-48">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               name="is_read"
//               value={filters.is_read}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="true">Read</option>
//               <option value="false">Unread</option>
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

//       {/* Contact List */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact Info
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Subject
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {contacts.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                     No contacts found
//                   </td>
//                 </tr>
//               ) : (
//                 contacts.map((contact) => (
//                   <tr key={contact.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           contact.is_read
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}
//                       >
//                         {contact.is_read ? 'Read' : 'Unread'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {contact.name}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm">
//                         <div>{contact.email}</div>
//                         <div className="text-gray-500">{contact.phone}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="max-w-xs">
//                         <div className="font-medium">{contact.subject}</div>
//                         <div className="text-sm text-gray-500 truncate">
//                           {contact.message}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(contact.created_at).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => toggleReadStatus(contact.id, contact.is_read)}
//                         className={`text-${contact.is_read ? 'yellow' : 'green'}-600 hover:text-${contact.is_read ? 'yellow' : 'green'}-900`}
//                       >
//                         Mark as {contact.is_read ? 'Unread' : 'Read'}
//                       </button>
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

// export default ContactList;

'use client'

import React, { useState, useEffect } from 'react';
import { CalendarIcon, CheckIcon, XIcon, SearchIcon, FilterIcon, X } from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    is_read: '',
    start_date: '',
    end_date: ''
  });
  const { token } = getTokens();

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.is_read) queryParams.append('is_read', filters.is_read);
      if (filters.start_date) queryParams.append('start_date', filters.start_date);
      if (filters.end_date) queryParams.append('end_date', filters.end_date);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contacts/?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
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

  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contacts/${id}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_read: !currentStatus })
        }
      );

      if (!response.ok) throw new Error('Failed to update status');
      
      // Update local state to reflect the change immediately
      setContacts(prev => prev.map(contact => 
        contact.id === id ? {...contact, is_read: !currentStatus} : contact
      ));
      
      // Also update the selected contact if it's currently being viewed
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({...selectedContact, is_read: !currentStatus});
      }
      
      toast.success(`Marked as ${!currentStatus ? 'read' : 'unread'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      is_read: '',
      start_date: '',
      end_date: ''
    });
  };

  const openDetailModal = (contact) => {
    setSelectedContact(contact);
    // If opening the modal and contact is unread, mark it as read
    if (contact && !contact.is_read) {
      toggleReadStatus(contact.id, false);
    }
  };

  const closeDetailModal = () => {
    setSelectedContact(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name, email, or subject..."
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="is_read"
              value={filters.is_read}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Read</option>
              <option value="false">Unread</option>
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

      {/* Contact List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No contacts found
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr 
                    key={contact.id} 
                    className={`hover:bg-gray-50 ${!contact.is_read ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contact.is_read
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {contact.is_read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>{contact.email}</div>
                        <div className="text-gray-500">{contact.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs cursor-pointer" onClick={() => openDetailModal(contact)}>
                        <div className="font-medium">{contact.subject}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {contact.message}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString()} {new Date(contact.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openDetailModal(contact)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReadStatus(contact.id, contact.is_read);
                          }}
                          className={`text-${contact.is_read ? 'yellow' : 'green'}-600 hover:text-${contact.is_read ? 'yellow' : 'green'}-900`}
                        >
                          Mark as {contact.is_read ? 'Unread' : 'Read'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Contact Details</h2>
              <button onClick={closeDetailModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 flex-grow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold">{selectedContact.name}</h3>
                  <p className="text-gray-600">{selectedContact.email}</p>
                  <p className="text-gray-600">{selectedContact.phone}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      selectedContact.is_read
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedContact.is_read ? 'Read' : 'Unread'}
                  </span>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(selectedContact.created_at).toLocaleDateString()} {new Date(selectedContact.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-2">Subject</h4>
                <p className="text-gray-800">{selectedContact.subject}</p>
              </div>
              
              <div>
                <h4 className="text-md font-semibold mb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-800 whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => toggleReadStatus(selectedContact.id, selectedContact.is_read)}
                className={`px-4 py-2 rounded-md ${
                  selectedContact.is_read 
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Mark as {selectedContact.is_read ? 'Unread' : 'Read'}
              </button>
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;