// 'use client'

// import React, { useState, useEffect } from 'react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import { ShareIcon, UserGroupIcon, ChevronDownIcon, ChevronRightIcon, CircleStackIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// const MLMNetworkView = ({ params }) => {
//   const [networkData, setNetworkData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [expandedNodes, setExpandedNodes] = useState({});
//   const { token } = getTokens();
//   const memberId = params?.memberId || '';

//   useEffect(() => {
//     fetchNetworkData();
//   }, [memberId]);

//   const fetchNetworkData = async () => {
//     try {
//       setLoading(true);
//       const endpoint = memberId 
//         ? `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/?root=${memberId}`
//         : `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`;
        
//       const response = await fetch(endpoint, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) throw new Error('Failed to fetch network data');
//       const data = await response.json();
//       setNetworkData(data.tree);
      
//       // Auto-expand the first level
//       if (data.tree && data.tree.children) {
//         const firstLevelExpanded = {};
//         firstLevelExpanded[data.tree.id] = true;
//         setExpandedNodes(firstLevelExpanded);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to load network structure');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleNode = (nodeId) => {
//     setExpandedNodes(prev => ({
//       ...prev,
//       [nodeId]: !prev[nodeId]
//     }));
//   };

//   const renderNetworkNode = (node, level = 0) => {
//     if (!node) return null;
    
//     const isExpanded = expandedNodes[node.id];
//     const hasChildren = node.children && node.children.length > 0;
    
//     return (
//       <div key={node.id} className="network-node">
//         <div 
//           className={`flex items-center p-2 hover:bg-gray-50 rounded-md ${level === 0 ? 'bg-blue-50' : ''}`}
//           style={{ marginLeft: `${level * 20}px` }}
//         >
//           {hasChildren ? (
//             <button
//               onClick={() => toggleNode(node.id)}
//               className="mr-2 focus:outline-none"
//             >
//               {isExpanded ? (
//                 <ChevronDownIcon className="h-4 w-4 text-gray-500" />
//               ) : (
//                 <ChevronRightIcon className="h-4 w-4 text-gray-500" />
//               )}
//             </button>
//           ) : (
//             <span className="w-4 h-4 mr-2"></span>
//           )}
          
//           <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
//             <UserGroupIcon className="h-4 w-4 text-gray-500" />
//           </div>
          
//           <div className="flex-grow">
//             <div className="text-sm font-medium">{node.name}</div>
//             <div className="text-xs text-gray-500">ID: {node.member_id}</div>
//           </div>
          
//           <div className="flex flex-col items-end">
//             <div className={`text-xs px-2 py-0.5 rounded-full ${node.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//               {node.is_active ? 'Active' : 'Inactive'}
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               {node.referral_count} direct referrals
//             </div>
//           </div>
          
//           <div className="ml-4 flex items-center">
//             <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
//               <CircleStackIcon className="h-3 w-3 inline mr-1" />
//               {node.total_bp} BP
//             </div>
//           </div>
          
//           <a
//             href={`/admin/mlm/members/${node.member_id}`}
//             className="ml-4 text-blue-600 hover:text-blue-800"
//           >
//             <ShareIcon className="h-4 w-4" />
//           </a>
//         </div>
        
//         {isExpanded && hasChildren && (
//           <div className="children">
//             {node.children.map(childNode => renderNetworkNode(childNode, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading && !networkData) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold flex items-center">
//           <UserGroupIcon className="h-6 w-6 mr-2" />
//           MLM Network Structure
//           {memberId && (
//             <span className="ml-2 text-sm font-normal text-gray-500">
//               (Root Member ID: {memberId})
//             </span>
//           )}
//         </h1>
        
//         <button
//           onClick={fetchNetworkData}
//           className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
//         >
//           <ArrowPathIcon className="h-4 w-4 mr-1" />
//           Refresh
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//         <div className="text-sm text-gray-500 mb-4">
//           This view displays the hierarchical structure of your MLM network. Click on the arrow icons to expand or collapse branches.
//         </div>
        
//         <div className="flex space-x-6 text-sm">
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
//             <span>Active members</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-red-100 mr-1"></div>
//             <span>Inactive members</span>
//           </div>
//           <div className="flex items-center">
//             <CircleStackIcon className="h-3 w-3 text-blue-600 mr-1" />
//             <span>Business Points (BP)</span>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-4">
//         <div className="network-tree">
//           {networkData ? (
//             renderNetworkNode(networkData)
//           ) : (
//             <div className="text-center py-10 text-gray-500">
//               No network data available
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MLMNetworkView;


'use client'

import React, { useState, useEffect } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  ShareIcon, 
  UserGroupIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  CircleStackIcon, 
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const MLMNetworkView = ({ params }) => {
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [error, setError] = useState(null);
  
  const { token } = getTokens();
  const memberId = params?.memberId || '';

  useEffect(() => {
    fetchNetworkData();
  }, [memberId]);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = memberId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/?root=${memberId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`;
        
      console.log('Fetching network data from:', endpoint);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch network data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Network data received:', data);
      
      if (!data.tree) {
        console.error('Invalid data format received:', data);
        throw new Error('Invalid data format received from the server');
      }
      
      setNetworkData(data.tree);
      
      // Auto-expand the root node
      if (data.tree && data.tree.id) {
        setExpandedNodes(prev => ({
          ...prev,
          [data.tree.id]: true
        }));
      }
    } catch (error) {
      console.error('Error fetching network data:', error);
      setError(error.message);
      toast.error('Failed to load network structure: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId, e) => {
    // Prevent the click from affecting parent elements
    if (e) {
      e.stopPropagation();
    }
    
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const expandAllNodes = (node) => {
    if (!node) return {};
    
    // Start with this node expanded
    let newExpandedNodes = { [node.id]: true };
    
    // Recursively expand all children
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        const childExpandedNodes = expandAllNodes(child);
        newExpandedNodes = { ...newExpandedNodes, ...childExpandedNodes };
      });
    }
    
    return newExpandedNodes;
  };

  const collapseAllNodes = () => {
    setExpandedNodes({});
    
    // Keep root node expanded
    if (networkData && networkData.id) {
      setExpandedNodes({ [networkData.id]: true });
    }
  };

  // Function to check if node or any of its children match the search term
  const nodeMatchesSearch = (node, term) => {
    if (!node || !term) return true;
    
    const searchLower = term.toLowerCase();
    
    // Check if this node matches
    const nameMatch = node.name && node.name.toLowerCase().includes(searchLower);
    const idMatch = node.member_id && node.member_id.toLowerCase().includes(searchLower);
    
    if (nameMatch || idMatch) return true;
    
    // Check if any children match
    if (node.children && node.children.length > 0) {
      return node.children.some(child => nodeMatchesSearch(child, term));
    }
    
    return false;
  };

  // Function to filter the tree
  const filterTree = (node) => {
    if (!node) return null;
    
    // Check active filter
    if (showActiveOnly && !node.is_active) {
      return null;
    }
    
    // Check search term
    if (searchTerm && !nodeMatchesSearch(node, searchTerm)) {
      return null;
    }
    
    // Process children
    let filteredChildren = [];
    if (node.children && node.children.length > 0) {
      filteredChildren = node.children
        .map(filterTree)
        .filter(Boolean); // Remove null results
    }
    
    // Return filtered node
    return {
      ...node,
      children: filteredChildren
    };
  };

  const renderNetworkNode = (node, level = 0) => {
    if (!node) return null;
    
    // Apply filters
    const filteredNode = filterTree(node);
    if (!filteredNode) return null;
    
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    
    // If search is active and node matches, ensure all parent nodes are expanded
    if (searchTerm && (
      node.name && node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.member_id && node.member_id.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      // This would automatically expand parents in the UI
    }
    
    return (
      <div key={node.id} className="network-node relative">
        {/* Connector lines for tree visualization */}
        {level > 0 && (
          <div className="absolute left-0 top-0 h-full w-4 border-l-2 border-gray-200 -ml-4"></div>
        )}
        
        <div 
          className={`flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer relative
            ${level === 0 ? 'bg-blue-50' : ''}
            ${searchTerm && nodeMatchesSearch(node, searchTerm) && !hasChildren ? 'bg-yellow-50' : ''}
          `}
          style={{ marginLeft: `${level * 24}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {/* Connector for the current node */}
          {level > 0 && (
            <div className="absolute left-0 top-1/2 w-5 border-t-2 border-gray-200 -ml-5"></div>
          )}
          
          {hasChildren ? (
            <button
              onClick={(e) => toggleNode(node.id, e)}
              className="mr-2 focus:outline-none hover:bg-gray-200 rounded p-1"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <span className="w-6 h-6 mr-2"></span>
          )}
          
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
            <UserGroupIcon className="h-4 w-4 text-gray-500" />
          </div>
          
          <div className="flex-grow">
            <div className="text-sm font-medium">{node.name}</div>
            <div className="text-xs text-gray-500">ID: {node.member_id}</div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className={`text-xs px-2 py-0.5 rounded-full ${node.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {node.is_active ? 'Active' : 'Inactive'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {node.referral_count} direct referrals
            </div>
          </div>
          
          <div className="ml-4 flex items-center">
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              <CircleStackIcon className="h-3 w-3 inline mr-1" />
              {node.total_bp || 0} BP
            </div>
          </div>
          
          <a
            href={`/admin/mlm/members/${node.member_id}`}
            className="ml-4 text-blue-600 hover:text-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            <ShareIcon className="h-4 w-4" />
          </a>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="children ml-6">
            {node.children.map(childNode => renderNetworkNode(childNode, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleExpandAll = () => {
    if (networkData) {
      const allExpanded = expandAllNodes(networkData);
      setExpandedNodes(allExpanded);
    }
  };

  if (loading && !networkData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Determine the filtered tree data
  const filteredData = networkData ? filterTree(networkData) : null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2" />
          MLM Network Structure
          {memberId && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Root Member ID: {memberId})
            </span>
          )}
        </h1>
        
        <button
          onClick={fetchNetworkData}
          className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <div className="text-sm text-gray-500">
            This view displays the hierarchical structure of your MLM network. Click on the nodes to expand or collapse.
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleExpandAll}
              className="text-sm px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
            >
              Expand All
            </button>
            <button 
              onClick={collapseAllNodes}
              className="text-sm px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded"
            >
              Collapse All
            </button>
          </div>
        </div>
        
        <div className="flex space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
            <span>Active members</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-100 mr-1"></div>
            <span>Inactive members</span>
          </div>
          <div className="flex items-center">
            <CircleStackIcon className="h-3 w-3 text-blue-600 mr-1" />
            <span>Business Points (BP)</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or member ID"
              className="pl-10 pr-10 py-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Filters:</span>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-4 w-4"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700">Active Only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        {error ? (
          <div className="text-center py-10">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={fetchNetworkData}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredData ? (
          <div className="network-tree min-w-[600px]">
            {renderNetworkNode(filteredData)}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            {searchTerm || showActiveOnly ? 
              'No members match your search or filter criteria' : 
              'No network data available'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MLMNetworkView;