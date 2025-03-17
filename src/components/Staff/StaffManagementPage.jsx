// pages/admin/staff/index.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  Edit, Delete, Add, Refresh, Check, Clear, 
  FilterList, Search, MoreVert 
} from '@mui/icons-material';

const StaffManagementPage = () => {
  const router = useRouter();
  const { token } = getTokens();
  const [staffMembers, setStaffMembers] = useState([]);
  const [staffRoles, setStaffRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  
  useEffect(() => {
    if (token) {
      fetchStaffMembers();
      fetchStaffRoles();
    }
  }, [token, page, roleFilter, statusFilter]);
  
  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (roleFilter) queryParams.append('role', roleFilter);
      if (statusFilter) queryParams.append('is_active', statusFilter === 'active' ? 'true' : 'false');
      queryParams.append('page', page.toString());
      queryParams.append('page_size', itemsPerPage.toString());
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/staff-members?${queryParams.toString()}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch staff members');
      }
      
      const data = await response.json();
      setStaffMembers(data.results || data);
      
      // If pagination info is available
      if (data.count) {
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      }
    } catch (err) {
      console.error('Error fetching staff members:', err);
      setError('Failed to load staff members');
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStaffRoles = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/staff-roles?is_active=true`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch staff roles');
      }
      
      const data = await response.json();
      setStaffRoles(data.results || data);
    } catch (err) {
      console.error('Error fetching staff roles:', err);
    }
  };
  
  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    fetchStaffMembers();
  };
  
  const handleFilterChange = (filter, value) => {
    setPage(1); // Reset to first page when changing filters
    if (filter === 'role') {
      setRoleFilter(value);
    } else if (filter === 'status') {
      setStatusFilter(value);
    }
  };
  
  const handleAddStaff = () => {
    router.push('/admin/staff/add');
  };
  
  const handleEditStaff = (id) => {
    router.push(`/admin/staff/edit/${id}`);
  };
  
  const handleDeleteStaff = async (id) => {
    if (confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/staff-members/${id}`, 
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to delete staff member');
        }
        
        toast.success('Staff member deleted successfully');
        fetchStaffMembers(); // Refresh list
      } catch (err) {
        console.error('Error deleting staff member:', err);
        toast.error('Failed to delete staff member');
      }
    }
  };
  
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/staff-members/${id}/toggle_status`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update staff member status');
      }
      
      toast.success(`Staff member ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchStaffMembers(); // Refresh list
    } catch (err) {
      console.error('Error toggling staff status:', err);
      toast.error('Failed to update staff member status');
    }
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
          <button 
            onClick={handleAddStaff}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
          >
            <Add className="mr-1" /> Add Staff Member
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email or ID..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search />
                </div>
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-2 text-blue-600 hover:text-blue-800"
                >
                  <Refresh />
                </button>
              </div>
            </div>
            
            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>
                {staffRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Staff List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-red-500">{error}</td>
                  </tr>
                ) : staffMembers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No staff members found</td>
                  </tr>
                ) : (
                  staffMembers.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                            {staff.full_name ? staff.full_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{staff.full_name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{staff.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {staff.role_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {staff.department || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          staff.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {staff.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleToggleStatus(staff.id, staff.is_active)}
                            className={`text-sm p-1 rounded-full ${
                              staff.is_active ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}
                            title={staff.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {staff.is_active ? <Clear fontSize="small" /> : <Check fontSize="small" />}
                          </button>
                          <button
                            onClick={() => handleEditStaff(staff.id)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full bg-indigo-100"
                            title="Edit"
                          >
                            <Edit fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full bg-red-100"
                            title="Delete"
                          >
                            <Delete fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing page {page} of {totalPages}
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white mr-3 ${
                    page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(page + 1, totalPages))}
                  disabled={page >= totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${
                    page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StaffManagementPage;