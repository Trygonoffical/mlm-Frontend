// "use client";

// import { useEffect, useState } from 'react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import Image from 'next/image';
// import { ChevronDownIcon, ChevronUpIcon, DownloadIcon } from '@heroicons/react/24/outline';
// import { CloudDownloadIcon } from 'lucide-react';

// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedOrder, setExpandedOrder] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const { token } = getTokens();
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allorders/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch orders');
//       }

//       const data = await response.json();
//       setOrders(data);
//     } catch (error) {
//       toast.error('Failed to load orders');
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadInvoice = async (orderId) => {
//     try {
//       const { token } = getTokens();
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice/`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to download invoice');
//       }

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
//       console.error('Error downloading invoice:', error);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'PENDING': 'bg-yellow-100 text-yellow-800',
//       'CONFIRMED': 'bg-green-100 text-green-800',
//       'SHIPPED': 'bg-blue-100 text-blue-800',
//       'DELIVERED': 'bg-green-100 text-green-800',
//       'CANCELLED': 'bg-red-100 text-red-800'
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

//   if (orders.length === 0) {
//     return (
//       <div className="text-center py-10">
//         <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
//         <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
//         <a href="/shop" className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800">
//           Start Shopping
//         </a>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">My Orders</h2>
      
//       {orders.map((order) => (
//         <div key={order.id} className="border rounded-lg overflow-hidden">
//           <div className="bg-gray-50 p-4 flex justify-between items-center">
//             <div>
//               <p className="font-medium">Order #{order.order_number}</p>
//               <p className="text-sm text-gray-600">
//                 {new Date(order.order_date).toLocaleDateString()}
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                 {order.status}
//               </span>
//               <button
//                 onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 {expandedOrder === order.id ? (
//                   <ChevronUpIcon className="h-5 w-5" />
//                 ) : (
//                   <ChevronDownIcon className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {expandedOrder === order.id && (
//             <div className="p-4 border-t">
//               <div className="space-y-4">
//                 {order.items.map((item) => (
//                   <div key={item.id} className="flex items-center space-x-4">
//                     {item.product.image && (
//                       <Image
//                         src={item.product.image}
//                         alt={item.product.name}
//                         width={64}
//                         height={64}
//                         className="rounded-md"
//                       />
//                     )}
//                     <div className="flex-1">
//                       <p className="font-medium">{item.product.name}</p>
//                       <p className="text-sm text-gray-600">
//                         Quantity: {item.quantity} × ₹{item.price}
//                       </p>
//                       {item.discount_amount > 0 && (
//                         <p className="text-sm text-green-600">
//                           Discount: ₹{item.discount_amount}
//                         </p>
//                       )}
//                     </div>
//                     <p className="font-medium">₹{item.final_price}</p>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-4 pt-4 border-t">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Subtotal:</span>
//                     <span>₹{order.total_amount}</span>
//                   </div>
//                   {order.discount_amount > 0 && (
//                     <div className="flex justify-between text-sm text-green-600">
//                       <span>Discount:</span>
//                       <span>-₹{order.discount_amount}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between text-sm">
//                     <span>GST:</span>
//                     {/* <span>₹{(order.final_amount - order.total_amount + order.discount_amount).toFixed(2)}</span> */}
//                     <span>₹{(
//                                 Number(order.final_amount) - 
//                                 Number(order.total_amount) + 
//                                 Number(order.discount_amount || 0)
//                             ).toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between font-medium">
//                     <span>Total:</span>
//                     <span>₹{order.final_amount}</span>
//                   </div>
//                   {order.total_bp > 0 && (
//                     <div className="flex justify-between text-sm text-blue-600">
//                       <span>BP Points Earned:</span>
//                       <span>{order.total_bp}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-4 flex justify-between">
//                   <div>
//                     <p className="text-sm font-medium">Shipping Address:</p>
//                     <p className="text-sm text-gray-600">{order.shipping_address}</p>
//                   </div>
//                   <button
//                     onClick={() => downloadInvoice(order.id)}
//                     className="flex items-center text-blue-600 hover:text-blue-700"
//                   >
//                     <CloudDownloadIcon className="h-5 w-5 mr-1" />
//                     Invoice
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OrderHistory;

"use client";

import { useEffect, useState } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { CloudDownloadIcon, TruckIcon, RefreshCwIcon } from 'lucide-react';
import Link from 'next/link';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { token } = getTokens();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allorders/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const { token } = getTokens();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

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
      console.error('Error downloading invoice:', error);
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
      const { token } = getTokens();
      
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
        service_mode: 'RV', // Return shipment
        is_return: true,
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
      
      const data = await response.json();
      
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

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'SHIPPED': 'bg-blue-100 text-blue-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'RETURNED': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
        <a href="/shop" className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800">
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My Orders</h2>
      
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
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedOrder === order.id ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {expandedOrder === order.id && (
            <div className="p-4 border-t">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    {item.product.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="rounded-md"
                      />
                    )}
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
              </div>

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

                {/* Shipment Information */}
                {order.shipments && order.shipments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Shipment Information:</p>
                    {order.shipments.map((shipment, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded mb-2">
                        <p className="text-sm"><span className="font-medium">AWB Number:</span> {shipment.awb_number || 'N/A'}</p>
                        <p className="text-sm"><span className="font-medium">Courier:</span> {shipment.courier_name || 'N/A'}</p>
                        <p className="text-sm"><span className="font-medium">Status:</span> {shipment.status || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-sm font-medium">Shipping Address:</p>
                    <p className="text-sm text-gray-600">{order.shipping_address}</p>
                  </div>
                  <div className="flex space-x-3">
                    {/* Track button - available for shipped or delivered orders */}
                    {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                      <Link 
                        href={`/account/orders/track?order_number=${order.order_number}`}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <TruckIcon className="h-5 w-5 mr-1" />
                        Track
                      </Link>
                    )}
                    
                    {/* Return button - available for a week after delivery */}
                    {isReturnAvailable(order) && (
                      <button
                        onClick={() => initiateReturn(order)}
                        className="flex items-center text-orange-600 hover:text-orange-700"
                      >
                        <RefreshCwIcon className="h-5 w-5 mr-1" />
                        Return
                      </button>
                    )}
                    
                    {/* Invoice button */}
                    <button
                      onClick={() => downloadInvoice(order.id)}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <CloudDownloadIcon className="h-5 w-5 mr-1" />
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
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

export default OrderHistory;