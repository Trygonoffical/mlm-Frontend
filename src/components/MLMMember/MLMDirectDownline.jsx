'use client'

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, UserGroupIcon, ArrowsRightLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const MLMDirectDownline = ({ params }) => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    joinDateFrom: '',
    joinDateTo: '',
    is_active: ''
  });
  const [positions, setPositions] = useState([]);
  const { token } = getTokens();
  const sponsorId = params?.sponsorId || '';
  const [sponsorInfo, setSponsorInfo] = useState(null);

  useEffect(() => {
    fetchPositions();
    fetchSponsorInfo();
    fetchMembers();
  }, [sponsorId, filters]);

  const fetchPositions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/positions/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch positions');
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load positions');
    }
  };

  const fetchSponsorInfo = async () => {
    if (!sponsorId) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${sponsorId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch sponsor info');
      const data = await response.json();
      setSponsorInfo(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load sponsor information');
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Always filter by sponsor ID
      queryParams.append('sponsor', sponsorId);
      
      // Add other filters
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.position) queryParams.append('position', filters.position);
      if (filters.joinDateFrom) queryParams.append('join_date_from', filters.joinDateFrom);
      if (filters.joinDateTo) queryParams.append('join_date_to', filters.joinDateTo);
      if (filters.is_active) queryParams.append('is_active', filters.is_active);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/downline/?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch downline members');
      const data = await response.json();
      setMembers(data.downline || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load downline members');
    } finally {
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

      if (!response.ok) throw new Error('Failed to fetch member details');
      const data = await response.json();
      setSelectedMember(members.find(m => m.member_id === memberId));
      setMemberDetails(data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load member details');
    }
  };

  const toggleMemberStatus = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm-members/${memberId}/toggle-status/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to update member status');
      
      const data = await response.json();
      toast.success(data.message || 'Member status updated successfully');
      fetchMembers();
      
      if (selectedMember && selectedMember.member_id === memberId) {
        fetchMemberDetails(memberId);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update member status');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      position: '',
      joinDateFrom: '',
      joinDateTo: '',
      is_active: ''
    });
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  if (loading && !members.length) {
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
          <ArrowsRightLeftIcon className="h-6 w-6 mr-2" />
          Direct Downline Members
          {sponsorInfo && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Sponsor: {sponsorInfo.personal_info.name} - ID: {sponsorId})
            </span>
          )}
        </h1>
        
        <a
          href="/admin/mlm/members"
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
        >
          Back to All Members
        </a>
      </div>

      {/* Sponsor Info Card (if available) */}
      {sponsorInfo && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="font-semibold text-lg mb-2 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
            Sponsor Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-500">Name</span>
              <div className="font-medium">{sponsorInfo.personal_info.name}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Position</span>
              <div className="font-medium">{sponsorInfo.position_details.current_position}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Total Network Size</span>
              <div className="font-medium">{sponsorInfo.network_details.total_network_size} members</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filter Downline Members
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name, email, ID..."
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              name="position"
              value={filters.position}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Positions</option>
              {positions.map(position => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
          </div>

          <div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date From</label>
            <input
              type="date"
              name="joinDateFrom"
              value={filters.joinDateFrom}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date To</label>
            <input
              type="date"
              name="joinDateTo"
              value={filters.joinDateTo}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Direct Downline</div>
          <div className="text-2xl font-bold">{members.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Active Members</div>
          <div className="text-2xl font-bold">
            {members.filter(m => m.is_active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Inactive Members</div>
          <div className="text-2xl font-bold">
            {members.filter(m => !m.is_active).length}
          </div>
        </div>
      </div>

      {/* Member List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BP Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No direct downline members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {member.member_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{member.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{member.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.join_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.total_bp || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(member.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => fetchMemberDetails(member.member_id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => toggleMemberStatus(member.member_id)}
                          className={`flex items-center ${member.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {member.is_active ? (
                            <>
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Activate
                            </>
                          )}
                        </button>
                        <a
                          href={`/admin/mlm/downline/${member.member_id}`}
                          className="text-purple-600 hover:text-purple-900 flex items-center"
                        >
                          <ArrowsRightLeftIcon className="h-4 w-4 mr-1" />
                          Downline
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>
            MLM Member Details
            {selectedMember && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                (ID: {selectedMember.member_id})
              </span>
            )}
          </DialogTitle>
          
          {selectedMember && memberDetails && (
            <div className="space-y-6">
              {/* Member details content - reuse from AdminMLMMembersList component */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Full Name</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {memberDetails.personal_info.name}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Email</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {memberDetails.personal_info.email || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Phone</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {memberDetails.personal_info.phone_number}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Date Joined</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {new Date(memberDetails.personal_info.date_joined).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Status</span>
                      <div className="mt-1">
                        {memberDetails.personal_info.is_active ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Position Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Current Position</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {memberDetails.position_details.current_position}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Discount Percentage</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {memberDetails.position_details.discount_percentage}%
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Financial Overview</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Total Earnings</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        ₹{parseFloat(memberDetails.financial_details.total_earnings).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Total BP</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {memberDetails.financial_details.total_bp} points
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Network Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Direct Referrals</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {memberDetails.network_details.direct_referrals}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Total Network Size</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {memberDetails.network_details.total_network_size} members
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <a
                      href={`/admin/mlm/downline/${selectedMember.member_id}`}
                      className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600"
                    >
                      View Downline
                    </a>
                    <a
                      href={`/admin/mlm/network/${selectedMember.member_id}`}
                      className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      View Network Tree
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">
                      {memberDetails.recent_commissions && memberDetails.recent_commissions.length > 0 ? (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Recent Commissions</h4>
                          <ul className="space-y-2">
                            {memberDetails.recent_commissions.slice(0, 3).map((commission, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{new Date(commission.date).toLocaleDateString()}</span>
                                <span className="font-medium">₹{commission.amount.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>No recent activity found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => toggleMemberStatus(selectedMember.member_id)}
                  className={`px-4 py-2 rounded-md text-white ${
                    memberDetails.personal_info.is_active 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {memberDetails.personal_info.is_active ? 'Deactivate Member' : 'Activate Member'}
                </button>
                <a
                  href={`/admin/mlm/members/${selectedMember.member_id}`}
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  View Full Details
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MLMDirectDownline;