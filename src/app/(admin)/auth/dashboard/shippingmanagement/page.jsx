// components/admin/ShippingManagement.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';
import { 
  TruckIcon, 
  BuildingStorefrontIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

// Tab components
const PickupAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { token } = getTokens();
// Fetch all pickup addresses
const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/pickup-addresses/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch pickup addresses');
      
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load pickup addresses');
    } finally {
      setLoading(false);
    }
  };

  // Set address as default
  const setAsDefault = async (addressId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/pickup-addresses/${addressId}/set_default/`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to set default address');
      
      toast.success('Default pickup address updated');
      fetchAddresses();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update default address');
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/pickup-addresses/${addressId}/`, 
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to delete address');
      
      toast.success('Pickup address deleted');
      fetchAddresses();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete address');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold flex items-center">
          <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-blue-500" />
          Pickup Addresses
        </h2>
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowAddModal(true);
          }}
          className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Address
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center text-gray-500 my-8">
          No pickup addresses found. Add one to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
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
              {addresses.map((address) => (
                <tr key={address.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {address.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {address.address_id || 'No external ID'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {address.address_line1}
                    </div>
                    {address.address_line2 && (
                      <div className="text-sm text-gray-500">
                        {address.address_line2}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {address.city}, {address.state}, {address.pincode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {address.contact_person}
                    </div>
                    <div className="text-sm text-gray-500">
                      {address.phone}
                    </div>
                    {address.email && (
                      <div className="text-xs text-gray-500">
                        {address.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {address.is_default ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => setAsDefault(address.id)}
                        className="text-xs text-blue-600 hover:text-blue-900"
                      >
                        Set as Default
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setShowAddModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteAddress(address.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddressModal
          address={editingAddress}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchAddresses();
          }}
        />
      )}
    </div>
  );
};

// Shipments management component
const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = getTokens();

  // Fetch all shipments
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/shipments/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch shipments');
      
      const data = await response.json();
      setShipments(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch unshipped orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/?status=CONFIRMED`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      // Filter out orders that already have shipments
      const shipmentOrderIds = shipments.map(s => s.order);
      const unshippedOrders = data.filter(order => !shipmentOrderIds.includes(order.id));
      setOrders(unshippedOrders);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load orders');
    }
  };

  // Track shipment
  const trackShipment = async (shipmentId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/shipments/${shipmentId}/track/`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to track shipment');
      
      const data = await response.json();
      toast.success(`Shipment status: ${data.status}`);
      fetchShipments();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to track shipment');
    }
  };

  // Cancel shipment
  const cancelShipment = async (shipmentId) => {
    try {
      const reason = prompt("Please enter cancellation reason:");
      if (!reason) return;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/shipments/${shipmentId}/cancel/`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason })
        }
      );
      
      if (!response.ok) throw new Error('Failed to cancel shipment');
      
      toast.success('Shipment cancelled successfully');
      fetchShipments();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to cancel shipment');
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    if (shipments.length > 0) {
      fetchOrders();
    }
  }, [shipments]);

  // Filter shipments based on status
  const filteredShipments = filter === 'all' 
    ? shipments 
    : shipments.filter(s => s.status === filter);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold flex items-center">
          <TruckIcon className="h-5 w-5 mr-2 text-blue-500" />
          Shipments
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          New Shipment
        </button>
      </div>

      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'PENDING' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('BOOKED')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'BOOKED' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Booked
          </button>
          <button
            onClick={() => setFilter('IN_TRANSIT')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'IN_TRANSIT' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Transit
          </button>
          <button
            onClick={() => setFilter('DELIVERED')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'DELIVERED' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="text-center text-gray-500 my-8">
          No shipments found. Create one to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courier
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
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{shipment.order.order_number}
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(shipment.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {shipment.awb_number || 'Not assigned'}
                    </div>
                    {shipment.tracking_url && (
                      <a 
                        href={shipment.tracking_url} 
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-xs text-blue-600 hover:text-blue-900"
                      >
                        Track on courier site
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {shipment.courier_name || 'Not assigned'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {shipment.service_type === 'EXP' ? 'Express' : 'Surface'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      shipment.status === 'DELIVERED' 
                        ? 'bg-green-100 text-green-800'
                        : shipment.status === 'IN_TRANSIT' 
                          ? 'bg-blue-100 text-blue-800'
                          : shipment.status === 'BOOKED' 
                            ? 'bg-purple-100 text-purple-800'
                            : shipment.status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : shipment.status === 'CANCELLED' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                    }`}>
                      {shipment.status_display}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => trackShipment(shipment.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Update Status
                    </button>
                    {shipment.status !== 'DELIVERED' && shipment.status !== 'CANCELLED' && (
                      <button
                        onClick={() => cancelShipment(shipment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Shipment Modal */}
      {showModal && (
        <ShipmentModal
          orders={orders}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchShipments();
          }}
        />
      )}
    </div>
  );
};

// AddressModal component (complete code)
const AddressModal = ({ address, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: '',
      contact_person: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      phone: '',
      alternate_phone: '',
      email: '',
      landmark: '',
      address_type: 'Office',
      is_default: false,
      ...address
    });
    const [loading, setLoading] = useState(false);
    const { token } = getTokens();
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const url = address 
          ? `${process.env.NEXT_PUBLIC_API_URL}/shipping/pickup-addresses/${address.id}/`
          : `${process.env.NEXT_PUBLIC_API_URL}/shipping/pickup-addresses/`;
        
        const method = address ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Failed to save address');
        
        toast.success(`Pickup address ${address ? 'updated' : 'created'} successfully`);
        onSave();
      } catch (error) {
        console.error('Error:', error);
        toast.error(`Failed to ${address ? 'update' : 'create'} pickup address`);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={onClose}
                type="button"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {address ? 'Edit Pickup Address' : 'Add Pickup Address'}
                </h3>
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          name="contact_person"
                          value={formData.contact_person}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          name="address_line1"
                          value={formData.address_line1}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          name="address_line2"
                          value={formData.address_line2}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Alternate Phone
                        </label>
                        <input
                          type="text"
                          name="alternate_phone"
                          value={formData.alternate_phone}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Landmark
                        </label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Address Type
                        </label>
                        <select
                          name="address_type"
                          value={formData.address_type}
                          onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        >
                          <option value="Office">Office</option>
                          <option value="Home">Home</option>
                          <option value="Warehouse">Warehouse</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_default"
                            checked={formData.is_default}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Set as Default Pickup Address
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // ShipmentModal component
const ShipmentModal = ({ orders, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      order: '',
      pickup_address: '',
      service_type: 'SF',
      courier_name: 'DTC',
      weight: 1,
      length: 10,
      width: 10,
      height: 10,
      is_cod: false,
      cod_amount: 0
    });
    const [pickupAddresses, setPickupAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const { token } = getTokens();
  
    // Fetch pickup addresses
    const fetchPickupAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shipping/pickup-addresses/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch pickup addresses');
        
        const data = await response.json();
        setPickupAddresses(data);
        
        // Set default pickup address if available
        const defaultAddress = data.find(addr => addr.is_default);
        if (defaultAddress) {
          setFormData(prev => ({
            ...prev,
            pickup_address: defaultAddress.id
          }));
        } else if (data.length > 0) {
          setFormData(prev => ({
            ...prev,
            pickup_address: data[0].id
          }));
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load pickup addresses');
      } finally {
        setLoadingAddresses(false);
      }
    };
  
    useEffect(() => {
      fetchPickupAddresses();
    }, []);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      if (name === 'is_cod') {
        setFormData(prev => ({
          ...prev,
          [name]: checked,
          cod_amount: checked ? prev.cod_amount : 0
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'number' ? parseFloat(value) : value
        }));
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shipping/shipments/`, 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create shipment');
        }
        
        toast.success('Shipment created successfully');
        onSave();
      } catch (error) {
        console.error('Error:', error);
        toast.error(`Failed to create shipment: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={onClose}
                type="button"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create New Shipment
                </h3>
                <div className="mt-4">
                  {loadingAddresses ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Select Order
                          </label>
                          <select
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">-- Select Order --</option>
                            {orders.map(order => (
                              <option key={order.id} value={order.id}>
                                #{order.order_number} - {new Date(order.order_date).toLocaleDateString()}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Pickup Address
                          </label>
                          <select
                            name="pickup_address"
                            value={formData.pickup_address}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">-- Select Pickup Address --</option>
                            {pickupAddresses.map(address => (
                              <option key={address.id} value={address.id}>
                                {address.name} ({address.is_default ? 'Default' : ''})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Service Type
                            </label>
                            <select
                              name="service_type"
                              value={formData.service_type}
                              onChange={handleChange}
                              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            >
                              <option value="SF">Surface</option>
                              <option value="EXP">Express</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Courier
                            </label>
                            <select
                              name="courier_name"
                              value={formData.courier_name}
                              onChange={handleChange}
                              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            >
                              <option value="DTC">DTDC</option>
                              <option value="DLV">Delhivery</option>
                              <option value="SFX">Shadowfax</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              step="0.1"
                              min="0.1"
                              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Dimensions (cm)
                            </label>
                            <div className="flex space-x-2 mt-1">
                              <input
                                type="number"
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                                placeholder="L"
                                className="p-2 block w-full border border-gray-300 rounded-md"
                                required
                              />
                              <input
                                type="number"
                                name="width"
                                value={formData.width}
                                onChange={handleChange}
                                placeholder="W"
                                className="p-2 block w-full border border-gray-300 rounded-md"
                                required
                              />
                              <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="H"
                                className="p-2 block w-full border border-gray-300 rounded-md"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="is_cod"
                              checked={formData.is_cod}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              Cash on Delivery (COD)
                            </label>
                          </div>
                          {formData.is_cod && (
                            <div className="mt-2">
                              <label className="block text-sm font-medium text-gray-700">
                                COD Amount
                              </label>
                              <input
                                type="number"
                                name="cod_amount"
                                value={formData.cod_amount}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {loading ? 'Creating...' : 'Create Shipment'}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Main Shipping Management Component
  const ShippingManagement = () => {
    const [activeTab, setActiveTab] = useState('pickup');
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shipping Management</h1>
        
        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('pickup')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'pickup'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BuildingStorefrontIcon className="h-5 w-5 inline-block mr-2" />
                Pickup Addresses
              </button>
              <button
                onClick={() => setActiveTab('shipments')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'shipments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TruckIcon className="h-5 w-5 inline-block mr-2" />
                Shipments
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'pickup' ? <PickupAddresses /> : <Shipments />}
      </div>
    );
  };
  
  export default ShippingManagement;