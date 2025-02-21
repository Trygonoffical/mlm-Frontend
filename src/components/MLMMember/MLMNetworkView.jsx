'use client'

import React, { useState, useEffect } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { ShareIcon, UserGroupIcon, ChevronDownIcon, ChevronRightIcon, CircleStackIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const MLMNetworkView = ({ params }) => {
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({});
  const { token } = getTokens();
  const memberId = params?.memberId || '';

  useEffect(() => {
    fetchNetworkData();
  }, [memberId]);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      const endpoint = memberId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/?root=${memberId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-tree/`;
        
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch network data');
      const data = await response.json();
      setNetworkData(data.tree);
      
      // Auto-expand the first level
      if (data.tree && data.tree.children) {
        const firstLevelExpanded = {};
        firstLevelExpanded[data.tree.id] = true;
        setExpandedNodes(firstLevelExpanded);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load network structure');
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const renderNetworkNode = (node, level = 0) => {
    if (!node) return null;
    
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="network-node">
        <div 
          className={`flex items-center p-2 hover:bg-gray-50 rounded-md ${level === 0 ? 'bg-blue-50' : ''}`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.id)}
              className="mr-2 focus:outline-none"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <span className="w-4 h-4 mr-2"></span>
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
              {node.total_bp} BP
            </div>
          </div>
          
          <a
            href={`/admin/mlm/members/${node.member_id}`}
            className="ml-4 text-blue-600 hover:text-blue-800"
          >
            <ShareIcon className="h-4 w-4" />
          </a>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="children">
            {node.children.map(childNode => renderNetworkNode(childNode, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading && !networkData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
        <div className="text-sm text-gray-500 mb-4">
          This view displays the hierarchical structure of your MLM network. Click on the arrow icons to expand or collapse branches.
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

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="network-tree">
          {networkData ? (
            renderNetworkNode(networkData)
          ) : (
            <div className="text-center py-10 text-gray-500">
              No network data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLMNetworkView;