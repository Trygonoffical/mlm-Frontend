'use client'

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, UserGroupIcon, ArrowsRightLeftIcon, BanknotesIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import MLMLiveCommissions from '../MLMMember/MLMLiveCommissions';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';


// Utility function to convert data to CSV
const convertToCSV = (data) => {
  // Define headers
  const headers = [
    'Member ID', 
    'First Name', 
    'Last Name', 
    'Email', 
    'Phone Number', 
    'Position', 
    'Sponsor ID', 
    'Total Earnings', 
    'Total BP', 
    'Current Month Purchase', 
    'Join Date', 
    'Status'
  ];

  // Map data to CSV rows
  const csvRows = data.map(member => [
    member.member_id,
    member.user.first_name,
    member.user.last_name,
    member.user.email || 'N/A',
    member.user.phone_number,
    member.position.name,
    member.sponsor ? member.sponsor.member_id : 'N/A',
    parseFloat(member.total_earnings).toFixed(2),
    member.total_bp,
    parseFloat(member.current_month_purchase).toFixed(2),
    new Date(member.join_date).toLocaleDateString(),
    member.is_active ? 'Active' : 'Inactive'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...csvRows.map(row => row.map(field => 
      // Escape commas and quotes
      `"${String(field).replace(/"/g, '""')}"`
    ).join(','))
  ].join('\n');

  return csvContent;
};


const AdminMLMMembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [positions, setPositions] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    sponsor: '',
    joinDate: '',
    is_active: ''
  });
  const { token } = getTokens();
  const [exportLoading, setExportLoading] = useState(false);
  useEffect(() => {
    fetchPositions();
    fetchMembers();
  }, [filters]);


  const exportMembers = async () => {
    try {
      setExportLoading(true);
      
      // Create query params for export (same as fetch)
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.position) queryParams.append('position', filters.position);
      if (filters.sponsor) queryParams.append('sponsor', filters.sponsor);
      if (filters.joinDate) queryParams.append('join_date', filters.joinDate);
      if (filters.is_active) queryParams.append('is_active', filters.is_active);

      // Fetch members with applied filters
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm-members/?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch MLM members for export');
      
      const data = await response.json();

      // Convert to CSV
      const csvContent = convertToCSV(data);

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `mlm_members_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('MLM Members exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export MLM members');
    } finally {
      setExportLoading(false);
    }
  };


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

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.position) queryParams.append('position', filters.position);
      if (filters.sponsor) queryParams.append('sponsor', filters.sponsor);
      if (filters.joinDate) queryParams.append('join_date', filters.joinDate);
      if (filters.is_active) queryParams.append('is_active', filters.is_active);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm-members/?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch MLM members');
      const data = await response.json();
      console.log('member info - ', data)
      setMembers(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load MLM members');
    } finally {
      setLoading(false);
    }
  };


  const verifyDocument = async (docId, status) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/${docId}/verify/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );
  
      if (!response.ok) throw new Error('Failed to verify document');
      
      toast.success('Document verification updated');
      fetchMemberDetails(selectedMember.member_id);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update document verification');
    }
  };
  
  const rejectDocument = async (docId) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/${docId}/verify/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            status: 'REJECTED',
            rejection_reason: reason
          })
        }
      );
  
      if (!response.ok) throw new Error('Failed to reject document');
      
      toast.success('Document rejected');
      fetchMemberDetails(selectedMember.member_id);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to reject document');
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
      console.log('member details - ', data)
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

  const verifyBankDetails = async (memberId, status) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm-members/${memberId}/verify-bank/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );

      if (!response.ok) throw new Error('Failed to verify bank details');
      
      toast.success('Bank details verification status updated');
      fetchMemberDetails(memberId);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update bank verification status');
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
      sponsor: '',
      joinDate: '',
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
          <UserGroupIcon className="h-6 w-6 mr-2" />
          MLM Member Management
        </h1>
        <button
          onClick={exportMembers}
          disabled={exportLoading}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {exportLoading ? (
            <span className="mr-2">Exporting...</span>
          ) : (
            <>
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Members
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filter Members
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
                placeholder="Search by name, email, member ID..."
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
            <input
              type="date"
              name="joinDate"
              value={filters.joinDate}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor</label>
            <input
              type="text"
              name="sponsor"
              value={filters.sponsor}
              onChange={handleFilterChange}
              placeholder="Sponsor member ID"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Members</div>
          <div className="text-2xl font-bold">{members.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Active Members</div>
          <div className="text-2xl font-bold">
            {members.filter(m => m.is_active).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Earnings</div>
          <div className="text-2xl font-bold">
            ₹{members.reduce((sum, m) => sum + (parseFloat(m.total_earnings) || 0), 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">New This Month</div>
          <div className="text-2xl font-bold">
            {members.filter(m => {
              const date = new Date(m.join_date);
              const now = new Date();
              return date.getMonth() === now.getMonth() && 
                     date.getFullYear() === now.getFullYear();
            }).length}
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
                  Sponsor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
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
                    No members found
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
                            {member.user.first_name} {member.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {member.member_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{member.user.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{member.user.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.position.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.sponsor ? member.sponsor.member_id : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{parseFloat(member.total_earnings).toFixed(2)}
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
              <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="profile" className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="flex items-center">
                    <BanknotesIcon className="h-4 w-4 mr-2" />
                    Financial
                  </TabsTrigger>
                  <TabsTrigger value="network" className="flex items-center">
                    <ArrowsRightLeftIcon className="h-4 w-4 mr-2" />
                    Network
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                    <TabsTrigger value="commissions" className="flex items-center">
                        <BanknotesIcon className="h-4 w-4 mr-2" />
                        Commissions
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-6">
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
                      
                      <div className="mt-4 flex space-x-3">
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

                      <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Sponsor Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {selectedMember.sponsor ? (
                          <div className="space-y-4">
                            <div>
                              <span className="block text-sm font-medium text-gray-700">Sponsor Name</span>
                              <span className="mt-1 block text-sm text-gray-900">
                                {selectedMember.sponsor.full_name}
                              </span>
                            </div>
                            <div>
                              <span className="block text-sm font-medium text-gray-700">Sponsor ID</span>
                              <span className="mt-1 block text-sm text-gray-900">
                                {selectedMember.sponsor.member_id}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No sponsor (Root member)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="financial" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Total Earnings</span>
                          <span className="mt-1 block text-xl font-semibold text-gray-900">
                            ₹{parseFloat(memberDetails.financial_details.total_earnings).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Total BP</span>
                          <span className="mt-1 block text-sm text-gray-900">
                            {memberDetails.financial_details.total_bp} points
                          </span>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Current Month Purchase</span>
                          <span className="mt-1 block text-sm text-gray-900">
                            ₹{parseFloat(memberDetails.financial_details.current_month_purchase).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Bank Details</h3>
                      {selectedMember.bank_details ? (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                          <div>
                            <span className="block text-sm font-medium text-gray-700">Account Holder</span>
                            <span className="mt-1 block text-sm text-gray-900">
                              {selectedMember.bank_details.account_holder_name}
                            </span>
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-gray-700">Bank Name</span>
                            <span className="mt-1 block text-sm text-gray-900">
                              {selectedMember.bank_details.bank_name}
                            </span>
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-gray-700">Account Number</span>
                            <span className="mt-1 block text-sm text-gray-900">
                              {selectedMember.bank_details.account_number}
                            </span>
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-gray-700">IFSC Code</span>
                            <span className="mt-1 block text-sm text-gray-900">
                              {selectedMember.bank_details.ifsc_code}
                            </span>
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-gray-700">Verification Status</span>
                            <div className="mt-1">
                              {selectedMember.bank_details.is_verified ? (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                  Pending Verification
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {!selectedMember.bank_details.is_verified && (
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={() => verifyBankDetails(selectedMember.member_id, 'VERIFIED')}
                                className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                              >
                                Verify Bank Details
                              </button>
                              <button
                                onClick={() => verifyBankDetails(selectedMember.member_id, 'REJECTED')}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-sm text-gray-500">No bank details provided</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Commissions</h3>
                      {memberDetails.recent_commissions && memberDetails.recent_commissions.length > 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {memberDetails.recent_commissions.map((commission, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(commission.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {commission.from_member_name}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    ₹{commission.amount.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    {commission.is_paid ? (
                                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        Paid
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-sm text-gray-500">No recent commissions</span>
                        </div>
                      )}

                      <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Monthly Earnings</h3>
                      {memberDetails.monthly_earnings && memberDetails.monthly_earnings.length > 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg h-60">
                          {/* You can implement a chart here if needed */}
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {memberDetails.monthly_earnings.map((entry, index) => (
                                  <tr key={index}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {entry.month}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      ₹{entry.amount.toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-sm text-gray-500">No monthly earnings data available</span>
                        </div>
                      )}
                    </div>
                    
                    <div >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Preview</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-sm font-medium text-gray-700">Current Month Estimate:</span>
                        <span className="text-sm font-semibold text-blue-600">
                            {memberDetails.financial_details.commission_preview?.current_month || '₹0.00'}
                        </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-sm font-medium text-gray-700">Last Month Earned:</span>
                        <span className="text-sm font-semibold text-green-600">
                            {memberDetails.financial_details.commission_preview?.last_month || '₹0.00'}
                        </span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Pending:</span>
                        <span className="text-sm font-semibold text-purple-600">
                            {memberDetails.financial_details.commission_preview?.pending || '₹0.00'}
                        </span>
                        </div>
                        <div className="text-center mt-2">
                        {/* <button
                            onClick={() => setActiveTab('commissions')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View Full Commission Details
                        </button> */}
                        </div>
                    </div>
                    </div>


                  </div>
                </TabsContent>
                
                <TabsContent value="network" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Network Overview</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Direct Referrals</span>
                          <span className="mt-1 block text-xl font-semibold text-gray-900">
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

                      <div className="mt-6">
                        <a 
                          href={`/auth/dashboard/networks/${selectedMember.member_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 inline-block"
                        >
                          View Full Network Structure
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Direct Downline</h3>
                      {memberDetails.network_details.direct_referrals > 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-4">
                            View the direct downline members in the network view
                          </p>
                          
                          <Link 
                            href={`/auth/dashboard/members?sponsor=${selectedMember.member_id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View All Direct Downline Members
                          </Link>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-sm text-gray-500">No direct downline members</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">KYC Documents</h3>
                      {selectedMember.kyc_documents && selectedMember.kyc_documents.length > 0 ? (
                        <div className="space-y-4">
                          {selectedMember.kyc_documents.map((doc, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="block text-sm font-medium text-gray-700">
                                    {doc.document_type_display}
                                  </span>
                                  <span className="block text-sm text-gray-500 mt-1">
                                    Document ID: {doc.document_number}
                                  </span>
                                  <span className="block text-sm text-gray-500 mt-1">
                                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <div>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    doc.status === 'VERIFIED' 
                                      ? 'bg-green-100 text-green-800' 
                                      : doc.status === 'REJECTED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {doc.status_display}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex space-x-2">
                                <a 
                                  href={doc.document_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                                >
                                  View Document
                                </a>
                                
                                {doc.status === 'PENDING' && (
                                  <>
                                    <button
                                      onClick={() => verifyDocument(doc.id, 'VERIFIED')}
                                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                                    >
                                      Verify
                                    </button>
                                    <button
                                      onClick={() => rejectDocument(doc.id)}
                                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                              
                              {doc.status === 'REJECTED' && doc.rejection_reason && (
                                <div className="mt-2">
                                  <span className="block text-sm font-medium text-red-700">Rejection Reason:</span>
                                  <span className="block text-sm text-gray-700">{doc.rejection_reason}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-sm text-gray-500">No KYC documents uploaded</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Other Documents</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm text-gray-500">No additional documents found</span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Notes & Remarks</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <textarea
                          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          rows={4}
                          placeholder="Add admin notes about this member..."
                        />
                        <button
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="commissions" className="space-y-6">
                    <MLMLiveCommissions memberId={selectedMember.member_id} />
                </TabsContent>

              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMLMMembersList;