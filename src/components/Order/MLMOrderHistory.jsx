
// 'use client'
// import React, { useState, useEffect } from 'react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronDown, ChevronUp, CloudDownload, Truck, Search } from 'lucide-react';
// import ReturnButton from './ReturnButton'; // Import the ReturnButton component

// const MLMOrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [filters, setFilters] = useState({
//     status: '',
//     dateRange: 'all'
//   });

//   const { token } = getTokens();

//   useEffect(() => {
//     fetchOrders();
//   }, [filters]);

//   const fetchOrders = async () => {
//     try {
//       const queryParams = new URLSearchParams({
//         status: filters.status,
//         date_range: filters.dateRange
//       });

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm/orders/?${queryParams}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) throw new Error('Failed to fetch orders');

//       const data = await response.json();
//       console.log('Order data:', data);
//       setOrders(data);
//       setLoading(false);
//     } catch (error) {
//       toast.error('Error fetching orders');
//       console.error(error);
//       setLoading(false);
//     }
//   };

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

//   const handleReturnSuccess = (orderData) => {
//     // Refresh orders after successful return
//     fetchOrders();
//     toast.success('Return initiated successfully!');
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'PENDING': 'bg-yellow-100 text-yellow-800',
//       'CONFIRMED': 'bg-green-100 text-green-800',
//       'SHIPPED': 'bg-blue-100 text-blue-800',
//       'DELIVERED': 'bg-green-100 text-green-800',
//       'CANCELLED': 'bg-red-100 text-red-800',
//       'RETURN_INITIATED': 'bg-orange-100 text-orange-800',
//       'RETURNED': 'bg-purple-100 text-purple-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-12 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">My Orders</h1>
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium mb-1">Status</label>
//           <select
//             className="w-full border rounded-lg p-2"
//             value={filters.status}
//             onChange={(e) => setFilters({...filters, status: e.target.value})}
//           >
//             <option value="">All Status</option>
//             <option value="PENDING">Pending</option>
//             <option value="CONFIRMED">Confirmed</option>
//             <option value="SHIPPED">Shipped</option>
//             <option value="DELIVERED">Delivered</option>
//             <option value="RETURN_INITIATED">Return Initiated</option>
//             <option value="RETURNED">Returned</option>
//             <option value="CANCELLED">Cancelled</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Date Range</label>
//           <select
//             className="w-full border rounded-lg p-2"
//             value={filters.dateRange}
//             onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
//           >
//             <option value="all">All Time</option>
//             <option value="today">Today</option>
//             <option value="week">This Week</option>
//             <option value="month">This Month</option>
//           </select>
//         </div>
//       </div>

//       {/* Orders List */}
//       {orders.length === 0 ? (
//         <div className="text-center py-10">
//           <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
//           <p className="text-gray-600">You haven't placed any orders yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <div key={order.id} className="border rounded-lg overflow-hidden">
//               <div className="bg-gray-50 p-4 flex justify-between items-center">
//                 <div>
//                   <p className="font-medium">Order #{order.order_number}</p>
//                   <p className="text-sm text-gray-600">
//                     {new Date(order.order_date).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <span 
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
//                   >
//                     {order.status}
//                   </span>
//                   <button
//                     onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     {expandedOrder === order.id ? (
//                       <ChevronUp className="h-5 w-5" />
//                     ) : (
//                       <ChevronDown className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {expandedOrder === order.id && (
//                 <div className="p-4 border-t">
//                   <div className="space-y-4">
//                     {/* Order Items */}
//                     {order.items.map((item) => (
//                       <div key={item.id} className="flex items-center space-x-4">
//                         {item.product?.images && item.product.images[0] && (
//                           <Image
//                             src={item.product.images[0].image}
//                             alt={item.product.name}
//                             width={64}
//                             height={64}
//                             className="rounded-md object-cover"
//                           />
//                         )}
//                         <div className="flex-1">
//                           <p className="font-medium">{item.product.name}</p>
//                           <p className="text-sm text-gray-600">
//                             Quantity: {item.quantity} × ₹{item.price}
//                           </p>
//                           {item.discount_amount > 0 && (
//                             <p className="text-sm text-green-600">
//                               Discount: ₹{item.discount_amount}
//                             </p>
//                           )}
//                         </div>
//                         <p className="font-medium">₹{item.final_price}</p>
//                       </div>
//                     ))}

//                     {/* Order Summary */}
//                     <div className="mt-4 pt-4 border-t">
//                       <div className="space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span>Subtotal:</span>
//                           <span>₹{order.total_amount}</span>
//                         </div>
//                         {order.discount_amount > 0 && (
//                           <div className="flex justify-between text-sm text-green-600">
//                             <span>Discount:</span>
//                             <span>-₹{order.discount_amount}</span>
//                           </div>
//                         )}
//                         <div className="flex justify-between text-sm">
//                           <span>GST:</span>
//                           <span>₹{(
//                             Number(order.final_amount) - 
//                             Number(order.total_amount) + 
//                             Number(order.discount_amount || 0)
//                           ).toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between font-medium">
//                           <span>Total:</span>
//                           <span>₹{order.final_amount}</span>
//                         </div>
//                         {order.total_bp > 0 && (
//                           <div className="flex justify-between text-sm text-blue-600">
//                             <span>BP Points Earned:</span>
//                             <span>{order.total_bp}</span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Shipping Info & Tracking */}
//                       <div className="mt-4 pt-4 border-t">
//                         <div className="flex flex-col gap-2">
//                           <p className="text-sm font-medium">Shipping Address:</p>
//                           <p className="text-sm text-gray-600">{order.shipping_address}</p>
                            
//                           {/* Display AWB and Tracking Options */}
//                           {order.shipments && order.shipments.length > 0 && (
//                             <div className="mt-2">
//                               <p className="text-sm font-medium">Tracking Information:</p>
//                               {order.shipments.map((shipment, idx) => (
//                                 <div key={idx} className="mt-1 flex flex-col">
//                                   <p className="text-sm text-gray-600">
//                                     AWB: <span className="font-medium">{shipment.awb_number}</span>
//                                     {shipment.courier_name && ` - ${shipment.courier_name}`}
//                                   </p>
//                                   <div className="flex gap-2 mt-1">
//                                     <Link 
//                                       href={`/order/tracking?order_number=${order.order_number}`}
//                                       className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
//                                     >
//                                       <Search className="h-4 w-4 mr-1" />
//                                       Track Order
//                                     </Link>
//                                     {shipment.tracking_url && (
//                                       <a 
//                                         href={shipment.tracking_url} 
//                                         target="_blank" 
//                                         rel="noopener noreferrer"
//                                         className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
//                                       >
//                                         <Truck className="h-4 w-4 mr-1" />
//                                         Track with Courier
//                                       </a>
//                                     )}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="mt-4 flex justify-between">
//                         <div className="flex space-x-4">
//                           <ReturnButton 
//                             order={order} 
//                             onReturnSuccess={handleReturnSuccess} 
//                           />
//                         </div>
//                         <button
//                           onClick={() => downloadInvoice(order.id)}
//                           className="flex items-center text-blue-600 hover:text-blue-700"
//                         >
//                           <CloudDownload className="h-5 w-5 mr-1" />
//                           Invoice
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MLMOrderHistory;


'use client'
import React, { useState, useEffect } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, CloudDownload, Truck, Search, RefreshCw, CreditCard } from 'lucide-react';
import ReturnButton from './ReturnButton'; // Import the ReturnButton component

const MLMOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);
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
      console.log('Order data:', data);
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

  const initiateReturn = (order) => {
    setSelectedOrder(order);
    setReturnModalOpen(true);
  };

  const submitReturn = async () => {
    if (!selectedOrder) return;

    setReturnLoading(true);
    try {
      // Find shipment info
      const shipment = selectedOrder.shipments && selectedOrder.shipments.length > 0 
        ? selectedOrder.shipments[0] 
        : null;
        
      if (!shipment || !shipment.awb_number) {
        throw new Error('No shipment information available for return');
      }
      
      // Prepare return shipment data
      const returnData = {
        order: selectedOrder.id,
        original_shipment_id: shipment.id,
        reason: document.getElementById('returnReason').value || 'Customer initiated return'
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipments/return/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(returnData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate return');
      }
      
      toast.success('Return initiated successfully');
      setReturnModalOpen(false);
      fetchOrders(); // Refresh orders list
      
    } catch (error) {
      toast.error(error.message || 'Failed to initiate return');
      console.error('Error initiating return:', error);
    } finally {
      setReturnLoading(false);
    }
  };

  // Check if return is available (within 7 days of delivery)
  const isReturnAvailable = (order) => {
    if (order.status !== 'DELIVERED') return false;
    
    // Find delivery date from shipments
    const deliveredShipment = order.shipments?.find(s => s.status === 'DELIVERED');
    if (!deliveredShipment) return false;
    
    // Check for status updates with DELIVERED status
    const deliveryUpdate = deliveredShipment.status_updates?.find(u => u.status === 'DELIVERED');
    if (!deliveryUpdate) return false;
    
    const deliveryDate = new Date(deliveryUpdate.timestamp);
    const now = new Date();
    const differenceInDays = Math.floor((now - deliveryDate) / (1000 * 60 * 60 * 24));
    
    return differenceInDays <= 7;
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'SHIPPED': 'bg-blue-100 text-blue-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'RETURN_INITIATED': 'bg-orange-100 text-orange-800',
      'RETURNED': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentTypeColor = (type) => {
    return type === 'Cod' || type === 'COD' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
  };

  // Function to safely get a product image
  const getProductImage = (item) => {
    // Check if it's the new format with images array
    if (item.product.images && item.product.images.length > 0) {
      // Try to find the feature image first
      const featureImage = item.product.images.find(img => img.is_feature);
      if (featureImage && featureImage.image) {
        return featureImage.image;
      }
      // Fallback to first image
      return item.product.images[0].image;
    }
    
    // Check for direct image property
    if (item.product.image) {
      return item.product.image;
    }
    
    // If we have a feature_image function result
    if (item.product.feature_image) {
      return item.product.feature_image;
    }
    
    return null;
  };

  // Calculate the breakdowns for an order
  const calculateOrderFinancials = (order) => {
    // Get values from the order with proper defaults
    const subtotal = Number(order.total_amount) || 0;
    const discount = Number(order.discount_amount) || 0;
    const total = Number(order.final_amount) || 0;
    
    // Get GST directly from item if available
    let gst = 0;
    if (order.items && order.items.length > 0) {
      // Sum up the GST from each item
      gst = order.items.reduce((sum, item) => {
        return sum + (Number(item.gst_amount) || 0);
      }, 0);
    }

    // Calculate shipping by difference - if not explicitly provided
    // We know: total = subtotal - discount + gst + shipping
    // So: shipping = total - subtotal + discount - gst
    const shipping = total - subtotal + discount - gst;
    
    return {
      subtotal,
      discount,
      shipping: Math.max(0, shipping), // Prevent negative shipping
      gst,
      total
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto">
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
            <option value="RETURN_INITIATED">Return Initiated</option>
            <option value="RETURNED">Returned</option>
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
          <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
          <a href="/shop" className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const financials = calculateOrderFinancials(order);
            
            return (
              <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.order_date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* Payment Type Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getPaymentTypeColor(order.payment_type || order.orderType)}`}>
                      <CreditCard className="h-3 w-3 mr-1" />
                      {order.payment_type || order.orderType || 'Online'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
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
                      {order.items && order.items.map((item) => {
                        // Get product image URL safely
                        const productImage = getProductImage(item);
                        
                        return (
                          <div key={item.id} className="flex items-center space-x-4">
                            {productImage && (
                              <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                <Image
                                  src={productImage}
                                  alt={item.product.name}
                                  width={64}
                                  height={64}
                                  className="rounded-md object-cover w-full h-full"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ₹{item.price}
                              </p>
                              {Number(item.discount_amount) > 0 && (
                                <p className="text-sm text-green-600">
                                  Discount: ₹{item.discount_amount}
                                </p>
                              )}
                            </div>
                            <p className="font-medium">₹{item.final_price}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>₹{financials.subtotal.toFixed(2)}</span>
                        </div>
                        {financials.discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount:</span>
                            <span>-₹{financials.discount.toFixed(2)}</span>
                          </div>
                        )}
                        {financials.gst > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>GST:</span>
                            <span>₹{financials.gst.toFixed(2)}</span>
                          </div>
                        )}
                        {financials.shipping > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Shipping Charges:</span>
                            <span>₹{financials.shipping.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>₹{financials.total.toFixed(2)}</span>
                        </div>
                        {order.total_bp > 0 && (
                          <div className="flex justify-between text-sm text-blue-600">
                            <span>BP Points Earned:</span>
                            <span>{order.total_bp}</span>
                          </div>
                        )}
                      </div>

                      {/* Shipment Information */}
                      {order.shipments && order.shipments.length > 0 ? (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Shipment Information:</p>
                          {order.shipments.map((shipment, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded mb-2">
                              <div className="flex flex-col">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                  <p className="text-sm"><span className="font-medium">AWB Number:</span> {shipment.awb_number || 'Pending'}</p>
                                  <p className="text-sm"><span className="font-medium">Courier:</span> {shipment.courier_name || 'Not assigned'}</p>
                                  <p className="text-sm"><span className="font-medium">Status:</span> {shipment.status || 'Processing'}</p>
                                  {shipment.shipping_charge > 0 && (
                                    <p className="text-sm"><span className="font-medium">Shipping Cost:</span> ₹{Number(shipment.shipping_charge).toFixed(2)}</p>
                                  )}
                                </div>
                                
                                {shipment.awb_number && (
                                  <div className="mt-2">
                                    <Link 
                                      href={`/OrderTracking?awb_number=${shipment.awb_number}`}
                                      className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium hover:bg-blue-200"
                                    >
                                      <Truck className="h-3 w-3 mr-1" />
                                      Track Package
                                    </Link>
                                  </div>
                                )}
                                
                                {/* Show recent tracking updates if available */}
                                {shipment.status_updates && shipment.status_updates.length > 0 && (
                                  <div className="mt-3 border-t border-gray-200 pt-2">
                                    <p className="text-xs font-medium mb-1">Recent Updates:</p>
                                    {shipment.status_updates.slice(0, 2).map((update, i) => (
                                      <div key={i} className="text-xs mb-1">
                                        <span className="text-gray-600">{new Date(update.timestamp).toLocaleString()}: </span>
                                        {update.status} {update.location ? `at ${update.location}` : ''}
                                      </div>
                                    ))}
                                    {shipment.status_updates.length > 2 && (
                                      <Link 
                                        href={`/OrderTracking?awb_number=${shipment.awb_number}`}
                                        className="text-xs text-blue-600 hover:underline"
                                      >
                                        View all updates
                                      </Link>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600">Shipment information will be available once your order is processed.</p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <p className="text-sm font-medium">Shipping Address:</p>
                          <p className="text-sm text-gray-600">{order.shipping_address}</p>
                        </div>
                        <div className="flex space-x-3">
                          {/* Return button - available for a week after delivery */}
                          {isReturnAvailable(order) && (
                            <button
                              onClick={() => initiateReturn(order)}
                              className="flex items-center text-orange-600 hover:text-orange-700"
                            >
                              <RefreshCw className="h-5 w-5 mr-1" />
                              Return
                            </button>
                          )}
                          
                          {/* Invoice button */}
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
            );
          })}
        </div>
      )}
      
      {/* Return Modal */}
      {returnModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Return Order #{selectedOrder.order_number}</h3>
            
            <div className="mb-4">
              <label htmlFor="returnReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Return
              </label>
              <select
                id="returnReason"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Defective product">Defective product</option>
                <option value="Wrong item received">Wrong item received</option>
                <option value="Not as described">Not as described</option>
                <option value="Change of mind">Change of mind</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800 mb-4">
              <p>Note: Please keep the product in its original packaging with all tags attached. Our team will contact you to arrange pickup.</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setReturnModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReturn}
                disabled={returnLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {returnLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Initiate Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLMOrderHistory;