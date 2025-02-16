'use client'
import React, { useState, useEffect } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { ChevronDown, ChevronUp, CloudDownload } from 'lucide-react';

const MLMOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
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
        date_range: filters.dateRange
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm/orders/?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      console.log('data - ' , data)
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching orders');
      console.error(error);
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
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
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
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
                    {/* Order Items */}
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        {/* {item.product.images && item.product.images[0] && (
                          <Image
                            src={item.product.images[0].image}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
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
                    <div className="mt-4 pt-4 border-t">
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
      )}
    </div>
  );
};

export default MLMOrderHistory;