"use client"
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Check, Truck, Package, AlertCircle, Clock, ShoppingBag,
  Settings, RefreshCw, Search, ChevronDown, MapPin
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockStatusData = [
  { name: 'Pending', value: 8 },
  { name: 'Booked', value: 15 },
  { name: 'In Transit', value: 23 },
  { name: 'Delivered', value: 45 },
  { name: 'Cancelled', value: 3 },
];

const mockShipments = [
  { id: 1, awb: 'AWB1234567', order: 'ORD123456', courier: 'DTDC', status: 'In Transit', date: '2023-08-15' },
  { id: 2, awb: 'AWB7654321', order: 'ORD654321', courier: 'Delhivery', status: 'Delivered', date: '2023-08-12' },
  { id: 3, awb: 'AWB8765432', order: 'ORD876543', courier: 'Shadowfax', status: 'Pending', date: '2023-08-17' },
  { id: 4, awb: 'AWB2345678', order: 'ORD234567', courier: 'DTDC', status: 'Booked', date: '2023-08-16' },
  { id: 5, awb: 'AWB3456789', order: 'ORD345678', courier: 'Delhivery', status: 'Delivered', date: '2023-08-10' },
];

const mockPendingOrders = [
  { id: 1, order: 'ORD987654', customer: 'John Doe', date: '2023-08-17', amount: 2500 },
  { id: 2, order: 'ORD876543', customer: 'Jane Smith', date: '2023-08-16', amount: 3200 },
  { id: 3, order: 'ORD765432', customer: 'Alice Johnson', date: '2023-08-15', amount: 1800 },
];

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Booked': 'bg-blue-100 text-blue-800',
  'In Transit': 'bg-purple-100 text-purple-800',
  'Out for Delivery': 'bg-indigo-100 text-indigo-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Failed Delivery': 'bg-orange-100 text-orange-800',
  'Returned': 'bg-red-100 text-red-800',
  'Cancelled': 'bg-gray-100 text-gray-800',
};

const ShippingDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courierFilter, setCourierFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

    
  // State for data
  const [dashboardData, setDashboardData] = useState({
    status_stats: {},
    courier_stats: {},
    recent_shipments: [],
    pending_orders: []
  });
  const [shipments, setShipments] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [configData, setConfigData] = useState({
    quixgo_email: '',
    quixgo_password: '',
    quixgo_firstName: '',
    quixgo_lastName: '',
    quixgo_mobile: '',
    default_courier: 'DTC',
    default_service_type: 'SF',
    quixgo_api_base_url: 'https://api.quixgo.com/clientApi'
  });
  const [pickupAddresses, setPickupAddresses] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    dashboard: false,
    shipments: false,
    pendingOrders: false,
    config: false
  });
  
  // Notifications
  const [notification, setNotification] = useState(null);

  // Load initial data
  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardData();
    } else if (activeTab === 'shipments') {
      loadShipments();
    } else if (activeTab === 'pending') {
      loadPendingOrders();
    } else if (activeTab === 'settings') {
      loadConfigData();
      loadPickupAddresses();
    }
  }, [activeTab]);
  
  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(prev => ({ ...prev, dashboard: true }));
    const data = await fetchShippingStats();
    if (data && data.success) {
      setDashboardData(data);
    }
    setLoading(prev => ({ ...prev, dashboard: false }));
  };

  // Load shipments based on filters
  const loadShipments = async () => {
    setLoading(prev => ({ ...prev, shipments: true }));
    const data = await fetchShipments(statusFilter, courierFilter, searchQuery);
    if (data) {
      setShipments(data.results || []);
    }
    setLoading(prev => ({ ...prev, shipments: false }));
  };

  // Load pending orders
  const loadPendingOrders = async () => {
    setLoading(prev => ({ ...prev, pendingOrders: true }));
    const data = await fetchPendingOrders(searchQuery);
    if (data) {
      setPendingOrders(data);
    }
    setLoading(prev => ({ ...prev, pendingOrders: false }));
  };

  // Load config data
  const loadConfigData = async () => {
    setLoading(prev => ({ ...prev, config: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/config/`);
      if (response.ok) {
        const data = await response.json();
        setConfigData(data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    setLoading(prev => ({ ...prev, config: false }));
  };

  // Load pickup addresses
  const loadPickupAddresses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pickup-addresses/`);
      if (response.ok) {
        const data = await response.json();
        setPickupAddresses(data);
      }
    } catch (error) {
      console.error('Error loading pickup addresses:', error);
    }
  };

  // Refresh data based on active tab
  const refreshData = () => {
    setRefreshing(true);
    
    if (activeTab === 'dashboard') {
      loadDashboardData();
    } else if (activeTab === 'shipments') {
      loadShipments();
    } else if (activeTab === 'pending') {
      loadPendingOrders();
    }
    
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  // Handle search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'shipments') {
        loadShipments();
      } else if (activeTab === 'pending') {
        loadPendingOrders();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle filter changes
  useEffect(() => {
    if (activeTab === 'shipments') {
      loadShipments();
    }
  }, [statusFilter, courierFilter]);

  // Handle config form submission
  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    const response = await saveShippingConfig(configData);
    
    if (response.success) {
      setNotification({
        type: 'success',
        message: 'Configuration saved successfully'
      });
    } else {
      setNotification({
        type: 'error',
        message: response.message || 'Failed to save configuration'
      });
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Handle test connection
  const handleTestConnection = async () => {
    const credentials = {
      quixgo_email: configData.quixgo_email,
      quixgo_password: configData.quixgo_password
    };
    
    const response = await testConnection(credentials);
    
    if (response.success) {
      setNotification({
        type: 'success',
        message: 'Connection successful'
      });
    } else {
      setNotification({
        type: 'error',
        message: response.error || 'Connection failed'
      });
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Handle create shipment
  const handleCreateShipment = async (orderId) => {
    // Get default pickup address
    const defaultAddress = pickupAddresses.find(addr => addr.is_default) || pickupAddresses[0];
    
    if (!defaultAddress) {
      setNotification({
        type: 'error',
        message: 'No pickup address available. Please create one first.'
      });
      return;
    }
    
    const shipmentData = {
      order: orderId,
      pickup_address: defaultAddress.id,
      weight: 1.0,
      length: 10.0,
      width: 10.0,
      height: 10.0,
      service_type: configData.default_service_type,
      is_cod: false
    };
    
    const response = await createShipment(shipmentData);
    
    if (response.success) {
      setNotification({
        type: 'success',
        message: 'Shipment created successfully'
      });
      refreshData();
    } else {
      setNotification({
        type: 'error',
        message: response.message || 'Failed to create shipment'
      });
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Handle track shipment
  const handleTrackShipment = async (shipmentId) => {
    const response = await trackShipment(shipmentId);
    
    if (response.success) {
      setNotification({
        type: 'success',
        message: 'Shipment tracked successfully'
      });
      refreshData();
    } else {
      setNotification({
        type: 'error',
        message: response.message || 'Failed to track shipment'
      });
    }
  };

  // Handle cancel shipment
  const handleCancelShipment = async (shipmentId) => {
    if (!window.confirm('Are you sure you want to cancel this shipment?')) {
      return;
    }
    
    const reason = prompt('Please enter a reason for cancellation:', 'Order cancelled by customer');
    
    if (reason) {
      const response = await cancelShipment(shipmentId, reason);
      
      if (response.success) {
        setNotification({
          type: 'success',
          message: 'Shipment cancelled successfully'
        });
        refreshData();
      } else {
        setNotification({
          type: 'error',
          message: response.message || 'Failed to cancel shipment'
        });
      }
    }
  };

  // Helper to convert status object to array
  const statusesToArray = (statusObj) => {
    return Object.keys(statusObj).map(key => ({
      name: key,
      value: statusObj[key]
    }));
  };

  // Helper to convert courier object to array
  const couriersToArray = (courierObj) => {
    return Object.keys(courierObj).map(key => ({
      name: key || 'Unknown',
      value: courierObj[key]
    }));
  };


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;  // Adjust based on your API prefix

const fetchShippingStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipping/dashboard/`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching shipping stats:', error);
    return null;
  }
};

const fetchShipments = async (status = null, courier = null, search = '') => {
  let queryParams = new URLSearchParams();
  if (status && status !== 'All') queryParams.append('status', status);
  if (courier && courier !== 'All') queryParams.append('courier', courier);
  if (search) queryParams.append('search', search);
  
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch shipments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return { results: [] };
  }
};

const fetchPendingOrders = async (search = '') => {
  let queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  queryParams.append('status', 'CONFIRMED');
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders/?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch pending orders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    return [];
  }
};

const saveShippingConfig = async (configData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error saving shipping config:', error);
    return { success: false, message: 'Network error' };
  }
};

const testConnection = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/test/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error testing connection:', error);
    return { success: false, message: 'Network error' };
  }
};

const createShipment = async (shipmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error creating shipment:', error);
    return { success: false, message: 'Network error' };
  }
};

const trackShipment = async (shipmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/track/`, {
      method: 'POST'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return { success: false, message: 'Network error' };
  }
};

const cancelShipment = async (shipmentId, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/cancel/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error cancelling shipment:', error);
    return { success: false, message: 'Network error' };
  }
};

const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pickup-addresses/${addressId}/set_default/`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Default address updated successfully'
        });
        loadPickupAddresses();
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to update default address'
        });
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      setNotification({
        type: 'error',
        message: 'Error setting default address'
      });
    }
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/pickup-addresses/${addressId}/`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Address deleted successfully'
        });
        loadPickupAddresses();
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to delete address'
        });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setNotification({
        type: 'error',
        message: 'Error deleting address'
      });
    }
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };


  // Add state for the address modal
const [addressModal, setAddressModal] = useState({
    isOpen: false,
    isEdit: false,
    addressData: {
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
      address_type: 'Office'
    },
    addressId: null
  });
  
  // Function to handle the address form submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    const { isEdit, addressData, addressId } = addressModal;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit 
      ? `${API_BASE_URL}/pickup-addresses/${addressId}/` 
      : `${API_BASE_URL}/pickup-addresses/`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: `Address ${isEdit ? 'updated' : 'created'} successfully`
        });
        loadPickupAddresses();
        setAddressModal({...addressModal, isOpen: false});
      } else {
        setNotification({
          type: 'error',
          message: result.message || `Failed to ${isEdit ? 'update' : 'create'} address`
        });
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} address:`, error);
      setNotification({
        type: 'error',
        message: `Error ${isEdit ? 'updating' : 'creating'} address`
      });
    }
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Function to open the edit modal
  const handleEditAddress = (address) => {
    setAddressModal({
      isOpen: true,
      isEdit: true,
      addressData: {
        name: address.name,
        contact_person: address.contact_person,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
        phone: address.phone,
        alternate_phone: address.alternate_phone || '',
        email: address.email || '',
        landmark: address.landmark || '',
        address_type: address.address_type
      },
      addressId: address.id
    });
  };


  


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipping Dashboard</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={refreshData}
            className="flex items-center bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center bg-indigo-50 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-100">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-6">
          <button
            className={`py-3 px-1 ${activeTab === 'dashboard' ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`py-3 px-1 ${activeTab === 'shipments' ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('shipments')}
          >
            Shipments
          </button>
          <button
            className={`py-3 px-1 ${activeTab === 'pending' ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Orders
          </button>
          <button
            className={`py-3 px-1 ${activeTab === 'settings' ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('settings')}
          >
            Configuration
          </button>
        </nav>
      </div>

        {activeTab === 'dashboard' && (
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Shipments"
                    value={Object.values(dashboardData.status_stats).reduce((a, b) => a + b, 0).toString()}
                    icon={<Package className="w-6 h-6 text-indigo-600" />}
                    change={"+10%"}
                    changeType="positive"
                />
                <StatCard
                    title="Pending Shipping"
                    value={(dashboardData.status_stats.PENDING || 0).toString()}
                    icon={<Clock className="w-6 h-6 text-yellow-500" />}
                    change={"-5%"}
                    changeType="positive"
                />
                <StatCard
                    title="In Transit"
                    value={(dashboardData.status_stats.IN_TRANSIT || 0).toString()}
                    icon={<Truck className="w-6 h-6 text-blue-500" />}
                    change={"+15%"}
                    changeType="neutral"
                />
                <StatCard
                    title="Delivered"
                    value={(dashboardData.status_stats.DELIVERED || 0).toString()}
                    icon={<Check className="w-6 h-6 text-green-500" />}
                    change={"+30%"}
                    changeType="positive"
                />
                </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Shipment Status</h3>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusesToArray(dashboardData.status_stats)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Courier Distribution</h3>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={couriersToArray(dashboardData.courier_stats)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
        </div>

            {/* Recent Shipments */}
                <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Recent Shipments</h3>
                    <button 
                    className="text-indigo-600 hover:text-indigo-800"
                    onClick={() => setActiveTab('shipments')}
                    >
                    View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AWB</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.recent_shipments.slice(0, 5).map((shipment) => (
                        <tr key={shipment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shipment.awb_number || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.order_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.courier || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[shipment.status] || 'bg-gray-100 text-gray-800'}`}>
                                {shipment.status}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(shipment.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                onClick={() => handleTrackShipment(shipment.id)}
                            >
                                Track
                            </button>
                            <button 
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => {/* Show details modal */}}
                            >
                                Details
                            </button>
                            </td>
                        </tr>
                        ))}
                        
                        {dashboardData.recent_shipments.length === 0 && (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                            No recent shipments found.
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
        )}

        {activeTab === 'shipments' && (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search by AWB, order number, or customer"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                <div className="flex flex-row gap-2">
                <div className="relative">
                    <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    >
                    <option value="All">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="BOOKED">Booked</option>
                    <option value="PICKED_UP">Picked Up</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="FAILED_DELIVERY">Failed Delivery</option>
                    <option value="RETURNED">Returned</option>
                    <option value="CANCELLED">Cancelled</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <div className="relative">
                    <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={courierFilter}
                    onChange={(e) => setCourierFilter(e.target.value)}
                    >
                    <option value="All">All Couriers</option>
                    <option value="DTC">DTDC</option>
                    <option value="DLV">Delhivery</option>
                    <option value="SFX">Shadowfax</option>
                    <option value="XBS">XpressBees</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
                </div>
            </div>
            </div>
            
            {loading.shipments ? (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-500">Loading shipments...</p>
            </div>
            ) : (
            <>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AWB</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {shipments.map((shipment) => (
                        <tr key={shipment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shipment.awb_number || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.order?.order_number || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.courier_name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[shipment.status] || 'bg-gray-100 text-gray-800'}`}>
                            {shipment.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(shipment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {shipment.status !== 'CANCELLED' && shipment.status !== 'DELIVERED' && (
                            <>
                                <button 
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                onClick={() => handleTrackShipment(shipment.id)}
                                >
                                Track
                                </button>
                                {shipment.status !== 'RETURNED' && (
                                <button 
                                    className="text-red-600 hover:text-red-900 mr-3"
                                    onClick={() => handleCancelShipment(shipment.id)}
                                >
                                    Cancel
                                </button>
                                )}
                            </>
                            )}
                            <button 
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => {/* Show details modal */}}
                            >
                            Details
                            </button>
                        </td>
                        </tr>
                    ))}
                    
                    {shipments.length === 0 && (
                        <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                            No shipments found. Try adjusting your filters.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
                
                {/* Pagination - can be updated to use real pagination from API */}
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{shipments.length}</span> of <span className="font-medium">{shipments.length}</span> results
                    </p>
                    </div>
                    {/* Add pagination controls if needed */}
                </div>
                </div>
            </>
            )}
        </div>
        )}

        {activeTab === 'pending' && (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Pending Orders Ready for Shipping</h3>
                <div className="flex items-center">
                <div className="relative mr-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search orders"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    onClick={() => {/* Ship all selected orders */}}
                >
                    Ship Selected
                </button>
                </div>
            </div>
            </div>
            
            {loading.pendingOrders ? (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-500">Loading pending orders...</p>
            </div>
            ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.pending_orders.map((order) => (
                    <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.order_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                            className="bg-green-50 text-green-600 px-3 py-1 rounded-md hover:bg-green-100"
                            onClick={() => handleCreateShipment(order.id)}
                        >
                            Ship Now
                        </button>
                        </td>
                    </tr>
                    ))}
                    
                    {dashboardData.pending_orders.length === 0 && (
                    <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No pending orders found.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            )}
        </div>
        )}

        {activeTab === 'settings' && (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">QuixGo API Configuration</h3>
            
            {notification && (
                <div className={`mb-4 p-3 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {notification.message}
                </div>
            )}
            
            <form className="space-y-4" onSubmit={handleConfigSubmit}>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="registered@quixgo.com"
                    value={configData.quixgo_email}
                    onChange={(e) => setConfigData({...configData, quixgo_email: e.target.value})}
                    required
                />
                </div>
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="••••••••"
                    value={configData.quixgo_password}
                    onChange={(e) => setConfigData({...configData, quixgo_password: e.target.value})}
                    required
                />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="First Name"
                    value={configData.quixgo_firstName || ''}
                    onChange={(e) => setConfigData({...configData, quixgo_firstName: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Last Name"
                    value={configData.quixgo_lastName || ''}
                    onChange={(e) => setConfigData({...configData, quixgo_lastName: e.target.value})}
                    />
                </div>
                </div>
                <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                    type="text"
                    name="mobile"
                    id="mobile"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Mobile Number"
                    value={configData.quixgo_mobile || ''}
                    onChange={(e) => setConfigData({...configData, quixgo_mobile: e.target.value})}
                />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="default_courier" className="block text-sm font-medium text-gray-700">Default Courier</label>
                    <select
                    id="default_courier"
                    name="default_courier"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={configData.default_courier}
                    onChange={(e) => setConfigData({...configData, default_courier: e.target.value})}
                    >
                    <option value="DTC">DTDC</option>
                    <option value="DLV">Delhivery</option>
                    <option value="SFX">Shadowfax</option>
                    <option value="XBS">XpressBees</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">Service Type</label>
                    <select
                    id="service_type"
                    name="service_type"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={configData.default_service_type}
                    onChange={(e) => setConfigData({...configData, default_service_type: e.target.value})}
                    >
                    <option value="SF">Surface</option>
                    <option value="EXP">Express</option>
                    </select>
                </div>
                </div>
                <div>
                <label htmlFor="api_url" className="block text-sm font-medium text-gray-700">API Base URL</label>
                <input
                    type="text"
                    name="api_url"
                    id="api_url"
                    value={configData.quixgo_api_base_url}
                    onChange={(e) => setConfigData({...configData, quixgo_api_base_url: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">Use https://dev.api.quixgo.com/clientApi for testing</p>
                </div>
                <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none"
                    onClick={handleTestConnection}
                >
                    Test Connection
                </button>
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none"
                >
                    Save Settings
                </button>
                </div>
            </form>
            </div>
            
            {/* Pickup Addresses section */}
            <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Warehouse Pickup Addresses</h3>
                <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none"
                onClick={() => {/* Open add address modal */}}
                >
                Add New Address
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pickupAddresses.map((address) => (
                    <tr key={address.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{address.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{address.contact_person}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{address.address_line1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{address.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{address.pincode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {address.is_default ? (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-500">
                            <Check className="h-4 w-4" />
                            </span>
                        ) : (
                            <button 
                            className="text-gray-600 hover:text-indigo-900"
                            onClick={() => handleSetDefaultAddress(address.id)}
                            >
                            Set Default
                            </button>
                        )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => {/* Open edit address modal */}}
                        >
                            Edit
                        </button>
                        <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteAddress(address.id)}
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}
                    
                    {pickupAddresses.length === 0 && (
                    <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No pickup addresses found. Please add one to create shipments.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        )}
      </div>
  );
};

// StatCard component for dashboard stats
const StatCard = ({ title, value, icon, change, changeType }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-full">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={`inline-flex items-center text-sm ${getChangeColor()}`}>
          {change}
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={changeType === 'negative' ? "M19 13l-7 7-7-7m14-8l-7 7-7-7" : "M5 11l7-7 7 7M5 19l7-7 7 7"} 
            />
          </svg>
          <span className="ml-1 text-gray-500">from last month</span>
        </span>
      </div>
    </div>
  );
};

export default ShippingDashboard;
