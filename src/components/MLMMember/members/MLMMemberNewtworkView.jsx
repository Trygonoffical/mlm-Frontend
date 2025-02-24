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
  Filter
} from 'lucide-react';

const MLMMemberNetworkView = () => {
  const [memberTree, setMemberTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedMembers, setExpandedMembers] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  const { token } = getTokens();

  useEffect(() => {
    fetchMemberTree();
  }, []);

  const fetchMemberTree = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch member tree');
      }

      const data = await response.json();
      console.log('Member tree data:', data);
      
      // Determine the tree data based on response structure
      const treeData = data.tree || data.forest?.[0] || data;
      
      setMemberTree(treeData);
      
      // Auto-expand the root node
      if (treeData && treeData.id) {
        setExpandedMembers({ [treeData.id]: true });
      }
      
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching member tree');
      console.error(error);
      setLoading(false);
    }
  };

  const fetchMemberDetails = async (memberId) => {
    try {
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
      console.error(error);
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

  // Function to filter tree based on search and active filter
  const filterTree = (node) => {
    if (!node) return null;
    
    // Check if current node matches search term and active filter
    const nameMatch = searchTerm ? 
      node.name && node.name.toLowerCase().includes(searchTerm.toLowerCase()) : 
      true;
    const idMatch = searchTerm ? 
      node.member_id && node.member_id.includes(searchTerm) : 
      true;
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
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Member ID:</span> {selectedMember.personal_info.member_id}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Email:</span> {selectedMember.personal_info.email || 'Not provided'}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Phone:</span> {selectedMember.personal_info.phone_number || 'Not provided'}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Joined:</span> {new Date(selectedMember.personal_info.date_joined).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Position Details</h3>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Current Position:</span> {selectedMember.position_details.current_position || 'N/A'}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Discount:</span> {selectedMember.position_details.discount_percentage}%
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="text-blue-500" />
              <h4 className="font-semibold">Financial</h4>
            </div>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Total Earnings:</span> ₹{selectedMember.financial_details.total_earnings}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Total BP:</span> {selectedMember.financial_details.total_bp}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Monthly Purchase:</span> ₹{selectedMember.financial_details.current_month_purchase || '0'}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="text-green-500" />
              <h4 className="font-semibold">Network</h4>
            </div>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Direct Referrals:</span> {selectedMember.network_details.direct_referrals}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-800">Total Network Size:</span> {selectedMember.network_details.total_network_size}
            </p>
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Filtered tree
  const filteredTree = filterTree(memberTree);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Network</h1>
      
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
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-4 overflow-auto max-h-[800px]">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Users className="mr-2" /> My Network
          </h2>
          {filteredTree ? (
            renderMemberNode(filteredTree)
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No member network available</p>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2">
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

      {/* Network Statistics */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Trophy className="mr-2 text-gray-600" /> Network Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Members</p>
            <p className="text-xl font-bold text-blue-700">
              {filteredTree ? 
                (calculateTotalMembers(filteredTree) || 0) : 
                0
              }
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Active Members</p>
            <p className="text-xl font-bold text-green-700">
              {filteredTree ? 
                (calculateActiveMembersCount(filteredTree) || 0) : 
                0
              }
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total BP</p>
            <p className="text-xl font-bold text-yellow-700">
              {filteredTree ? 
                (calculateTotalBP(filteredTree) || 0) : 
                0
              }
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Network Depth</p>
            <p className="text-xl font-bold text-purple-700">
              {filteredTree ? 
                (calculateNetworkDepth(filteredTree) || 0) : 
                0
              } Levels
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for network statistics
function calculateTotalMembers(node) {
  if (!node) return 0;
  
  let total = 1; // Count the current node
  
  // Recursively count children
  if (node.children && node.children.length > 0) {
    total += node.children.reduce((sum, child) => 
      sum + calculateTotalMembers(child), 0);
  }
  
  return total;
}

function calculateActiveMembersCount(node) {
  if (!node) return 0;
  
  // Count current node if active
  let total = node.is_active ? 1 : 0;
  
  // Recursively count active children
  if (node.children && node.children.length > 0) {
    total += node.children.reduce((sum, child) => 
      sum + calculateActiveMembersCount(child), 0);
  }
  
  return total;
}

function calculateTotalBP(node) {
  if (!node) return 0;
  
  let totalBP = node.total_bp || 0;
  
  // Recursively sum BP from children
  if (node.children && node.children.length > 0) {
    totalBP += node.children.reduce((sum, child) => 
      sum + calculateTotalBP(child), 0);
  }
  
  return totalBP;
}

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

export default MLMMemberNetworkView;