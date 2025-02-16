'use client'
import React, { useState, useEffect } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { ChevronDown, ChevronUp, Search, CloudDownload, Filter } from 'lucide-react';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: 'all'
  });

  const { token } = getTokens();

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        date_range: filters.dateRange
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      console.log('data - ',data)
      setOrders(data);
    } catch (error) {
      toast.error('Error fetching orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update order status');

      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      toast.error('Error updating order status');
      console.error(error);
    }
  };

//   const downloadInvoice = async (orderId) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice/`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) throw new Error('Failed to download invoice');

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `invoice-${orderId}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       toast.error('Failed to download invoice');
//       console.error(error);
//     }
//   };

  const downloadInvoice = async (orderId) => {
      try {
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
  
        if (!response.ok) throw new Error('Failed to download invoice');
        
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        toast.error('Failed to download invoice');
        console.error(error);
      }
    };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'SHIPPED': 'bg-blue-100 text-blue-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <div className="relative">
            <input
              type="text"
              className="w-full border rounded-lg p-2 pl-8"
              placeholder="Search by order number or customer..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Order #{order.order_number}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.order_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedOrder === order.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="p-4 border-t">
                <div className="space-y-4">
                  {/* Customer Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Customer Details</h4>
                    <p>{order.user.first_name} {order.user.last_name}</p>
                    <p className="text-sm text-gray-600">{order.user.email}</p>
                    <p className="text-sm text-gray-600">{order.user.phone_number}</p>
                  </div>

                  {/* Order Items */}
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      {/* {item.product.images && item.product.images[0] && (
                        <img
                          src={item.product.images[0].image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )} */}
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{item.price}
                        </p>
                        {item.discount_amount > 0 && (
                          <p className="text-sm text-green-600">
                            Discount: ₹{item.discount_amount}
                          </p>
                        )}
                      </div>
                      <p className="font-medium">₹{item.final_price}</p>
                    </div>
                  ))}

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{order.total_amount}</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount:</span>
                          <span>-₹{order.discount_amount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>GST:</span>
                        <span>₹{(
                          Number(order.final_amount) - 
                          Number(order.total_amount) + 
                          Number(order.discount_amount || 0)
                        ).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>₹{order.final_amount}</span>
                      </div>
                      {order.total_bp > 0 && (
                        <div className="flex justify-between text-sm text-blue-600">
                          <span>BP Points Earned:</span>
                          <span>{order.total_bp}</span>
                        </div>
                      )}
                    </div>

                    {/* Shipping & Actions */}
                    <div className="mt-4 flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Shipping Address:</p>
                        <p className="text-sm text-gray-600">{order.shipping_address}</p>
                      </div>
                      <button
                        onClick={() => downloadInvoice(order.id)}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <CloudDownload className="h-5 w-5 mr-1" />
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderManagement;