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
  Trophy 
} from 'lucide-react';

const MLMMemberTree = () => {
  const [memberTree, setMemberTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedMembers, setExpandedMembers] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);

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
      console.log(' tree data - ', data)
      setMemberTree(data.tree);
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
      console.log(' tree data - ', data)
      setSelectedMember(data);
    } catch (error) {
      toast.error('Error fetching member details');
      console.error(error);
    }
  };

  const toggleMemberExpand = (memberId) => {
    setExpandedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const renderMemberNode = (member) => {
    const isExpanded = expandedMembers[member.id];

    return (
      <div key={member.id} className="ml-4 border-l-2 border-gray-200 pl-4 py-2">
        <div 
          className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
          onClick={() => {
            fetchMemberDetails(member.member_id);
            toggleMemberExpand(member.id);
          }}
        >
          <div className="flex items-center space-x-2">
            {member.children && member.children.length > 0 ? (
              isExpanded ? (
                <ChevronDown className="text-gray-500" size={16} />
              ) : (
                <ChevronRight className="text-gray-500" size={16} />
              )
            ) : null}
            <span className="font-medium">{member.name}</span>
            <span className="text-sm text-gray-500">({member.member_id})</span>
            {member.is_active ? (
              <UserCheck className="text-green-500" size={16} />
            ) : (
              <UserX className="text-red-500" size={16} />
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Referrals: {member.referral_count}</span>
            <DollarSign className="text-blue-500" size={16} />
          </div>
        </div>

        {isExpanded && member.children && member.children.length > 0 && (
          <div className="mt-2">
            {member.children.map(renderMemberNode)}
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
            <h3 className="font-semibold mb-2">Personal Information</h3>
            <p>Member ID: {selectedMember.personal_info.member_id}</p>
            <p>Email: {selectedMember.personal_info.email}</p>
            <p>Phone: {selectedMember.personal_info.phone_number}</p>
            <p>Joined: {new Date(selectedMember.personal_info.date_joined).toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Position Details</h3>
            <p>Current Position: {selectedMember.position_details.current_position || 'N/A'}</p>
            <p>Discount: {selectedMember.position_details.discount_percentage}%</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="text-blue-500" />
              <h4 className="font-semibold">Financial</h4>
            </div>
            <p>Total Earnings: ₹{selectedMember.financial_details.total_earnings}</p>
            <p>Total BP: {selectedMember.financial_details.total_bp}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="text-green-500" />
              <h4 className="font-semibold">Network</h4>
            </div>
            <p>Direct Referrals: {selectedMember.network_details.direct_referrals}</p>
            <p>Total Network Size: {selectedMember.network_details.total_network_size}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="text-purple-500" />
              <h4 className="font-semibold">Recent Commissions</h4>
            </div>
            {selectedMember.recent_commissions.map((commission, index) => (
              <div key={index} className="text-sm">
                <p>₹{commission.amount} from {commission.from_member}</p>
                <p className="text-xs text-gray-500">
                  {new Date(commission.date).toLocaleDateString()}
                </p>
              </div>
            ))}
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

  return (
    <div className="p-6 max-w-7xl mx-auto flex space-x-6">
      <div className="w-1/2 bg-white shadow-md rounded-lg p-4 overflow-auto max-h-[800px]">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Users className="mr-2" /> Member Network
        </h2>
        {memberTree ? renderMemberNode(memberTree) : (
          <p className="text-center text-gray-500">No member tree available</p>
        )}
      </div>
      
      <div className="w-1/2">
        {selectedMember ? (
          renderMemberDetails()
        ) : (
          <div className="bg-gray-100 h-full flex items-center justify-center rounded-lg">
            <p className="text-gray-500">Select a member to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLMMemberTree;