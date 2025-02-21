'use client'

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const AdminCustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    dateJoined: '',
    hasOrders: ''
  });
  const { token } = getTokens();

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.dateJoined) queryParams.append('date_joined', filters.dateJoined);
      if (filters.hasOrders) queryParams.append('has_orders', filters.hasOrders);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${customerId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch customer details');
      const data = await response.json();
      setSelectedCustomer(data);
      
      // Fetch customer orders
      const ordersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${customerId}/orders/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setCustomerOrders(ordersData);
      }
      
      setShowDetails(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load customer details');
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
      dateJoined: '',
      hasOrders: ''
    });
  };

  if (loading && !customers.length) {
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
          <UserCircleIcon className="h-6 w-6 mr-2" />
          Customer Management
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filter Customers
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
                placeholder="Search by name, email, phone..."
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
            <input
              type="date"
              name="dateJoined"
              value={filters.dateJoined}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Has Orders</label>
            <select
              name="hasOrders"
              value={filters.hasOrders}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Customers</option>
              <option value="true">With Orders</option>
              <option value="false">Without Orders</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Customers</div>
          <div className="text-2xl font-bold">{customers.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">With Orders</div>
          <div className="text-2xl font-bold">
            {customers.filter(c => c.order_count > 0).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">New This Month</div>
          <div className="text-2xl font-bold">
            {customers.filter(c => {
              const date = new Date(c.date_joined);
              const now = new Date();
              return date.getMonth() === now.getMonth() && 
                     date.getFullYear() === now.getFullYear();
            }).length}
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.first_name} {customer.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {customer.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.date_joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.order_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => fetchCustomerDetails(customer.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Customer Details</DialogTitle>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Full Name</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {selectedCustomer.first_name} {selectedCustomer.last_name}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Email</span>
                      <span className="mt-1 block text-sm text-gray-900">{selectedCustomer.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Phone</span>
                      <span className="mt-1 block text-sm text-gray-900">{selectedCustomer.phone_number}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Date Joined</span>
                      <span className="mt-1 block text-sm text-gray-900">
                        {new Date(selectedCustomer.date_joined).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Addresses</h3>
                  {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      {selectedCustomer.addresses.map((address, index) => (
                        <div key={address.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">{address.name}</span>
                            {address.is_active && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="block text-sm text-gray-900">{address.street_address}</span>
                          <span className="block text-sm text-gray-900">
                            {address.city}, {address.state} {address.postal_code}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="text-sm text-gray-500">No addresses found</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order History</h3>
                {customerOrders && customerOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {customerOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.order_number}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.order_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {/* ₹{order.final_amount.toFixed(2)} */}
                              ₹{parseFloat(order.final_amount).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-500">No orders found</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomerList;