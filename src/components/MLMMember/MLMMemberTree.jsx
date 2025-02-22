// // 'use client'
// // import React, { useState, useEffect } from 'react';
// // import { getTokens } from '@/utils/cookies';
// // import { toast } from 'react-hot-toast';
// // import { 
// //   Users, 
// //   ChevronDown, 
// //   ChevronRight, 
// //   UserCheck, 
// //   UserX, 
// //   DollarSign, 
// //   Trophy 
// // } from 'lucide-react';

// // const MLMMemberTree = () => {
// //   const [memberTree, setMemberTree] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [expandedMembers, setExpandedMembers] = useState({});
// //   const [selectedMember, setSelectedMember] = useState(null);

// //   const { token } = getTokens();

// //   useEffect(() => {
// //     fetchMemberTree();
// //   }, []);

// //   const fetchMemberTree = async () => {
// //     try {
// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`, 
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error('Failed to fetch member tree');
// //       }

// //       const data = await response.json();
// //       console.log(' tree data - ', data)
// //       setMemberTree(data.tree);
// //       setLoading(false);
// //     } catch (error) {
// //       toast.error('Error fetching member tree');
// //       console.error(error);
// //       setLoading(false);
// //     }
// //   };

// //   const fetchMemberDetails = async (memberId) => {
// //     try {
// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${memberId}/`, 
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error('Failed to fetch member details');
// //       }

// //       const data = await response.json();
// //       console.log(' tree data - ', data)
// //       setSelectedMember(data);
// //     } catch (error) {
// //       toast.error('Error fetching member details');
// //       console.error(error);
// //     }
// //   };

// //   const toggleMemberExpand = (memberId) => {
// //     setExpandedMembers(prev => ({
// //       ...prev,
// //       [memberId]: !prev[memberId]
// //     }));
// //   };

// //   const renderMemberNode = (member) => {
// //     const isExpanded = expandedMembers[member.id];

// //     return (
// //       <div key={member.id} className="ml-4 border-l-2 border-gray-200 pl-4 py-2">
// //         <div 
// //           className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
// //           onClick={() => {
// //             fetchMemberDetails(member.member_id);
// //             toggleMemberExpand(member.id);
// //           }}
// //         >
// //           <div className="flex items-center space-x-2">
// //             {member.children && member.children.length > 0 ? (
// //               isExpanded ? (
// //                 <ChevronDown className="text-gray-500" size={16} />
// //               ) : (
// //                 <ChevronRight className="text-gray-500" size={16} />
// //               )
// //             ) : null}
// //             <span className="font-medium">{member.name}</span>
// //             <span className="text-sm text-gray-500">({member.member_id})</span>
// //             {member.is_active ? (
// //               <UserCheck className="text-green-500" size={16} />
// //             ) : (
// //               <UserX className="text-red-500" size={16} />
// //             )}
// //           </div>
// //           <div className="flex items-center space-x-2 text-sm text-gray-600">
// //             <span>Referrals: {member.referral_count}</span>
// //             <DollarSign className="text-blue-500" size={16} />
// //           </div>
// //         </div>

// //         {isExpanded && member.children && member.children.length > 0 && (
// //           <div className="mt-2">
// //             {member.children.map(renderMemberNode)}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   const renderMemberDetails = () => {
// //     if (!selectedMember) return null;

// //     return (
// //       <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
// //         <div className="flex justify-between items-center border-b pb-4">
// //           <h2 className="text-xl font-bold">{selectedMember.personal_info.name}</h2>
// //           <span className={`px-3 py-1 rounded-full text-sm ${
// //             selectedMember.personal_info.is_active 
// //               ? 'bg-green-100 text-green-800' 
// //               : 'bg-red-100 text-red-800'
// //           }`}>
// //             {selectedMember.personal_info.is_active ? 'Active' : 'Inactive'}
// //           </span>
// //         </div>

// //         <div className="grid md:grid-cols-2 gap-4">
// //           <div>
// //             <h3 className="font-semibold mb-2">Personal Information</h3>
// //             <p>Member ID: {selectedMember.personal_info.member_id}</p>
// //             <p>Email: {selectedMember.personal_info.email}</p>
// //             <p>Phone: {selectedMember.personal_info.phone_number}</p>
// //             <p>Joined: {new Date(selectedMember.personal_info.date_joined).toLocaleDateString()}</p>
// //           </div>

// //           <div>
// //             <h3 className="font-semibold mb-2">Position Details</h3>
// //             <p>Current Position: {selectedMember.position_details.current_position || 'N/A'}</p>
// //             <p>Discount: {selectedMember.position_details.discount_percentage}%</p>
// //           </div>
// //         </div>

// //         <div className="grid md:grid-cols-3 gap-4">
// //           <div className="bg-blue-50 p-4 rounded-lg">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <DollarSign className="text-blue-500" />
// //               <h4 className="font-semibold">Financial</h4>
// //             </div>
// //             <p>Total Earnings: ₹{selectedMember.financial_details.total_earnings}</p>
// //             <p>Total BP: {selectedMember.financial_details.total_bp}</p>
// //           </div>

// //           <div className="bg-green-50 p-4 rounded-lg">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <Users className="text-green-500" />
// //               <h4 className="font-semibold">Network</h4>
// //             </div>
// //             <p>Direct Referrals: {selectedMember.network_details.direct_referrals}</p>
// //             <p>Total Network Size: {selectedMember.network_details.total_network_size}</p>
// //           </div>

// //           <div className="bg-purple-50 p-4 rounded-lg">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <Trophy className="text-purple-500" />
// //               <h4 className="font-semibold">Recent Commissions</h4>
// //             </div>
// //             {selectedMember.recent_commissions.map((commission, index) => (
// //               <div key={index} className="text-sm">
// //                 <p>₹{commission.amount} from {commission.from_member}</p>
// //                 <p className="text-xs text-gray-500">
// //                   {new Date(commission.date).toLocaleDateString()}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 max-w-7xl mx-auto flex space-x-6">
// //       <div className="w-1/2 bg-white shadow-md rounded-lg p-4 overflow-auto max-h-[800px]">
// //         <h2 className="text-xl font-bold mb-4 flex items-center">
// //           <Users className="mr-2" /> Member Network
// //         </h2>
// //         {memberTree ? renderMemberNode(memberTree) : (
// //           <p className="text-center text-gray-500">No member tree available</p>
// //         )}
// //       </div>
      
// //       <div className="w-1/2">
// //         {selectedMember ? (
// //           renderMemberDetails()
// //         ) : (
// //           <div className="bg-gray-100 h-full flex items-center justify-center rounded-lg">
// //             <p className="text-gray-500">Select a member to view details</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default MLMMemberTree;


// // 'use client'
// // import React, { useState, useEffect } from 'react';
// // import { getTokens } from '@/utils/cookies';
// // import { toast } from 'react-hot-toast';
// // import { 
// //   Users, 
// //   ChevronDown, 
// //   ChevronRight, 
// //   UserCheck, 
// //   UserX, 
// //   DollarSign, 
// //   Trophy,
// //   Search,
// //   Filter
// // } from 'lucide-react';

// // const MLMMemberTree = () => {
// //   const [memberTree, setMemberTree] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [expandedMembers, setExpandedMembers] = useState({});
// //   const [selectedMember, setSelectedMember] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filterActive, setFilterActive] = useState('all');

// //   const { token } = getTokens();

// //   useEffect(() => {
// //     fetchMemberTree();
// //   }, []);

// //   const fetchMemberTree = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`, 
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error('Failed to fetch member tree');
// //       }

// //       const data = await response.json();
// //       console.log('Tree data:', data);
      
// //       // If the tree is an empty array, handle it
// //       if (Array.isArray(data.tree) && data.tree.length === 0) {
// //         setMemberTree(null);
// //       } else {
// //         setMemberTree(data.tree);
        
// //         // Auto-expand the root node
// //         if (data.tree && data.tree.id) {
// //           setExpandedMembers(prev => ({
// //             ...prev,
// //             [data.tree.id]: true
// //           }));
// //         }
// //       }
      
// //       setLoading(false);
// //     } catch (error) {
// //       toast.error('Error fetching member tree: ' + error.message);
// //       console.error('Tree fetch error:', error);
// //       setLoading(false);
// //     }
// //   };

// //   const fetchMemberDetails = async (memberId) => {
// //     try {
// //       setSelectedMember({...selectedMember, loading: true});
// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${memberId}/`, 
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error('Failed to fetch member details');
// //       }

// //       const data = await response.json();
// //       console.log('Member details:', data);
// //       setSelectedMember(data);
// //     } catch (error) {
// //       toast.error('Error fetching member details');
// //       console.error('Member details error:', error);
// //       setSelectedMember(prev => ({...prev, loading: false, error: error.message}));
// //     }
// //   };

// //   const toggleMemberExpand = (memberId, e) => {
// //     // Stop propagation to prevent selecting the member when just expanding/collapsing
// //     if (e) {
// //       e.stopPropagation();
// //     }
    
// //     setExpandedMembers(prev => ({
// //       ...prev,
// //       [memberId]: !prev[memberId]
// //     }));
// //   };

// //   // Recursive function to search through the tree
// //   const searchTree = (node, term) => {
// //     if (!node) return false;
    
// //     // Check if this node matches
// //     const nameMatch = node.name && node.name.toLowerCase().includes(term.toLowerCase());
// //     const idMatch = node.member_id && node.member_id.includes(term);
    
// //     // If this node matches the filter criteria
// //     const matchesFilter = 
// //       filterActive === 'all' || 
// //       (filterActive === 'active' && node.is_active) || 
// //       (filterActive === 'inactive' && !node.is_active);
    
// //     // If this node matches the search term and filter
// //     if ((nameMatch || idMatch) && matchesFilter) {
// //       return true;
// //     }
    
// //     // Check if any children match
// //     if (node.children && node.children.length > 0) {
// //       for (const child of node.children) {
// //         if (searchTree(child, term)) {
// //           return true;
// //         }
// //       }
// //     }
    
// //     return false;
// //   };

// //   // Function to filter the tree based on search and active filter
// //   const filterTree = (node) => {
// //     if (!node) return null;
    
// //     // Check if current node matches search term and active filter
// //     const nameMatch = searchTerm ? node.name && node.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
// //     const idMatch = searchTerm ? node.member_id && node.member_id.includes(searchTerm) : true;
// //     const matchesSearch = searchTerm ? (nameMatch || idMatch) : true;
    
// //     const matchesFilter = 
// //       filterActive === 'all' || 
// //       (filterActive === 'active' && node.is_active) || 
// //       (filterActive === 'inactive' && !node.is_active);
    
// //     // Filter children recursively
// //     let filteredChildren = [];
// //     if (node.children && node.children.length > 0) {
// //       filteredChildren = node.children
// //         .map(child => filterTree(child))
// //         .filter(child => child !== null);
// //     }
    
// //     // If this node matches criteria or has matching children, include it
// //     if (matchesSearch && matchesFilter) {
// //       return {
// //         ...node,
// //         children: filteredChildren
// //       };
// //     } else if (filteredChildren.length > 0) {
// //       // If this node doesn't match but has matching children, include it
// //       return {
// //         ...node,
// //         children: filteredChildren
// //       };
// //     }
    
// //     // If neither this node nor its children match, exclude it
// //     return null;
// //   };

// //   const renderMemberNode = (member) => {
// //     if (!member) return null;
    
// //     const isExpanded = expandedMembers[member.id];
// //     const hasChildren = member.children && member.children.length > 0;

// //     // Apply filtering
// //     const filteredNode = filterTree(member);
// //     if (!filteredNode) return null;

// //     return (
// //       <div key={member.id} className="ml-4 border-l-2 border-gray-200 pl-4 py-1">
// //         <div 
// //           className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
// //             selectedMember?.personal_info?.member_id === member.member_id 
// //               ? 'bg-blue-100 hover:bg-blue-200' 
// //               : 'hover:bg-gray-100'
// //           }`}
// //           onClick={() => fetchMemberDetails(member.member_id)}
// //         >
// //           <div className="flex items-center space-x-2">
// //             {hasChildren && (
// //               <button 
// //                 onClick={(e) => toggleMemberExpand(member.id, e)}
// //                 className="p-1 hover:bg-gray-200 rounded-full"
// //               >
// //                 {isExpanded ? (
// //                   <ChevronDown className="text-gray-500" size={16} />
// //                 ) : (
// //                   <ChevronRight className="text-gray-500" size={16} />
// //                 )}
// //               </button>
// //             )}
// //             <span className="font-medium">{member.name}</span>
// //             <span className="text-sm text-gray-500">({member.member_id})</span>
// //             {member.is_active ? (
// //               <UserCheck className="text-green-500" size={16} title="Active" />
// //             ) : (
// //               <UserX className="text-red-500" size={16} title="Inactive" />
// //             )}
// //           </div>
// //           <div className="flex items-center space-x-2 text-sm text-gray-600">
// //             <span>Referrals: {member.referral_count || 0}</span>
// //             {parseFloat(member.total_earnings) > 0 && (
// //               <DollarSign className="text-blue-500" size={16} title={`₹${member.total_earnings} earnings`} />
// //             )}
// //           </div>
// //         </div>

// //         {isExpanded && hasChildren && (
// //           <div className="mt-1 ml-2">
// //             {member.children.map(child => renderMemberNode(child))}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   const renderMemberDetails = () => {
// //     if (!selectedMember) return null;
    
// //     if (selectedMember.loading) {
// //       return (
// //         <div className="flex justify-center items-center h-full">
// //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
// //         </div>
// //       );
// //     }
    
// //     if (selectedMember.error) {
// //       return (
// //         <div className="bg-red-50 p-6 rounded-lg">
// //           <p className="text-red-600">Error: {selectedMember.error}</p>
// //           <button 
// //             className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
// //             onClick={() => setSelectedMember(null)}
// //           >
// //             Close
// //           </button>
// //         </div>
// //       );
// //     }

// //     return (
// //       <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
// //         <div className="flex justify-between items-center border-b pb-4">
// //           <h2 className="text-xl font-bold">{selectedMember.personal_info.name}</h2>
// //           <span className={`px-3 py-1 rounded-full text-sm ${
// //             selectedMember.personal_info.is_active 
// //               ? 'bg-green-100 text-green-800' 
// //               : 'bg-red-100 text-red-800'
// //           }`}>
// //             {selectedMember.personal_info.is_active ? 'Active' : 'Inactive'}
// //           </span>
// //         </div>

// //         <div className="grid md:grid-cols-2 gap-4">
// //           <div>
// //             <h3 className="font-semibold mb-2 text-gray-700">Personal Information</h3>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Member ID:</span> {selectedMember.personal_info.member_id}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Email:</span> {selectedMember.personal_info.email || 'Not provided'}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Phone:</span> {selectedMember.personal_info.phone_number || 'Not provided'}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Joined:</span> {new Date(selectedMember.personal_info.date_joined).toLocaleDateString()}</p>
// //           </div>

// //           <div>
// //             <h3 className="font-semibold mb-2 text-gray-700">Position Details</h3>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Current Position:</span> {selectedMember.position_details.current_position || 'N/A'}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Discount:</span> {selectedMember.position_details.discount_percentage}%</p>
// //           </div>
// //         </div>

// //         <div className="grid md:grid-cols-3 gap-4">
// //           <div className="bg-blue-50 p-4 rounded-lg">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <DollarSign className="text-blue-500" />
// //               <h4 className="font-semibold">Financial</h4>
// //             </div>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Total Earnings:</span> ₹{selectedMember.financial_details.total_earnings}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Total BP:</span> {selectedMember.financial_details.total_bp}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Monthly Purchase:</span> ₹{selectedMember.financial_details.current_month_purchase || '0'}</p>
// //           </div>

// //           <div className="bg-green-50 p-4 rounded-lg">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <Users className="text-green-500" />
// //               <h4 className="font-semibold">Network</h4>
// //             </div>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Direct Referrals:</span> {selectedMember.network_details.direct_referrals}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Total Network Size:</span> {selectedMember.network_details.total_network_size}</p>
// //           </div>

// //           <div className="bg-purple-50 p-4 rounded-lg">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <Trophy className="text-purple-500" />
// //               <h4 className="font-semibold">Recent Commissions</h4>
// //             </div>
// //             {selectedMember.recent_commissions && selectedMember.recent_commissions.length > 0 ? (
// //               <div className="space-y-2 max-h-24 overflow-y-auto">
// //                 {selectedMember.recent_commissions.map((commission, index) => (
// //                   <div key={index} className="text-sm border-b pb-1 last:border-0">
// //                     <p className="font-medium">₹{commission.amount} from {commission.from_member}</p>
// //                     <p className="text-xs text-gray-500">
// //                       {new Date(commission.date).toLocaleDateString()}
// //                     </p>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-gray-500 text-sm">No recent commissions found</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 max-w-7xl mx-auto">
// //       <h1 className="text-2xl font-bold mb-6">MLM Member Network</h1>
      
// //       {/* Search and Filter */}
// //       <div className="mb-6 flex flex-wrap gap-4">
// //         <div className="relative flex-grow max-w-md">
// //           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //             <Search className="h-5 w-5 text-gray-400" />
// //           </div>
// //           <input
// //             type="text"
// //             placeholder="Search by name or member ID"
// //             className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //           />
// //         </div>
        
// //         <div className="flex gap-2 items-center">
// //           <Filter className="h-5 w-5 text-gray-500" />
// //           <select
// //             className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             value={filterActive}
// //             onChange={(e) => setFilterActive(e.target.value)}
// //           >
// //             <option value="all">All Members</option>
// //             <option value="active">Active Only</option>
// //             <option value="inactive">Inactive Only</option>
// //           </select>
// //         </div>
// //       </div>
      
// //       <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
// //         <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-4 overflow-auto max-h-[800px]">
// //           <h2 className="text-xl font-bold mb-4 flex items-center">
// //             <Users className="mr-2" /> Member Network
// //           </h2>
// //           {memberTree ? (
// //             renderMemberNode(memberTree)
// //           ) : (
// //             <div className="text-center p-6 bg-gray-50 rounded-lg">
// //               <p className="text-gray-500">No member tree available</p>
// //               <button 
// //                 onClick={fetchMemberTree}
// //                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
// //               >
// //                 Refresh
// //               </button>
// //             </div>
// //           )}
// //         </div>
        
// //         <div className="w-full md:w-1/2">
// //           {selectedMember ? (
// //             renderMemberDetails()
// //           ) : (
// //             <div className="bg-gray-100 h-full min-h-[400px] flex items-center justify-center rounded-lg">
// //               <div className="text-center">
// //                 <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //                 <p className="text-gray-500">Select a member to view details</p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MLMMemberTree;
// // 'use client'
// // import React, { useState, useEffect } from 'react';
// // import { getTokens } from '@/utils/cookies';
// // import { toast } from 'react-hot-toast';
// // import { 
// //   Users, 
// //   ChevronDown, 
// //   ChevronRight, 
// //   UserCheck, 
// //   UserX, 
// //   DollarSign, 
// //   Trophy,
// //   Search,
// //   Filter,
// //   RefreshCw,
// //   Globe,
// //   UserPlus
// // } from 'lucide-react';

// // const MLMMemberTree = () => {
// //   const [forestData, setForestData] = useState([]);
// //   const [allMembers, setAllMembers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [expandedMembers, setExpandedMembers] = useState({});
// //   const [selectedMember, setSelectedMember] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filterActive, setFilterActive] = useState('all');
// //   const [loadingStep, setLoadingStep] = useState('Fetching member data...');
// //   const [viewMode, setViewMode] = useState('forest'); // 'forest' or 'single'
// //   const [selectedRoot, setSelectedRoot] = useState(null);

// //   const { token } = getTokens();

// //   useEffect(() => {
// //     fetchAllData();
// //   }, []);

// //   // Fetch all member data and build the forest
// //   const fetchAllData = async () => {
// //     try {
// //       setLoading(true);
// //       setLoadingStep('Fetching member forest...');
      
// //       // Fetch all members
// //       // const membersResponse = await fetch(
// //       //   `${process.env.NEXT_PUBLIC_API_URL}/mlm-members/`, 
// //       //   {
// //       //     headers: {
// //       //       'Authorization': `Bearer ${token}`
// //       //     }
// //       //   }
// //       // );

// //       // if (!membersResponse.ok) {
// //       //   throw new Error('Failed to fetch all members');
// //       // }

// //       // const allMembersData = await membersResponse.json();
// //       // console.log('All members data:', allMembersData);
// //       // setAllMembers(allMembersData);
      
// //       // // Build the forest (multiple trees)
// //       // setLoadingStep('Building member forest...');
// //       // const forest = buildForest(allMembersData);
// //       // console.log('Complete forest:', forest);
// //       // setForestData(forest);
      
// //       // // Auto-expand all root nodes
// //       // const initialExpanded = {};
// //       // forest.forEach(tree => {
// //       //   if (tree && tree.id) {
// //       //     initialExpanded[tree.id] = true;
// //       //   }
// //       // });
// //       // setExpandedMembers(initialExpanded);
// //       const treeResponse = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`, 
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       );
      
// //       if (!treeResponse.ok) {
// //         throw new Error('Failed to fetch member tree');
// //       }
      
// //       const treeData = await treeResponse.json();
// //       console.log('Tree data response:', treeData);
      
// //       // Handle both single tree and forest responses
// //       if (treeData.forest) {
// //         // We received a forest (multiple trees)
// //         setForestData(treeData.forest);
        
// //         // Auto-expand all root nodes
// //         const initialExpanded = {};
// //         treeData.forest.forEach(tree => {
// //           if (tree && tree.id) {
// //             initialExpanded[tree.id] = true;
// //           }
// //         });
// //         setExpandedMembers(initialExpanded);
// //       } else if (treeData.tree) {
// //         // We received a single tree
// //         setForestData([treeData.tree]);
        
// //         // Auto-expand the root node
// //         if (treeData.tree && treeData.tree.id) {
// //           setExpandedMembers({ [treeData.tree.id]: true });
// //         }
// //       } else {
// //         // Invalid response format
// //         throw new Error('Invalid response format from server');
// //       }
// //     } catch (error) {
// //       toast.error('Error fetching member data: ' + error.message);
// //       console.error('Data fetch error:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Build a forest (multiple trees) from all members
// //   const buildForest = (allMembers) => {
// //     if (!allMembers || allMembers.length === 0) {
// //       return [];
// //     }

// //     // Step 1: Find all root members (members with no sponsor)
// //     const rootMembers = allMembers.filter(member => !member.sponsor);
// //     console.log('Root members:', rootMembers);

// //     // Step 2: For each root member, build their tree
// //     const forest = rootMembers.map(rootMember => {
// //       // Convert member object to tree node format
// //       const rootNode = {
// //         id: rootMember.id,
// //         member_id: rootMember.member_id,
// //         name: rootMember.user ? `${rootMember.user.first_name || ''} ${rootMember.user.last_name || ''}`.trim() : 'Unknown',
// //         email: rootMember.user ? rootMember.user.email : null,
// //         phone_number: rootMember.user ? rootMember.user.phone_number : null,
// //         is_active: rootMember.is_active,
// //         position_name: rootMember.position ? rootMember.position.name : null,
// //         referral_count: 0, // Will be calculated in buildTree
// //         total_bp: rootMember.total_bp || 0,
// //         total_earnings: rootMember.total_earnings || 0,
// //         children: [] // Initialize empty children array
// //       };
      
// //       // Build complete tree for this root
// //       return buildTree(rootNode, allMembers);
// //     });
    
// //     return forest;
// //   };

// //   // Build a complete tree for a root node
// //   const buildTree = (rootNode, allMembers) => {
// //     // Create a map of all members by member_id for quick lookup
// //     const memberMap = {};
// //     allMembers.forEach(member => {
// //       memberMap[member.member_id] = member;
// //     });

// //     // Recursive function to build the tree
// //     const buildSubtree = (node) => {
// //       // Get direct downline members (members with this node as sponsor)
// //       const directDownline = allMembers.filter(
// //         m => m.sponsor && m.sponsor.member_id === node.member_id
// //       );
      
// //       // For each direct downline, recursively build their subtrees
// //       const children = directDownline.map(member => {
// //         // Convert member object to tree node format
// //         const childNode = {
// //           id: member.id,
// //           member_id: member.member_id,
// //           name: member.user ? `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim() : 'Unknown',
// //           email: member.user ? member.user.email : null,
// //           phone_number: member.user ? member.user.phone_number : null,
// //           is_active: member.is_active,
// //           position_name: member.position ? member.position.name : null,
// //           referral_count: 0, // Will be calculated below
// //           total_bp: member.total_bp || 0,
// //           total_earnings: member.total_earnings || 0,
// //           children: [] // Initialize empty children array
// //         };
        
// //         // Recursively build children for this node
// //         return buildSubtree(childNode);
// //       });
      
// //       // Update node with children and referral count
// //       return {
// //         ...node,
// //         referral_count: children.length,
// //         children: children
// //       };
// //     };

// //     // Start building from the root node
// //     return buildSubtree(rootNode);
// //   };

// //   const fetchMemberDetails = async (memberId) => {
// //     try {
// //       setSelectedMember({...selectedMember, loading: true});
// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${memberId}/`, 
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error('Failed to fetch member details');
// //       }

// //       const data = await response.json();
// //       console.log('Member details:', data);
// //       setSelectedMember(data);
// //     } catch (error) {
// //       toast.error('Error fetching member details');
// //       console.error('Member details error:', error);
// //       setSelectedMember(prev => ({...prev, loading: false, error: error.message}));
// //     }
// //   };

// //   const toggleMemberExpand = (memberId, e) => {
// //     // Stop propagation to prevent selecting the member when just expanding/collapsing
// //     if (e) {
// //       e.stopPropagation();
// //     }
    
// //     setExpandedMembers(prev => ({
// //       ...prev,
// //       [memberId]: !prev[memberId]
// //     }));
// //   };

// //   // Expand all nodes in a specific tree
// //   const expandAllNodes = (rootNode) => {
// //     if (!rootNode) return;

// //     const expandAll = (node, expanded = {}) => {
// //       if (!node) return expanded;
      
// //       // Mark this node as expanded
// //       expanded[node.id] = true;
      
// //       // Process all children
// //       if (node.children && node.children.length > 0) {
// //         node.children.forEach(child => {
// //           expandAll(child, expanded);
// //         });
// //       }
      
// //       return expanded;
// //     };
    
// //     const allExpanded = expandAll(rootNode, {...expandedMembers});
// //     setExpandedMembers(allExpanded);
// //   };

// //   // Collapse all nodes except roots
// //   const collapseAllNodes = () => {
// //     const rootIds = {};
// //     forestData.forEach(tree => {
// //       if (tree && tree.id) {
// //         rootIds[tree.id] = true;
// //       }
// //     });
// //     setExpandedMembers(rootIds);
// //   };

// //   // Function to filter a tree based on search and active filter
// //   const filterTree = (node) => {
// //     if (!node) return null;
    
// //     // Check if current node matches search term and active filter
// //     const nameMatch = searchTerm ? node.name && node.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
// //     const idMatch = searchTerm ? node.member_id && node.member_id.includes(searchTerm) : true;
// //     const matchesSearch = searchTerm ? (nameMatch || idMatch) : true;
    
// //     const matchesFilter = 
// //       filterActive === 'all' || 
// //       (filterActive === 'active' && node.is_active) || 
// //       (filterActive === 'inactive' && !node.is_active);
    
// //     // Filter children recursively
// //     let filteredChildren = [];
// //     if (node.children && node.children.length > 0) {
// //       filteredChildren = node.children
// //         .map(child => filterTree(child))
// //         .filter(child => child !== null);
// //     }
    
// //     // If this node matches criteria or has matching children, include it
// //     if (matchesSearch && matchesFilter) {
// //       return {
// //         ...node,
// //         children: filteredChildren
// //       };
// //     } else if (filteredChildren.length > 0) {
// //       // If this node doesn't match but has matching children, include it
// //       return {
// //         ...node,
// //         children: filteredChildren
// //       };
// //     }
    
// //     // If neither this node nor its children match, exclude it
// //     return null;
// //   };

// //   // Filter the forest based on search and filters
// //   const getFilteredForest = () => {
// //     if (!forestData || forestData.length === 0) return [];
    
// //     // If in single tree view mode, only filter that tree
// //     if (viewMode === 'single' && selectedRoot) {
// //       const filtered = filterTree(selectedRoot);
// //       return filtered ? [filtered] : [];
// //     }
    
// //     // Otherwise filter all trees
// //     return forestData
// //       .map(tree => filterTree(tree))
// //       .filter(tree => tree !== null);
// //   };

// //   const renderMemberNode = (member, level = 0) => {
// //     if (!member) return null;
    
// //     const isExpanded = expandedMembers[member.id];
// //     const hasChildren = member.children && member.children.length > 0;

// //     return (
// //       <div key={member.id} className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} py-1 relative`}>
// //         <div 
// //           className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
// //             selectedMember?.personal_info?.member_id === member.member_id 
// //               ? 'bg-blue-100 hover:bg-blue-200' 
// //               : 'hover:bg-gray-100'
// //           }`}
// //           onClick={() => fetchMemberDetails(member.member_id)}
// //         >
// //           <div className="flex items-center space-x-2">
// //             {hasChildren && (
// //               <button 
// //                 onClick={(e) => toggleMemberExpand(member.id, e)}
// //                 className="p-1 hover:bg-gray-200 rounded-full"
// //               >
// //                 {isExpanded ? (
// //                   <ChevronDown className="text-gray-500" size={16} />
// //                 ) : (
// //                   <ChevronRight className="text-gray-500" size={16} />
// //                 )}
// //               </button>
// //             )}
// //             {!hasChildren && <div className="w-6" />}
// //             <span className="font-medium">{member.name}</span>
// //             <span className="text-sm text-gray-500">({member.member_id})</span>
// //             {member.is_active ? (
// //               <UserCheck className="text-green-500" size={16} title="Active" />
// //             ) : (
// //               <UserX className="text-red-500" size={16} title="Inactive" />
// //             )}
// //           </div>
// //           <div className="flex items-center space-x-2 text-sm text-gray-600">
// //             <span>Referrals: {member.referral_count || 0}</span>
// //             {member.total_bp > 0 && (
// //               <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
// //                 {member.total_bp} BP
// //               </span>
// //             )}
// //           </div>
// //         </div>

// //         {isExpanded && hasChildren && (
// //           <div className="mt-1">
// //             {member.children.map(child => renderMemberNode(child, level + 1))}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   const renderMemberDetails = () => {
// //     if (!selectedMember) return null;
    
// //     if (selectedMember.loading) {
// //       return (
// //         <div className="flex justify-center items-center h-full">
// //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
// //         </div>
// //       );
// //     }
    
// //     if (selectedMember.error) {
// //       return (
// //         <div className="bg-red-50 p-6 rounded-lg">
// //           <p className="text-red-600">Error: {selectedMember.error}</p>
// //           <button 
// //             className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
// //             onClick={() => setSelectedMember(null)}
// //           >
// //             Close
// //           </button>
// //         </div>
// //       );
// //     }

// //     return (
// //       <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
// //         <div className="flex justify-between items-center border-b pb-4">
// //           <h2 className="text-xl font-bold">{selectedMember.personal_info.name}</h2>
// //           <span className={`px-3 py-1 rounded-full text-sm ${
// //             selectedMember.personal_info.is_active 
// //               ? 'bg-green-100 text-green-800' 
// //               : 'bg-red-100 text-red-800'
// //           }`}>
// //             {selectedMember.personal_info.is_active ? 'Active' : 'Inactive'}
// //           </span>
// //         </div>

// //         <div className="grid md:grid-cols-2 gap-4">
// //           <div>
// //             <h3 className="font-semibold mb-2 text-gray-700">Personal Information</h3>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Member ID:</span> {selectedMember.personal_info.member_id}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Email:</span> {selectedMember.personal_info.email || 'Not provided'}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Phone:</span> {selectedMember.personal_info.phone_number || 'Not provided'}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Joined:</span> {new Date(selectedMember.personal_info.date_joined).toLocaleDateString()}</p>
// //           </div>

// //           <div>
// //             <h3 className="font-semibold mb-2 text-gray-700">Position Details</h3>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Current Position:</span> {selectedMember.position_details.current_position || 'N/A'}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Discount:</span> {selectedMember.position_details.discount_percentage}%</p>
// //           </div>
// //         </div>

// //         <div className="grid md:grid-cols-3 gap-4">
// //           <div className="bg-blue-50 p-4 rounded-lg">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <DollarSign className="text-blue-500" />
// //               <h4 className="font-semibold">Financial</h4>
// //             </div>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Total Earnings:</span> ₹{selectedMember.financial_details.total_earnings}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Total BP:</span> {selectedMember.financial_details.total_bp}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Monthly Purchase:</span> ₹{selectedMember.financial_details.current_month_purchase || '0'}</p>
// //           </div>

// //           <div className="bg-green-50 p-4 rounded-lg">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <Users className="text-green-500" />
// //               <h4 className="font-semibold">Network</h4>
// //             </div>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Direct Referrals:</span> {selectedMember.network_details.direct_referrals}</p>
// //             <p className="text-gray-600"><span className="font-medium text-gray-800">Total Network Size:</span> {selectedMember.network_details.total_network_size}</p>
// //           </div>

// //           <div className="bg-purple-50 p-4 rounded-lg">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <Trophy className="text-purple-500" />
// //               <h4 className="font-semibold">Recent Commissions</h4>
// //             </div>
// //             {selectedMember.recent_commissions && selectedMember.recent_commissions.length > 0 ? (
// //               <div className="space-y-2 max-h-24 overflow-y-auto">
// //                 {selectedMember.recent_commissions.map((commission, index) => (
// //                   <div key={index} className="text-sm border-b pb-1 last:border-0">
// //                     <p className="font-medium">₹{commission.amount} from {commission.from_member}</p>
// //                     <p className="text-xs text-gray-500">
// //                       {new Date(commission.date).toLocaleDateString()}
// //                     </p>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-gray-500 text-sm">No recent commissions found</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Calculate total statistics for the forest
// //   const calculateForestStats = () => {
// //     const activeMembers = allMembers.filter(m => m.is_active).length;
// //     const totalBP = allMembers.reduce((sum, m) => sum + (m.total_bp || 0), 0);
    
// //     // Calculate maximum network depth
// //     let maxDepth = 0;
// //     forestData.forEach(tree => {
// //       const treeDepth = calculateNetworkDepth(tree);
// //       maxDepth = Math.max(maxDepth, treeDepth);
// //     });
    
// //     return {
// //       totalMembers: allMembers.length,
// //       activeMembers,
// //       totalBP,
// //       networkDepth: maxDepth
// //     };
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex flex-col justify-center items-center h-64">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
// //         <p className="text-gray-600">{loadingStep}</p>
// //       </div>
// //     );
// //   }

// //   // Get filtered forest data
// //   const filteredForest = getFilteredForest();
// //   const forestStats = calculateForestStats();

// //   return (
// //     <div className="p-6 max-w-7xl mx-auto">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-bold">MLM Member Network</h1>
        
// //         <div className="flex space-x-2">
// //           <div className="flex border rounded-md overflow-hidden">
// //             <button
// //               onClick={() => setViewMode('forest')}
// //               className={`px-3 py-1 flex items-center ${
// //                 viewMode === 'forest' 
// //                   ? 'bg-blue-100 text-blue-700' 
// //                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //               }`}
// //               title="Show all trees"
// //             >
// //               <Globe className="w-4 h-4 mr-1" />
// //               <span className="hidden sm:inline">All Trees</span>
// //             </button>
// //             {selectedRoot && (
// //               <button
// //                 onClick={() => setViewMode('single')}
// //                 className={`px-3 py-1 flex items-center ${
// //                   viewMode === 'single' 
// //                     ? 'bg-blue-100 text-blue-700' 
// //                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                 }`}
// //                 title="Focus on one tree"
// //               >
// //                 <UserPlus className="w-4 h-4 mr-1" />
// //                 <span className="hidden sm:inline">Single Tree</span>
// //               </button>
// //             )}
// //           </div>
          
// //           <button
// //             onClick={fetchAllData}
// //             className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
// //           >
// //             <RefreshCw className="w-4 h-4 mr-2" />
// //             <span className="hidden sm:inline">Refresh</span>
// //           </button>
// //         </div>
// //       </div>
      
// //       {/* Search and Filter */}
// //       <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
// //         <div className="flex flex-wrap gap-4 justify-between items-center">
// //           <div className="relative flex-grow max-w-md">
// //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //               <Search className="h-5 w-5 text-gray-400" />
// //             </div>
// //             <input
// //               type="text"
// //               placeholder="Search by name or member ID"
// //               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </div>
          
// //           <div className="flex flex-wrap gap-4 items-center">
// //             <div className="flex gap-2 items-center">
// //               <Filter className="h-5 w-5 text-gray-500" />
// //               <select
// //                 className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 value={filterActive}
// //                 onChange={(e) => setFilterActive(e.target.value)}
// //               >
// //                 <option value="all">All Members</option>
// //                 <option value="active">Active Only</option>
// //                 <option value="inactive">Inactive Only</option>
// //               </select>
// //             </div>
            
// //             <div className="flex gap-2">
// //               <button 
// //                 onClick={() => {
// //                   if (viewMode === 'single' && selectedRoot) {
// //                     expandAllNodes(selectedRoot);
// //                   } else {
// //                     forestData.forEach(expandAllNodes);
// //                   }
// //                 }}
// //                 className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
// //               >
// //                 Expand All
// //               </button>
// //               <button 
// //                 onClick={collapseAllNodes}
// //                 className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
// //               >
// //                 Collapse All
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
      
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div className="bg-white shadow-md rounded-lg p-4 overflow-auto max-h-[800px]">
// //           <h2 className="text-xl font-bold mb-4 flex items-center">
// //             <Users className="mr-2" /> Member Network
// //           </h2>
          
// //           {filteredForest.length > 0 ? (
// //             <div className="member-forest">
// //               {filteredForest.map((tree, index) => (
// //                 <div key={tree.id || index} className="mb-4">
// //                   {viewMode === 'forest' && filteredForest.length > 1 && (
// //                     <div className="border-b pb-2 mb-2 flex justify-between items-center">
// //                       <div className="font-medium text-gray-500">
// //                         Root Member {index + 1}
// //                       </div>
// //                       <button
// //                         onClick={() => {
// //                           setSelectedRoot(tree);
// //                           setViewMode('single');
// //                         }}
// //                         className="text-xs text-blue-600 hover:text-blue-800"
// //                       >
// //                         Focus on this tree
// //                       </button>
// //                     </div>
// //                   )}
// //                   {renderMemberNode(tree)}
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center p-6 bg-gray-50 rounded-lg">
// //               <p className="text-gray-500">
// //                 {searchTerm || filterActive !== 'all' ? 
// //                   'No members match your search or filter criteria' : 
// //                   'No member tree available'}
// //               </p>
// //               {!(searchTerm || filterActive !== 'all') && (
// //                 <button 
// //                   onClick={fetchAllData}
// //                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
// //                 >
// //                   Refresh
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //         </div>
        
// //         <div>
// //           {selectedMember ? (
// //             renderMemberDetails()
// //           ) : (
// //             <div className="bg-gray-100 h-full min-h-[400px] flex items-center justify-center rounded-lg">
// //               <div className="text-center">
// //                 <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //                 <p className="text-gray-500">Select a member to view details</p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
      
// //       {/* Statistics */}
// //       <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
// //         <h3 className="text-lg font-semibold mb-2">Network Statistics</h3>
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //           <div className="bg-blue-50 p-3 rounded-lg">
// //             <p className="text-sm text-gray-500">Total Members</p>
// //             <p className="text-xl font-bold text-blue-700">{forestStats.totalMembers}</p>
// //           </div>
// //           <div className="bg-green-50 p-3 rounded-lg">
// //             <p className="text-sm text-gray-500">Active Members</p>
// //             <p className="text-xl font-bold text-green-700">
// //               {forestStats.activeMembers}
// //             </p>
// //           </div>
// //           <div className="bg-yellow-50 p-3 rounded-lg">
// //             <p className="text-sm text-gray-500">Total BP Points</p>
// //             <p className="text-xl font-bold text-yellow-700">
// //               {forestStats.totalBP}
// //             </p>
// //           </div>
// //           <div className="bg-purple-50 p-3 rounded-lg">
// //             <p className="text-sm text-gray-500">Network Depth</p>
// //             <p className="text-xl font-bold text-purple-700">
// //               {forestStats.networkDepth}
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Helper function to calculate network depth
// // function calculateNetworkDepth(node, currentDepth = 0) {
// //   if (!node) return 0;
  
// //   let maxChildDepth = 0;
  
// //   if (node.children && node.children.length > 0) {
// //     node.children.forEach(child => {
// //       const childDepth = calculateNetworkDepth(child, currentDepth + 1);
// //       maxChildDepth = Math.max(maxChildDepth, childDepth);
// //     });
// //   }
  
// //   return Math.max(currentDepth, maxChildDepth);
// // }

// // export default MLMMemberTree;


// 'use client'
// import React, { useState, useEffect } from 'react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import { 
//   Users, 
//   ChevronDown, 
//   ChevronRight, 
//   UserCheck, 
//   UserX, 
//   DollarSign, 
//   Trophy,
//   Search,
//   Filter,
//   RefreshCw,
//   Globe,
//   UserPlus,
//   Eye,
//   BarChart3
// } from 'lucide-react';

// const MLMMemberTree = () => {
//   const [forestData, setForestData] = useState([]);
//   const [allMembers, setAllMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedMembers, setExpandedMembers] = useState({});
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterActive, setFilterActive] = useState('all');
//   const [loadingStep, setLoadingStep] = useState('Fetching member data...');
//   const [viewMode, setViewMode] = useState('forest'); // 'forest' or 'single'
//   const [selectedRoot, setSelectedRoot] = useState(null);
//   const [networkStats, setNetworkStats] = useState({
//     totalMembers: 0,
//     activeMembers: 0,
//     totalBP: 0,
//     networkDepth: 0
//   });

//   const { token } = getTokens();

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Fetch all member data and build the forest
//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setLoadingStep('Fetching member forest...');
      
//       // Fetch the tree/forest data from API
//       const treeResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`, 
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       if (!treeResponse.ok) {
//         throw new Error('Failed to fetch member tree');
//       }
      
//       const treeData = await treeResponse.json();
//       console.log('Tree data response:', treeData);
      
//       // Handle both single tree and forest responses
//       if (treeData.forest) {
//         // We received a forest (multiple trees)
//         setForestData(treeData.forest);
        
//         // Auto-expand all root nodes
//         const initialExpanded = {};
//         treeData.forest.forEach(tree => {
//           if (tree && tree.id) {
//             initialExpanded[tree.id] = true;
//           }
//         });
//         setExpandedMembers(initialExpanded);
        
//         // Extract all members from the forest for statistics
//         const extractedMembers = [];
//         extractMembersFromForest(treeData.forest, extractedMembers);
//         setAllMembers(extractedMembers);
        
//         // Calculate and set network statistics
//         setNetworkStats(calculateNetworkStats(treeData.forest, extractedMembers));
//       } 
//       else if (treeData.tree) {
//         // We received a single tree
//         setForestData([treeData.tree]);
//         setSelectedRoot(treeData.tree);
        
//         // Auto-expand the root node
//         if (treeData.tree && treeData.tree.id) {
//           setExpandedMembers({ [treeData.tree.id]: true });
//         }
        
//         // Extract all members from the tree for statistics
//         const extractedMembers = [];
//         extractMembersFromTree(treeData.tree, extractedMembers);
//         setAllMembers(extractedMembers);
        
//         // Calculate and set network statistics
//         setNetworkStats(calculateNetworkStats([treeData.tree], extractedMembers));
//       } 
//       else {
//         // Invalid response format
//         throw new Error('Invalid response format from server');
//       }
//     } catch (error) {
//       toast.error('Error fetching member data: ' + error.message);
//       console.error('Data fetch error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Extract all members from a forest (multiple trees)
//   const extractMembersFromForest = (forest, members) => {
//     if (!forest || !Array.isArray(forest)) return;
    
//     forest.forEach(tree => {
//       extractMembersFromTree(tree, members);
//     });
//   };

//   // Extract all members from a tree (recursively)
//   const extractMembersFromTree = (node, members) => {
//     if (!node) return;
    
//     // Add this node to the members array
//     members.push({
//       id: node.id,
//       member_id: node.member_id,
//       name: node.name,
//       is_active: node.is_active,
//       position: node.position_name,
//       total_bp: node.total_bp || 0,
//       total_earnings: node.total_earnings || 0
//     });
    
//     // Recursively extract children
//     if (node.children && Array.isArray(node.children)) {
//       node.children.forEach(child => {
//         extractMembersFromTree(child, members);
//       });
//     }
//   };

//   // Calculate network statistics
//   const calculateNetworkStats = (forest, allMembers) => {
//     // Count active members
//     const activeMembers = allMembers.filter(m => m.is_active).length;
    
//     // Calculate total BP
//     const totalBP = allMembers.reduce((sum, m) => sum + (m.total_bp || 0), 0);
    
//     // Calculate maximum network depth across all trees
//     let maxDepth = 0;
//     forest.forEach(tree => {
//       const treeDepth = calculateNetworkDepth(tree);
//       maxDepth = Math.max(maxDepth, treeDepth);
//     });
    
//     return {
//       totalMembers: allMembers.length,
//       activeMembers,
//       totalBP,
//       networkDepth: maxDepth
//     };
//   };

//   const fetchMemberDetails = async (memberId) => {
//     try {
//       setSelectedMember({...selectedMember, loading: true});
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${memberId}/`, 
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch member details');
//       }

//       const data = await response.json();
//       console.log('Member details:', data);
//       setSelectedMember(data);
//     } catch (error) {
//       toast.error('Error fetching member details');
//       console.error('Member details error:', error);
//       setSelectedMember(prev => ({...prev, loading: false, error: error.message}));
//     }
//   };

//   const toggleMemberExpand = (memberId, e) => {
//     // Stop propagation to prevent selecting the member when just expanding/collapsing
//     if (e) {
//       e.stopPropagation();
//     }
    
//     setExpandedMembers(prev => ({
//       ...prev,
//       [memberId]: !prev[memberId]
//     }));
//   };

//   // Expand all nodes in a specific tree
//   const expandAllNodes = (rootNode) => {
//     if (!rootNode) return;

//     const expandAll = (node, expanded = {}) => {
//       if (!node) return expanded;
      
//       // Mark this node as expanded
//       expanded[node.id] = true;
      
//       // Process all children
//       if (node.children && node.children.length > 0) {
//         node.children.forEach(child => {
//           expandAll(child, expanded);
//         });
//       }
      
//       return expanded;
//     };
    
//     const allExpanded = expandAll(rootNode, {...expandedMembers});
//     setExpandedMembers(allExpanded);
//   };

//   // Collapse all nodes except roots
//   const collapseAllNodes = () => {
//     const rootIds = {};
//     forestData.forEach(tree => {
//       if (tree && tree.id) {
//         rootIds[tree.id] = true;
//       }
//     });
//     setExpandedMembers(rootIds);
//   };

//   // Function to filter a tree based on search and active filter
//   const filterTree = (node) => {
//     if (!node) return null;
    
//     // Check if current node matches search term and active filter
//     const nameMatch = searchTerm ? node.name && node.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
//     const idMatch = searchTerm ? node.member_id && node.member_id.includes(searchTerm) : true;
//     const matchesSearch = searchTerm ? (nameMatch || idMatch) : true;
    
//     const matchesFilter = 
//       filterActive === 'all' || 
//       (filterActive === 'active' && node.is_active) || 
//       (filterActive === 'inactive' && !node.is_active);
    
//     // Filter children recursively
//     let filteredChildren = [];
//     if (node.children && node.children.length > 0) {
//       filteredChildren = node.children
//         .map(child => filterTree(child))
//         .filter(child => child !== null);
//     }
    
//     // If this node matches criteria or has matching children, include it
//     if (matchesSearch && matchesFilter) {
//       return {
//         ...node,
//         children: filteredChildren
//       };
//     } else if (filteredChildren.length > 0) {
//       // If this node doesn't match but has matching children, include it
//       return {
//         ...node,
//         children: filteredChildren
//       };
//     }
    
//     // If neither this node nor its children match, exclude it
//     return null;
//   };

//   // Filter the forest based on search and filters
//   const getFilteredForest = () => {
//     if (!forestData || forestData.length === 0) return [];
    
//     // If in single tree view mode, only filter that tree
//     if (viewMode === 'single' && selectedRoot) {
//       const filtered = filterTree(selectedRoot);
//       return filtered ? [filtered] : [];
//     }
    
//     // Otherwise filter all trees
//     return forestData
//       .map(tree => filterTree(tree))
//       .filter(tree => tree !== null);
//   };

//   const renderMemberNode = (member, level = 0) => {
//     if (!member) return null;
    
//     const isExpanded = expandedMembers[member.id];
//     const hasChildren = member.children && member.children.length > 0;

//     return (
//       <div key={member.id} className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} py-1 relative`}>
//         <div 
//           className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
//             selectedMember?.personal_info?.member_id === member.member_id 
//               ? 'bg-blue-100 hover:bg-blue-200' 
//               : 'hover:bg-gray-100'
//           }`}
//           onClick={() => fetchMemberDetails(member.member_id)}
//         >
//           <div className="flex items-center space-x-2">
//             {hasChildren && (
//               <button 
//                 onClick={(e) => toggleMemberExpand(member.id, e)}
//                 className="p-1 hover:bg-gray-200 rounded-full"
//               >
//                 {isExpanded ? (
//                   <ChevronDown className="text-gray-500" size={16} />
//                 ) : (
//                   <ChevronRight className="text-gray-500" size={16} />
//                 )}
//               </button>
//             )}
//             {!hasChildren && <div className="w-6" />}
//             <span className="font-medium">{member.name}</span>
//             <span className="text-sm text-gray-500">({member.member_id})</span>
//             {member.is_active ? (
//               <UserCheck className="text-green-500" size={16} title="Active" />
//             ) : (
//               <UserX className="text-red-500" size={16} title="Inactive" />
//             )}
//           </div>
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span>Referrals: {member.referral_count || 0}</span>
//             {member.total_bp > 0 && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
//                 {member.total_bp} BP
//               </span>
//             )}
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 fetchMemberDetails(member.member_id);
//               }}
//               className="p-1 text-blue-600 hover:bg-blue-50 rounded"
//               title="View member details"
//             >
//               <Eye size={14} />
//             </button>
//           </div>
//         </div>

//         {isExpanded && hasChildren && (
//           <div className="mt-1">
//             {member.children.map(child => renderMemberNode(child, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderMemberDetails = () => {
//     if (!selectedMember) return null;
    
//     if (selectedMember.loading) {
//       return (
//         <div className="flex justify-center items-center h-full">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
//         </div>
//       );
//     }
    
//     if (selectedMember.error) {
//       return (
//         <div className="bg-red-50 p-6 rounded-lg">
//           <p className="text-red-600">Error: {selectedMember.error}</p>
//           <button 
//             className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
//             onClick={() => setSelectedMember(null)}
//           >
//             Close
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
//         <div className="flex justify-between items-center border-b pb-4">
//           <h2 className="text-xl font-bold">{selectedMember.personal_info.name}</h2>
//           <span className={`px-3 py-1 rounded-full text-sm ${
//             selectedMember.personal_info.is_active 
//               ? 'bg-green-100 text-green-800' 
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {selectedMember.personal_info.is_active ? 'Active' : 'Inactive'}
//           </span>
//         </div>

//         <div className="grid md:grid-cols-2 gap-4">
//           <div>
//             <h3 className="font-semibold mb-2 text-gray-700">Personal Information</h3>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Member ID:</span> {selectedMember.personal_info.member_id}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Email:</span> {selectedMember.personal_info.email || 'Not provided'}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Phone:</span> {selectedMember.personal_info.phone_number || 'Not provided'}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Joined:</span> {new Date(selectedMember.personal_info.date_joined).toLocaleDateString()}</p>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-2 text-gray-700">Position Details</h3>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Current Position:</span> {selectedMember.position_details.current_position || 'N/A'}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Discount:</span> {selectedMember.position_details.discount_percentage}%</p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-4">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <div className="flex items-center space-x-2 mb-2">
//               <DollarSign className="text-blue-500" />
//               <h4 className="font-semibold">Financial</h4>
//             </div>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Total Earnings:</span> ₹{selectedMember.financial_details.total_earnings}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Total BP:</span> {selectedMember.financial_details.total_bp}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Monthly Purchase:</span> ₹{selectedMember.financial_details.current_month_purchase || '0'}</p>
//           </div>

//           <div className="bg-green-50 p-4 rounded-lg">
//             <div className="flex items-center space-x-2 mb-2">
//               <Users className="text-green-500" />
//               <h4 className="font-semibold">Network</h4>
//             </div>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Direct Referrals:</span> {selectedMember.network_details.direct_referrals}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Total Network Size:</span> {selectedMember.network_details.total_network_size}</p>
//           </div>

//           <div className="bg-purple-50 p-4 rounded-lg">
//             <div className="flex items-center space-x-2 mb-2">
//               <Trophy className="text-purple-500" />
//               <h4 className="font-semibold">Recent Commissions</h4>
//             </div>
//             {selectedMember.recent_commissions && selectedMember.recent_commissions.length > 0 ? (
//               <div className="space-y-2 max-h-24 overflow-y-auto">
//                 {selectedMember.recent_commissions.map((commission, index) => (
//                   <div key={index} className="text-sm border-b pb-1 last:border-0">
//                     <p className="font-medium">₹{commission.amount} from {commission.from_member}</p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(commission.date).toLocaleDateString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 text-sm">No recent commissions found</p>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
//         <p className="text-gray-600">{loadingStep}</p>
//       </div>
//     );
//   }

//   // Get filtered forest data
//   const filteredForest = getFilteredForest();

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">MLM Member Network</h1>
        
//         <div className="flex space-x-2">
//           <div className="flex border rounded-md overflow-hidden">
//             <button
//               onClick={() => setViewMode('forest')}
//               className={`px-3 py-1 flex items-center ${
//                 viewMode === 'forest' 
//                   ? 'bg-blue-100 text-blue-700' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//               title="Show all trees"
//             >
//               <Globe className="w-4 h-4 mr-1" />
//               <span className="hidden sm:inline">All Trees</span>
//             </button>
//             {selectedRoot && (
//               <button
//                 onClick={() => setViewMode('single')}
//                 className={`px-3 py-1 flex items-center ${
//                   viewMode === 'single' 
//                     ? 'bg-blue-100 text-blue-700' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//                 title="Focus on one tree"
//               >
//                 <UserPlus className="w-4 h-4 mr-1" />
//                 <span className="hidden sm:inline">Single Tree</span>
//               </button>
//             )}
//           </div>
          
//           <button
//             onClick={fetchAllData}
//             className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             <span className="hidden sm:inline">Refresh</span>
//           </button>
//         </div>
//       </div>
      
//       {/* Search and Filter */}
//       <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
//         <div className="flex flex-wrap gap-4 justify-between items-center">
//           <div className="relative flex-grow max-w-md">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by name or member ID"
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
          
//           <div className="flex flex-wrap gap-4 items-center">
//             <div className="flex gap-2 items-center">
//               <Filter className="h-5 w-5 text-gray-500" />
//               <select
//                 className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={filterActive}
//                 onChange={(e) => setFilterActive(e.target.value)}
//               >
//                 <option value="all">All Members</option>
//                 <option value="active">Active Only</option>
//                 <option value="inactive">Inactive Only</option>
//               </select>
//             </div>
            
//             <div className="flex gap-2">
//               <button 
//                 onClick={() => {
//                   if (viewMode === 'single' && selectedRoot) {
//                     expandAllNodes(selectedRoot);
//                   } else {
//                     forestData.forEach(expandAllNodes);
//                   }
//                 }}
//                 className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
//               >
//                 Expand All
//               </button>
//               <button 
//                 onClick={collapseAllNodes}
//                 className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
//               >
//                 Collapse All
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white shadow-md rounded-lg p-4 overflow-auto max-h-[800px]">
//           <h2 className="text-xl font-bold mb-4 flex items-center">
//             <Users className="mr-2" /> Member Network
//           </h2>
          
//           {filteredForest.length > 0 ? (
//             <div className="member-forest">
//               {filteredForest.map((tree, index) => (
//                 <div key={tree.id || index} className="mb-4">
//                   {viewMode === 'forest' && filteredForest.length > 1 && (
//                     <div className="border-b pb-2 mb-2 flex justify-between items-center">
//                       <div className="font-medium text-gray-500">
//                         Root Member: {tree.name} ({tree.member_id})
//                       </div>
//                       <button
//                         onClick={() => {
//                           setSelectedRoot(tree);
//                           setViewMode('single');
//                         }}
//                         className="text-xs text-blue-600 hover:text-blue-800"
//                       >
//                         Focus on this tree
//                       </button>
//                     </div>
//                   )}
//                   {renderMemberNode(tree)}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center p-6 bg-gray-50 rounded-lg">
//               <p className="text-gray-500">
//                 {searchTerm || filterActive !== 'all' ? 
//                   'No members match your search or filter criteria' : 
//                   'No member tree available'}
//               </p>
//               {!(searchTerm || filterActive !== 'all') && (
//                 <button 
//                   onClick={fetchAllData}
//                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                 >
//                   Refresh
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
        
//         <div>
//           {selectedMember ? (
//             renderMemberDetails()
//           ) : (
//             <div className="bg-gray-100 h-full min-h-[400px] flex items-center justify-center rounded-lg">
//               <div className="text-center">
//                 <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-500">Select a member to view details</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Statistics */}
//       <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold mb-2 flex items-center">
//           <BarChart3 className="mr-2 text-gray-500" size={18} />
//           Network Statistics
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="bg-blue-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-500">Total Members</p>
//             <p className="text-xl font-bold text-blue-700">{networkStats.totalMembers}</p>
//           </div>
//           <div className="bg-green-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-500">Active Members</p>
//             <p className="text-xl font-bold text-green-700">
//               {networkStats.activeMembers}
//               {networkStats.totalMembers > 0 && (
//                 <span className="text-sm font-normal ml-1">
//                   ({Math.round((networkStats.activeMembers / networkStats.totalMembers) * 100)}%)
//                 </span>
//               )}
//             </p>
//           </div>
//           <div className="bg-yellow-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-500">Total BP Points</p>
//             <p className="text-xl font-bold text-yellow-700">
//               {networkStats.totalBP}
//             </p>
//           </div>
//           <div className="bg-purple-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-500">Network Depth</p>
//             <p className="text-xl font-bold text-purple-700">
//               {networkStats.networkDepth} {networkStats.networkDepth === 1 ? 'Level' : 'Levels'}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper function to calculate network depth
// function calculateNetworkDepth(node, currentDepth = 1) {
//   if (!node) return 0;
  
//   let maxChildDepth = currentDepth;
  
//   if (node.children && node.children.length > 0) {
//     node.children.forEach(child => {
//       const childDepth = calculateNetworkDepth(child, currentDepth + 1);
//       maxChildDepth = Math.max(maxChildDepth, childDepth);
//     });
//   }
  
//   return maxChildDepth;
// }

// export default MLMMemberTree;



'use client'
import React, { useState, useEffect } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  ChevronDown, 
  ChevronRight, 
  UserCheck, 
  UserX, 
  DollarSign, 
  Trophy,
  Search,
  Filter,
  RefreshCw,
  Globe,
  UserPlus,
  Eye,
  BarChart3
} from 'lucide-react';

const MLMMemberTree = () => {
  const [forestData, setForestData] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMembers, setExpandedMembers] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [loadingStep, setLoadingStep] = useState('Fetching member data...');
  const [viewMode, setViewMode] = useState('forest'); // 'forest' or 'single'
  const [selectedRoot, setSelectedRoot] = useState(null);
  const [networkStats, setNetworkStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalBP: 0,
    networkDepth: 0
  });

  const { token } = getTokens();

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all member data and build the forest
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setLoadingStep('Fetching member data...');
      
      // First fetch all MLM members to build the complete forest
      const allMembersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm-members/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!allMembersResponse.ok) {
        throw new Error('Failed to fetch all members');
      }
      
      const allMembersData = await allMembersResponse.json();
      console.log('All members data:', allMembersData);
      setAllMembers(allMembersData);
      
      // Build the forest from all members
      setLoadingStep('Building member forest...');
      const forest = buildForestFromAllMembers(allMembersData);
      console.log('Complete forest:', forest);
      
      if (forest.length > 0) {
        setForestData(forest);
        
        // Auto-expand all root nodes
        const initialExpanded = {};
        forest.forEach(tree => {
          if (tree && tree.id) {
            initialExpanded[tree.id] = true;
          }
        });
        setExpandedMembers(initialExpanded);
        
        // Calculate and set network statistics
        setNetworkStats(calculateNetworkStats(forest, allMembersData));
      } else {
        // As a fallback, try fetching the tree/forest data from API if building fails
        setLoadingStep('Fetching member tree as fallback...');
        const treeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!treeResponse.ok) {
          throw new Error('Failed to fetch member tree');
        }
        
        const treeData = await treeResponse.json();
        console.log('Tree data response:', treeData);
        
        // Handle the response which could be tree, forest, or a direct tree object
        if (treeData.forest) {
          setForestData(treeData.forest);
          setExpandedMembers(
            treeData.forest.reduce((acc, tree) => {
              if (tree && tree.id) acc[tree.id] = true;
              return acc;
            }, {})
          );
        } else if (treeData.tree) {
          setForestData([treeData.tree]);
          setSelectedRoot(treeData.tree);
          if (treeData.tree && treeData.tree.id) {
            setExpandedMembers({ [treeData.tree.id]: true });
          }
        } else if (treeData.children) {
          // We directly received a tree object (not wrapped in 'tree' property)
          setForestData([treeData]);
          setSelectedRoot(treeData);
          if (treeData.id) {
            setExpandedMembers({ [treeData.id]: true });
          }
        } else {
          // Invalid response format
          console.error('Received data format:', treeData);
          throw new Error('Invalid response format from server');
        }
      }
    } catch (error) {
      toast.error('Error fetching member data: ' + error.message);
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Build a forest (multiple trees) from all MLM members
  const buildForestFromAllMembers = (allMembers) => {
    if (!allMembers || allMembers.length === 0) {
      return [];
    }
    
    // First identify root members (those with no sponsor)
    const rootMembers = allMembers.filter(member => !member.sponsor || !member.sponsor.id);
    console.log('Root members:', rootMembers);
    
    // Create a map for quick lookup of members by ID
    const memberMap = {};
    allMembers.forEach(member => {
      // Create a tree node format for each member
      memberMap[member.id] = {
        id: member.id,
        member_id: member.member_id,
        name: member.user ? `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim() : 'Unknown',
        email: member.user ? member.user.email : null,
        phone_number: member.user ? member.user.phone_number : null,
        is_active: member.is_active,
        position_name: member.position ? member.position.name : null,
        referral_count: 0, // Will be calculated
        total_bp: member.total_bp || 0,
        total_earnings: member.total_earnings || 0,
        children: [] // Initialize empty children array
      };
    });
    
    // Build the trees by connecting children to parents
    allMembers.forEach(member => {
      if (member.sponsor && member.sponsor.id) {
        // If the member has a sponsor, add it as a child to the sponsor
        const sponsorId = member.sponsor.id;
        if (memberMap[sponsorId]) {
          memberMap[sponsorId].children.push(memberMap[member.id]);
          // Update referral count for the sponsor
          memberMap[sponsorId].referral_count = (memberMap[sponsorId].referral_count || 0) + 1;
        }
      }
    });
    
    // Build the forest (array of root member trees)
    return rootMembers.map(root => memberMap[root.id]);
  };

  // Extract all members from a forest (multiple trees)
  const extractMembersFromForest = (forest, members) => {
    if (!forest || !Array.isArray(forest)) return;
    
    forest.forEach(tree => {
      extractMembersFromTree(tree, members);
    });
  };

  // Extract all members from a tree (recursively)
  const extractMembersFromTree = (node, members) => {
    if (!node) return;
    
    // Add this node to the members array
    members.push({
      id: node.id,
      member_id: node.member_id,
      name: node.name,
      is_active: node.is_active,
      position: node.position_name,
      total_bp: node.total_bp || 0,
      total_earnings: node.total_earnings || 0
    });
    
    // Recursively extract children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => {
        extractMembersFromTree(child, members);
      });
    }
  };

  // Calculate network statistics
  const calculateNetworkStats = (forest, allMembers) => {
    // Count active members
    const activeMembers = allMembers.filter(m => m.is_active).length;
    
    // Calculate total BP
    const totalBP = allMembers.reduce((sum, m) => sum + (m.total_bp || 0), 0);
    
    // Calculate maximum network depth across all trees
    let maxDepth = 0;
    forest.forEach(tree => {
      const treeDepth = calculateNetworkDepth(tree);
      maxDepth = Math.max(maxDepth, treeDepth);
    });
    
    return {
      totalMembers: allMembers.length,
      activeMembers,
      totalBP,
      networkDepth: maxDepth
    };
  };

  const fetchMemberDetails = async (memberId) => {
    try {
      setSelectedMember({...selectedMember, loading: true});
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${memberId}/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch member details');
      }

      const data = await response.json();
      console.log('Member details:', data);
      setSelectedMember(data);
    } catch (error) {
      toast.error('Error fetching member details');
      console.error('Member details error:', error);
      setSelectedMember(prev => ({...prev, loading: false, error: error.message}));
    }
  };

  const toggleMemberExpand = (memberId, e) => {
    // Stop propagation to prevent selecting the member when just expanding/collapsing
    if (e) {
      e.stopPropagation();
    }
    
    setExpandedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  // Expand all nodes in a specific tree
  const expandAllNodes = (rootNode) => {
    if (!rootNode) return;

    const expandAll = (node, expanded = {}) => {
      if (!node) return expanded;
      
      // Mark this node as expanded
      expanded[node.id] = true;
      
      // Process all children
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          expandAll(child, expanded);
        });
      }
      
      return expanded;
    };
    
    const allExpanded = expandAll(rootNode, {...expandedMembers});
    setExpandedMembers(allExpanded);
  };

  // Collapse all nodes except roots
  const collapseAllNodes = () => {
    const rootIds = {};
    forestData.forEach(tree => {
      if (tree && tree.id) {
        rootIds[tree.id] = true;
      }
    });
    setExpandedMembers(rootIds);
  };

  // Function to filter a tree based on search and active filter
  const filterTree = (node) => {
    if (!node) return null;
    
    // Check if current node matches search term and active filter
    const nameMatch = searchTerm ? node.name && node.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const idMatch = searchTerm ? node.member_id && node.member_id.includes(searchTerm) : true;
    const matchesSearch = searchTerm ? (nameMatch || idMatch) : true;
    
    const matchesFilter = 
      filterActive === 'all' || 
      (filterActive === 'active' && node.is_active) || 
      (filterActive === 'inactive' && !node.is_active);
    
    // Filter children recursively
    let filteredChildren = [];
    if (node.children && node.children.length > 0) {
      filteredChildren = node.children
        .map(child => filterTree(child))
        .filter(child => child !== null);
    }
    
    // If this node matches criteria or has matching children, include it
    if (matchesSearch && matchesFilter) {
      return {
        ...node,
        children: filteredChildren
      };
    } else if (filteredChildren.length > 0) {
      // If this node doesn't match but has matching children, include it
      return {
        ...node,
        children: filteredChildren
      };
    }
    
    // If neither this node nor its children match, exclude it
    return null;
  };

  // Filter the forest based on search and filters
  const getFilteredForest = () => {
    if (!forestData || forestData.length === 0) return [];
    
    // If in single tree view mode, only filter that tree
    if (viewMode === 'single' && selectedRoot) {
      const filtered = filterTree(selectedRoot);
      return filtered ? [filtered] : [];
    }
    
    // Otherwise filter all trees
    return forestData
      .map(tree => filterTree(tree))
      .filter(tree => tree !== null);
  };

  const renderMemberNode = (member, level = 0) => {
    if (!member) return null;
    
    const isExpanded = expandedMembers[member.id];
    const hasChildren = member.children && member.children.length > 0;

    return (
      <div key={member.id} className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} py-1 relative`}>
        <div 
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
            selectedMember?.personal_info?.member_id === member.member_id 
              ? 'bg-blue-100 hover:bg-blue-200' 
              : 'hover:bg-gray-100'
          }`}
          onClick={() => fetchMemberDetails(member.member_id)}
        >
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button 
                onClick={(e) => toggleMemberExpand(member.id, e)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                {isExpanded ? (
                  <ChevronDown className="text-gray-500" size={16} />
                ) : (
                  <ChevronRight className="text-gray-500" size={16} />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            <span className="font-medium">{member.name}</span>
            <span className="text-sm text-gray-500">({member.member_id})</span>
            {member.is_active ? (
              <UserCheck className="text-green-500" size={16} title="Active" />
            ) : (
              <UserX className="text-red-500" size={16} title="Inactive" />
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Referrals: {member.referral_count || 0}</span>
            {member.total_bp > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {member.total_bp} BP
              </span>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                fetchMemberDetails(member.member_id);
              }}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="View member details"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1">
            {member.children.map(child => renderMemberNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderMemberDetails = () => {
    if (!selectedMember) return null;
    
    if (selectedMember.loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    
    if (selectedMember.error) {
      return (
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="text-red-600">Error: {selectedMember.error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            onClick={() => setSelectedMember(null)}
          >
            Close
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold">{selectedMember.personal_info.name}</h2>
          <span className={`px-3 py-1 rounded-full text-sm ${
            selectedMember.personal_info.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {selectedMember.personal_info.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Personal Information</h3>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Member ID:</span> {selectedMember.personal_info.member_id}</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Email:</span> {selectedMember.personal_info.email || 'Not provided'}</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Phone:</span> {selectedMember.personal_info.phone_number || 'Not provided'}</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Joined:</span> {new Date(selectedMember.personal_info.date_joined).toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Position Details</h3>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Current Position:</span> {selectedMember.position_details.current_position || 'N/A'}</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Discount:</span> {selectedMember.position_details.discount_percentage}%</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="text-blue-500" />
              <h4 className="font-semibold">Financial</h4>
            </div>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Total Earnings:</span> ₹{selectedMember.financial_details.total_earnings}</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Total BP:</span> {selectedMember.financial_details.total_bp}</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Monthly Purchase:</span> ₹{selectedMember.financial_details.current_month_purchase || '0'}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="text-green-500" />
              <h4 className="font-semibold">Network</h4>
            </div>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Direct Referrals:</span> {selectedMember.network_details.direct_referrals}</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Total Network Size:</span> {selectedMember.network_details.total_network_size}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="text-purple-500" />
              <h4 className="font-semibold">Recent Commissions</h4>
            </div>
            {selectedMember.recent_commissions && selectedMember.recent_commissions.length > 0 ? (
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {selectedMember.recent_commissions.map((commission, index) => (
                  <div key={index} className="text-sm border-b pb-1 last:border-0">
                    <p className="font-medium">₹{commission.amount} from {commission.from_member}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(commission.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent commissions found</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600">{loadingStep}</p>
      </div>
    );
  }

  // Get filtered forest data
  const filteredForest = getFilteredForest();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MLM Member Network</h1>
        
        <div className="flex space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('forest')}
              className={`px-3 py-1 flex items-center ${
                viewMode === 'forest' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Show all trees"
            >
              <Globe className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">All Trees</span>
            </button>
            {selectedRoot && (
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1 flex items-center ${
                  viewMode === 'single' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Focus on one tree"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Single Tree</span>
              </button>
            )}
          </div>
          
          <button
            onClick={fetchAllData}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or member ID"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 items-center">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
              >
                <option value="all">All Members</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (viewMode === 'single' && selectedRoot) {
                    expandAllNodes(selectedRoot);
                  } else {
                    forestData.forEach(expandAllNodes);
                  }
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Expand All
              </button>
              <button 
                onClick={collapseAllNodes}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4 overflow-auto max-h-[800px]">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Users className="mr-2" /> Member Network
          </h2>
          
          {filteredForest.length > 0 ? (
            <div className="member-forest">
              {filteredForest.map((tree, index) => (
                <div key={tree.id || index} className="mb-4">
                  {viewMode === 'forest' && filteredForest.length > 1 && (
                    <div className="border-b pb-2 mb-2 flex justify-between items-center">
                      <div className="font-medium text-gray-500">
                        Root Member: {tree.name} ({tree.member_id})
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRoot(tree);
                          setViewMode('single');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Focus on this tree
                      </button>
                    </div>
                  )}
                  {renderMemberNode(tree)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {searchTerm || filterActive !== 'all' ? 
                  'No members match your search or filter criteria' : 
                  'No member tree available'}
              </p>
              {!(searchTerm || filterActive !== 'all') && (
                <button 
                  onClick={fetchAllData}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Refresh
                </button>
              )}
            </div>
          )}
        </div>
        
        <div>
          {selectedMember ? (
            renderMemberDetails()
          ) : (
            <div className="bg-gray-100 h-full min-h-[400px] flex items-center justify-center rounded-lg">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a member to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Statistics */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <BarChart3 className="mr-2 text-gray-500" size={18} />
          Network Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Total Members</p>
            <p className="text-xl font-bold text-blue-700">{networkStats.totalMembers}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Active Members</p>
            <p className="text-xl font-bold text-green-700">
              {networkStats.activeMembers}
              {networkStats.totalMembers > 0 && (
                <span className="text-sm font-normal ml-1">
                  ({Math.round((networkStats.activeMembers / networkStats.totalMembers) * 100)}%)
                </span>
              )}
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Total BP Points</p>
            <p className="text-xl font-bold text-yellow-700">
              {networkStats.totalBP}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Network Depth</p>
            <p className="text-xl font-bold text-purple-700">
              {networkStats.networkDepth} {networkStats.networkDepth === 1 ? 'Level' : 'Levels'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate network depth
function calculateNetworkDepth(node, currentDepth = 1) {
  if (!node) return 0;
  
  let maxChildDepth = currentDepth;
  
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      const childDepth = calculateNetworkDepth(child, currentDepth + 1);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    });
  }
  
  return maxChildDepth;
}

export default MLMMemberTree;



// 'use client'
// import React, { useState, useEffect } from 'react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import { 
//   Users, 
//   ChevronDown, 
//   ChevronRight, 
//   UserCheck, 
//   UserX, 
//   DollarSign, 
//   Trophy,
//   Search,
//   Filter,
//   RefreshCw,
//   Globe,
//   UserPlus,
//   Eye,
//   BarChart3
// } from 'lucide-react';

// const MLMMemberTree = () => {
//   const [forestData, setForestData] = useState([]);
//   const [allMembers, setAllMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedMembers, setExpandedMembers] = useState({});
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterActive, setFilterActive] = useState('all');
//   const [loadingStep, setLoadingStep] = useState('Fetching member data...');
//   const [viewMode, setViewMode] = useState('forest'); // 'forest' or 'single'
//   const [selectedRoot, setSelectedRoot] = useState(null);
//   const [networkStats, setNetworkStats] = useState({
//     totalMembers: 0,
//     activeMembers: 0,
//     totalBP: 0,
//     networkDepth: 0
//   });

//   const { token } = getTokens();

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Fetch all member data and build the forest
//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setLoadingStep('Fetching member data...');
      
//       // First fetch all MLM members to build the complete forest
//       const allMembersResponse = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/mlm-members/`, 
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       if (!allMembersResponse.ok) {
//         throw new Error('Failed to fetch all members');
//       }
      
//       const allMembersData = await allMembersResponse.json();
//       console.log('All members data:', allMembersData);
//       setAllMembers(allMembersData);
      
//       // Build the forest from all members
//       setLoadingStep('Building member forest...');
//       const forest = buildForestFromAllMembers(allMembersData);
//       console.log('Complete forest:', forest);
      
//       if (forest.length > 0) {
//         setForestData(forest);
        
//         // Auto-expand all root nodes
//         const initialExpanded = {};
//         forest.forEach(tree => {
//           if (tree && tree.id) {
//             initialExpanded[tree.id] = true;
//           }
//         });
//         setExpandedMembers(initialExpanded);
        
//         // Calculate and set network statistics
//         setNetworkStats(calculateNetworkStats(forest, allMembersData));
//       } else {
//         // As a fallback, try fetching the tree/forest data from API if building fails
//         setLoadingStep('Fetching member tree as fallback...');
//         const treeResponse = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`, 
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           }
//         );
        
//         if (!treeResponse.ok) {
//           throw new Error('Failed to fetch member tree');
//         }
        
//         const treeData = await treeResponse.json();
//         console.log('Tree data response:', treeData);
        
//         // Handle the response which could be tree, forest, or a direct tree object
//         if (treeData.forest) {
//           setForestData(treeData.forest);
//           setExpandedMembers(
//             treeData.forest.reduce((acc, tree) => {
//               if (tree && tree.id) acc[tree.id] = true;
//               return acc;
//             }, {})
//           );
//         } else if (treeData.tree) {
//           setForestData([treeData.tree]);
//           setSelectedRoot(treeData.tree);
//           if (treeData.tree && treeData.tree.id) {
//             setExpandedMembers({ [treeData.tree.id]: true });
//           }
//         } else if (treeData.children) {
//           // We directly received a tree object (not wrapped in 'tree' property)
//           setForestData([treeData]);
//           setSelectedRoot(treeData);
//           if (treeData.id) {
//             setExpandedMembers({ [treeData.id]: true });
//           }
//         } else {
//           // Invalid response format
//           console.error('Received data format:', treeData);
//           throw new Error('Invalid response format from server');
//         }
//       }
//     } catch (error) {
//       toast.error('Error fetching member data: ' + error.message);
//       console.error('Data fetch error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Build a forest (multiple trees) from all MLM members
//   const buildForestFromAllMembers = (allMembers) => {
//     if (!allMembers || allMembers.length === 0) {
//       return [];
//     }
    
//     // First identify root members (those with no sponsor)
//     const rootMembers = allMembers.filter(member => !member.sponsor || !member.sponsor.id);
//     console.log('Root members:', rootMembers);
    
//     // Create a map for quick lookup of members by ID
//     const memberMap = {};
//     allMembers.forEach(member => {
//       // Create a tree node format for each member
//       memberMap[member.id] = {
//         id: member.id,
//         member_id: member.member_id,
//         name: member.user ? `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim() : 'Unknown',
//         email: member.user ? member.user.email : null,
//         phone_number: member.user ? member.user.phone_number : null,
//         is_active: member.is_active,
//         position_name: member.position ? member.position.name : null,
//         referral_count: 0, // Will be calculated
//         total_bp: member.total_bp || 0,
//         total_earnings: member.total_earnings || 0,
//         children: [] // Initialize empty children array
//       };
//     });
    
//     // Build the trees by connecting children to parents
//     allMembers.forEach(member => {
//       if (member.sponsor && member.sponsor.id) {
//         // If the member has a sponsor, add it as a child to the sponsor
//         const sponsorId = member.sponsor.id;
//         if (memberMap[sponsorId]) {
//           memberMap[sponsorId].children.push(memberMap[member.id]);
//           // Update referral count for the sponsor
//           memberMap[sponsorId].referral_count = (memberMap[sponsorId].referral_count || 0) + 1;
//         }
//       }
//     });
    
//     // Build the forest (array of root member trees)
//     return rootMembers.map(root => memberMap[root.id]);
//   };

//   // Extract all members from a forest (multiple trees)
//   const extractMembersFromForest = (forest, members) => {
//     if (!forest || !Array.isArray(forest)) return;
    
//     forest.forEach(tree => {
//       extractMembersFromTree(tree, members);
//     });
//   };

//   // Extract all members from a tree (recursively)
//   const extractMembersFromTree = (node, members) => {
//     if (!node) return;
    
//     // Add this node to the members array
//     members.push({
//       id: node.id,
//       member_id: node.member_id,
//       name: node.name,
//       is_active: node.is_active,
//       position: node.position_name,
//       total_bp: node.total_bp || 0,
//       total_earnings: node.total_earnings || 0
//     });
    
//     // Recursively extract children
//     if (node.children && Array.isArray(node.children)) {
//       node.children.forEach(child => {
//         extractMembersFromTree(child, members);
//       });
//     }
//   };

//   // Calculate network statistics
//   const calculateNetworkStats = (forest, allMembers) => {
//     // Count active members
//     const activeMembers = allMembers.filter(m => m.is_active).length;
    
//     // Calculate total BP
//     const totalBP = allMembers.reduce((sum, m) => sum + (m.total_bp || 0), 0);
    
//     // Calculate maximum network depth across all trees
//     let maxDepth = 0;
//     forest.forEach(tree => {
//       const treeDepth = calculateNetworkDepth(tree);
//       maxDepth = Math.max(maxDepth, treeDepth);
//     });
    
//     return {
//       totalMembers: allMembers.length,
//       activeMembers,
//       totalBP,
//       networkDepth: maxDepth
//     };
//   };

//   const fetchMemberDetails = async (memberId) => {
//     try {
//       setSelectedMember({...selectedMember, loading: true});
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${memberId}/`, 
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch member details');
//       }

//       const data = await response.json();
//       console.log('Member details:', data);
//       setSelectedMember(data);
//     } catch (error) {
//       toast.error('Error fetching member details');
//       console.error('Member details error:', error);
//       setSelectedMember(prev => ({...prev, loading: false, error: error.message}));
//     }
//   };

//   const toggleMemberExpand = (memberId, e) => {
//     // Stop propagation to prevent selecting the member when just expanding/collapsing
//     if (e) {
//       e.stopPropagation();
//     }
    
//     setExpandedMembers(prev => ({
//       ...prev,
//       [memberId]: !prev[memberId]
//     }));
//   };

//   // Expand all nodes in a specific tree
//   const expandAllNodes = (rootNode) => {
//     if (!rootNode) return;

//     const expandAll = (node, expanded = {}) => {
//       if (!node) return expanded;
      
//       // Mark this node as expanded
//       expanded[node.id] = true;
      
//       // Process all children
//       if (node.children && node.children.length > 0) {
//         node.children.forEach(child => {
//           expandAll(child, expanded);
//         });
//       }
      
//       return expanded;
//     };
    
//     const allExpanded = expandAll(rootNode, {...expandedMembers});
//     setExpandedMembers(allExpanded);
//   };

//   // Collapse all nodes except roots
//   const collapseAllNodes = () => {
//     const rootIds = {};
//     forestData.forEach(tree => {
//       if (tree && tree.id) {
//         rootIds[tree.id] = true;
//       }
//     });
//     setExpandedMembers(rootIds);
//   };

//   // Function to filter a tree based on search and active filter
//   const filterTree = (node) => {
//     if (!node) return null;
    
//     // Check if current node matches search term and active filter
//     const nameMatch = searchTerm ? node.name && node.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
//     const idMatch = searchTerm ? node.member_id && node.member_id.includes(searchTerm) : true;
//     const matchesSearch = searchTerm ? (nameMatch || idMatch) : true;
    
//     const matchesFilter = 
//       filterActive === 'all' || 
//       (filterActive === 'active' && node.is_active) || 
//       (filterActive === 'inactive' && !node.is_active);
    
//     // Filter children recursively
//     let filteredChildren = [];
//     if (node.children && node.children.length > 0) {
//       filteredChildren = node.children
//         .map(child => filterTree(child))
//         .filter(child => child !== null);
//     }
    
//     // If this node matches criteria or has matching children, include it
//     if (matchesSearch && matchesFilter) {
//       return {
//         ...node,
//         children: filteredChildren
//       };
//     } else if (filteredChildren.length > 0) {
//       // If this node doesn't match but has matching children, include it
//       return {
//         ...node,
//         children: filteredChildren
//       };
//     }
    
//     // If neither this node nor its children match, exclude it
//     return null;
//   };

//   // Filter the forest based on search and filters
//   const getFilteredForest = () => {
//     if (!forestData || forestData.length === 0) return [];
    
//     // If in single tree view mode, only filter that tree
//     if (viewMode === 'single' && selectedRoot) {
//       const filtered = filterTree(selectedRoot);
//       return filtered ? [filtered] : [];
//     }
    
//     // Otherwise filter all trees
//     return forestData
//       .map(tree => filterTree(tree))
//       .filter(tree => tree !== null);
//   };

//  <div className="w-6" />}
//             <span className="font-medium">{member.name}</span>
//             <span className="text-sm text-gray-500">({member.member_id})</span>
//             {member.is_active ? (
//               <UserCheck className="text-green-500" size={16} title="Active" />
//             ) : (
//               <UserX className="text-red-500" size={16} title="Inactive" />
//             )}
//           </div>
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span>Referrals: {member.referral_count || 0}</span>
//             {member.total_bp > 0 && (
//               <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
//                 {member.total_bp} BP
//               </span>
//             )}
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 fetchMemberDetails(member.member_id);
//               }}
//               className="p-1 text-blue-600 hover:bg-blue-50 rounded"
//               title="View member details"
//             >
//               <Eye size={14} />
//             </button>
//           </div>
//         </div>

//         {isExpanded && hasChildren && (
//           <div className="mt-1">
//             {member.children.map(child => renderMemberNode(child, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderMemberDetails = () => {
//     if (!selectedMember) return null;
    
//     if (selectedMember.loading) {
//       return (
//         <div className="flex justify-center items-center h-full">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
//         </div>
//       );
//     }
    
//     if (selectedMember.error) {
//       return (
//         <div className="bg-red-50 p-6 rounded-lg">
//           <p className="text-red-600">Error: {selectedMember.error}</p>
//           <button 
//             className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
//             onClick={() => setSelectedMember(null)}
//           >
//             Close
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
//         <div className="flex justify-between items-center border-b pb-4">
//           <h2 className="text-xl font-bold">{selectedMember.personal_info.name}</h2>
//           <span className={`px-3 py-1 rounded-full text-sm ${
//             selectedMember.personal_info.is_active 
//               ? 'bg-green-100 text-green-800' 
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {selectedMember.personal_info.is_active ? 'Active' : 'Inactive'}
//           </span>
//         </div>

//         <div className="grid md:grid-cols-2 gap-4">
//           <div>
//             <h3 className="font-semibold mb-2 text-gray-700">Personal Information</h3>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Member ID:</span> {selectedMember.personal_info.member_id}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Email:</span> {selectedMember.personal_info.email || 'Not provided'}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Phone:</span> {selectedMember.personal_info.phone_number || 'Not provided'}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Joined:</span> {new Date(selectedMember.personal_info.date_joined).toLocaleDateString()}</p>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-2 text-gray-700">Position Details</h3>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Current Position:</span> {selectedMember.position_details.current_position || 'N/A'}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Discount:</span> {selectedMember.position_details.discount_percentage}%</p>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-4">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <div className="flex items-center space-x-2 mb-2">
//               <DollarSign className="text-blue-500" />
//               <h4 className="font-semibold">Financial</h4>
//             </div>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Total Earnings:</span> ₹{selectedMember.financial_details.total_earnings}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Total BP:</span> {selectedMember.financial_details.total_bp}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Monthly Purchase:</span> ₹{selectedMember.financial_details.current_month_purchase || '0'}</p>
//           </div>

//           <div className="bg-green-50 p-4 rounded-lg">
//             <div className="flex items-center space-x-2 mb-2">
//               <Users className="text-green-500" />
//               <h4 className="font-semibold">Network</h4>
//             </div>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Direct Referrals:</span> {selectedMember.network_details.direct_referrals}</p>
//             <p className="text-gray-600"><span className="font-medium text-gray-800">Total Network Size:</span> {selectedMember.network_details.total_network_size}</p>
//           </div>

//           <div className="bg-purple-50 p-4 rounded-lg">
//             <div className="flex items-center space-x-2 mb-2">
//               <Trophy className="text-purple-500" />
//               <h4 className="font-semibold">Recent Commissions</h4>
//             </div>
//             {selectedMember.recent_commissions && selectedMember.recent_commissions.length > 0 ? (
//               <div className="space-y-2 max-h-24 overflow-y-auto">
//                 {selectedMember.recent_commissions.map((commission, index) => (
//                   <div key={index} className="text-sm border-b pb-1 last:border-0">
//                     <p className="font-medium">₹{commission.amount} from {commission.from_member}</p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(commission.date).toLocaleDateString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 text-sm">No recent commissions found</p>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
//         <p className="text-gray-600">{loadingStep}</p>
//       </div>
//     );
//   }

//   // Get filtered forest data
//   const filteredForest = getFilteredForest();

//   return (
//     <div className="p-4 lg:p-6 max-w-7xl mx-auto">
//       {/* Header Section */}
//       <div className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-100">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 flex items-center">
//               <Users className="mr-2 text-blue-600" size={24} />
//               MLM Network Visualization
//             </h1>
//             <p className="text-gray-500 mt-1">View and manage your complete MLM member network</p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <div className="flex rounded-md overflow-hidden border border-gray-200">
//               <button
//                 onClick={() => setViewMode('forest')}
//                 className={`px-3 py-2 flex items-center text-sm font-medium transition-colors ${
//                   viewMode === 'forest' 
//                     ? 'bg-blue-50 text-blue-700 border-r border-blue-200' 
//                     : 'bg-white text-gray-600 hover:bg-gray-50 border-r border-gray-200'
//                 }`}
//                 title="Show all trees"
//               >
//                 <Globe className="w-4 h-4 mr-1.5" />
//                 <span>All Trees</span>
//               </button>
//               {selectedRoot && (
//                 <button
//                   onClick={() => setViewMode('single')}
//                   className={`px-3 py-2 flex items-center text-sm font-medium transition-colors ${
//                     viewMode === 'single' 
//                       ? 'bg-blue-50 text-blue-700' 
//                       : 'bg-white text-gray-600 hover:bg-gray-50'
//                   }`}
//                   title="Focus on one tree"
//                 >
//                   <UserPlus className="w-4 h-4 mr-1.5" />
//                   <span>Single Tree</span>
//                 </button>
//               )}
//             </div>
            
//             <button
//               onClick={fetchAllData}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
//             >
//               <RefreshCw className="w-4 h-4 mr-1.5" />
//               <span>Refresh</span>
//             </button>
//           </div>
//         </div>
        
//         {/* Statistics Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
//           <div className="p-4 flex items-center">
//             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
//               <Users size={18} className="text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Members</p>
//               <p className="text-xl font-bold text-gray-800">{networkStats.totalMembers}</p>
//             </div>
//           </div>
          
//           <div className="p-4 flex items-center">
//             <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
//               <UserCheck size={18} className="text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Active Members</p>
//               <p className="text-xl font-bold text-gray-800">
//                 {networkStats.activeMembers}
//                 {networkStats.totalMembers > 0 && (
//                   <span className="text-sm font-normal ml-1 text-green-600">
//                     ({Math.round((networkStats.activeMembers / networkStats.totalMembers) * 100)}%)
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>
          
//           <div className="p-4 flex items-center">
//             <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
//               <BarChart3 size={18} className="text-amber-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total BP Points</p>
//               <p className="text-xl font-bold text-gray-800">{networkStats.totalBP}</p>
//             </div>
//           </div>
          
//           <div className="p-4 flex items-center">
//             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
//               <Trophy size={18} className="text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Network Depth</p>
//               <p className="text-xl font-bold text-gray-800">
//                 {networkStats.networkDepth} {networkStats.networkDepth === 1 ? 'Level' : 'Levels'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Search and Filter Bar */}
//       <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//         <div className="flex flex-col sm:flex-row justify-between gap-4">
//           <div className="relative flex-grow max-w-md">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by name or member ID"
//               className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
          
//           <div className="flex flex-wrap gap-3 items-center">
//             <div className="flex gap-2 items-center">
//               <Filter className="h-5 w-5 text-gray-500" />
//               <select
//                 className="border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
//                 value={filterActive}
//                 onChange={(e) => setFilterActive(e.target.value)}
//               >
//                 <option value="all">All Members</option>
//                 <option value="active">Active Only</option>
//                 <option value="inactive">Inactive Only</option>
//               </select>
//             </div>
            
//             <div className="flex gap-2">
//               <button 
//                 onClick={() => {
//                   if (viewMode === 'single' && selectedRoot) {
//                     expandAllNodes(selectedRoot);
//                   } else {
//                     forestData.forEach(expandAllNodes);
//                   }
//                 }}
//                 className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
//               >
//                 Expand All
//               </button>
//               <button 
//                 onClick={collapseAllNodes}
//                 className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
//               >
//                 Collapse All
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Main Content Area */}
//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//         {/* Member Tree Panel - Wider on large screens */}
//         <div className="lg:col-span-3 bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
//           <div className="p-4 border-b border-gray-100">
//             <h2 className="text-lg font-bold text-gray-800 flex items-center">
//               <Users className="mr-2 text-blue-600" size={18} /> 
//               Member Network
//             </h2>
//           </div>
          
//           <div className="p-4 overflow-auto max-h-[700px]">
//             {filteredForest.length > 0 ? (
//               <div className="member-forest">
//                 {filteredForest.map((tree, index) => (
//                   <div key={tree.id || index} className="mb-5">
//                     {viewMode === 'forest' && filteredForest.length > 1 && (
//                       <div className="bg-gray-50 p-2 rounded-md mb-2 flex justify-between items-center">
//                         <div className="font-medium text-gray-700 flex items-center">
//                           <UserCheck className="mr-2 text-blue-500" size={16} />
//                           <span>{tree.name}</span>
//                           <span className="ml-2 text-xs text-gray-500">({tree.member_id})</span>
//                         </div>
//                         <button
//                           onClick={() => {
//                             setSelectedRoot(tree);
//                             setViewMode('single');
//                           }}
//                           className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
//                         >
//                           Focus
//                         </button>
//                       </div>
//                     )}
//                     {renderMemberNode(tree)}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
//                 <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//                 <p className="text-gray-600 font-medium mb-2">
//                   {searchTerm || filterActive !== 'all' ? 
//                     'No members match your search criteria' : 
//                     'No member network available'}
//                 </p>
//                 <p className="text-gray-500 text-sm mb-4">
//                   {searchTerm || filterActive !== 'all' ? 
//                     'Try changing your search or filter settings' : 
//                     'Try refreshing the data or check your connection'}
//                 </p>
//                 {!(searchTerm || filterActive !== 'all') && (
//                   <button 
//                     onClick={fetchAllData}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                   >
//                     <RefreshCw className="w-4 h-4 mr-1.5 inline-block" />
//                     Refresh Data
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Member Details Panel */}
//         <div className="lg:col-span-2">
//           {selectedMember ? (
//             <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
//               <div className="p-4 border-b border-gray-100 flex justify-between items-center">
//                 <h2 className="text-lg font-bold text-gray-800">Member Details</h2>
//                 <div 
//                   className={`px-2.5 py-1 rounded-full text-xs font-medium ${
//                     selectedMember.personal_info.is_active 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-red-100 text-red-800'
//                   }`}
//                 >
//                   {selectedMember.personal_info.is_active ? 'Active' : 'Inactive'}
//                 </div>
//               </div>
              
//               <div className="p-4 space-y-5">
//                 {/* Personal Info Card */}
//                 <div className="border border-gray-100 rounded-lg overflow-hidden">
//                   <div className="bg-gray-50 p-3 border-b border-gray-100">
//                     <h3 className="font-semibold text-gray-700 flex items-center">
//                       <UserCheck className="mr-2 text-blue-600" size={16} />
//                       Personal Information
//                     </h3>
//                   </div>
//                   <div className="p-3">
//                     <div className="text-xl font-bold text-gray-800 mb-3">
//                       {selectedMember.personal_info.name}
//                     </div>
//                     <div className="grid grid-cols-2 gap-3 text-sm">
//                       <div>
//                         <p className="text-gray-500">Member ID</p>
//                         <p className="font-medium text-gray-800">{selectedMember.personal_info.member_id}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Email</p>
//                         <p className="font-medium text-gray-800">{selectedMember.personal_info.email || 'Not provided'}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Phone</p>
//                         <p className="font-medium text-gray-800">{selectedMember.personal_info.phone_number || 'Not provided'}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Joined</p>
//                         <p className="font-medium text-gray-800">{new Date(selectedMember.personal_info.date_joined).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Position Details Card */}
//                 <div className="border border-gray-100 rounded-lg overflow-hidden">
//                   <div className="bg-gray-50 p-3 border-b border-gray-100">
//                     <h3 className="font-semibold text-gray-700 flex items-center">
//                       <Trophy className="mr-2 text-yellow-600" size={16} />
//                       Position Details
//                     </h3>
//                   </div>
//                   <div className="p-3">
//                     <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-3">
//                       <div className="text-lg font-bold text-gray-800">
//                         {selectedMember.position_details.current_position || 'N/A'}
//                       </div>
//                       <div className="text-sm text-yellow-700">
//                         Discount: {selectedMember.position_details.discount_percentage}%
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Financial and Network Stats */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="border border-gray-100 rounded-lg overflow-hidden">
//                     <div className="bg-gray-50 p-3 border-b border-gray-100">
//                       <h3 className="font-semibold text-gray-700 flex items-center">
//                         <DollarSign className="mr-2 text-green-600" size={16} />
//                         Financial
//                       </h3>
//                     </div>
//                     <div className="p-3 space-y-2 text-sm">
//                       <div>
//                         <p className="text-gray-500">Total Earnings</p>
//                         <p className="font-bold text-gray-800">₹{selectedMember.financial_details.total_earnings}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Total BP</p>
//                         <p className="font-bold text-gray-800">{selectedMember.financial_details.total_bp}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Monthly Purchase</p>
//                         <p className="font-bold text-gray-800">₹{selectedMember.financial_details.current_month_purchase || '0'}</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="border border-gray-100 rounded-lg overflow-hidden">
//                     <div className="bg-gray-50 p-3 border-b border-gray-100">
//                       <h3 className="font-semibold text-gray-700 flex items-center">
//                         <Users className="mr-2 text-blue-600" size={16} />
//                         Network
//                       </h3>
//                     </div>
//                     <div className="p-3 space-y-2 text-sm">
//                       <div>
//                         <p className="text-gray-500">Direct Referrals</p>
//                         <p className="font-bold text-gray-800">{selectedMember.network_details.direct_referrals}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Network Size</p>
//                         <p className="font-bold text-gray-800">{selectedMember.network_details.total_network_size}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Recent Commissions */}
//                 <div className="border border-gray-100 rounded-lg overflow-hidden">
//                   <div className="bg-gray-50 p-3 border-b border-gray-100">
//                     <h3 className="font-semibold text-gray-700 flex items-center">
//                       <DollarSign className="mr-2 text-green-600" size={16} />
//                       Recent Commissions
//                     </h3>
//                   </div>
//                   <div className="max-h-48 overflow-auto">
//                     {selectedMember.recent_commissions && selectedMember.recent_commissions.length > 0 ? (
//                       <div className="divide-y divide-gray-100">
//                         {selectedMember.recent_commissions.map((commission, index) => (
//                           <div key={index} className="p-3 hover:bg-gray-50">
//                             <div className="flex justify-between items-center">
//                               <div>
//                                 <p className="font-medium text-gray-800">₹{commission.amount}</p>
//                                 <p className="text-sm text-gray-500">From: {commission.from_member}</p>
//                               </div>
//                               <p className="text-xs text-gray-500">
//                                 {new Date(commission.date).toLocaleDateString()}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="p-4 text-center text-gray-500">
//                         No recent commissions found
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white shadow-md rounded-lg border border-gray-100 h-full min-h-[400px] flex items-center justify-center">
//               <div className="text-center p-6">
//                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Users className="h-8 w-8 text-blue-500" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">No Member Selected</h3>
//                 <p className="text-gray-500 max-w-xs mx-auto">
//                   Select a member from the network view to see their detailed information
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper function to calculate network depth
// function calculateNetworkDepth(node, currentDepth = 1) {
//   if (!node) return 0;
  
//   let maxChildDepth = currentDepth;
  
//   if (node.children && node.children.length > 0) {
//     node.children.forEach(child => {
//       const childDepth = calculateNetworkDepth(child, currentDepth + 1);
//       maxChildDepth = Math.max(maxChildDepth, childDepth);
//     });
//   }
  
//   return maxChildDepth;
// }

// export default MLMMemberTree;