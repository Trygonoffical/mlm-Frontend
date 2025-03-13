"use client"
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Check, Truck, Package, AlertCircle, Clock, ShoppingBag,
  Settings, RefreshCw, Search, ChevronDown, MapPin
} from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';


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

// const statusColors = {
//   'Pending': 'bg-yellow-100 text-yellow-800',
//   'Booked': 'bg-blue-100 text-blue-800',
//   'In Transit': 'bg-purple-100 text-purple-800',
//   'Out for Delivery': 'bg-indigo-100 text-indigo-800',
//   'Delivered': 'bg-green-100 text-green-800',
//   'Failed Delivery': 'bg-orange-100 text-orange-800',
//   'Returned': 'bg-red-100 text-red-800',
//   'Cancelled': 'bg-gray-100 text-gray-800',
// };

const ShippingDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courierFilter, setCourierFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [shipmentModal, setShipmentModal] = useState({
    isOpen: false,
    orderId: null,
    orderNumber: null,
    formData: {
      pickupAddressId: '',
      weight: '1.0',
      length: '10.0',
      width: '10.0',
      height: '10.0',
      courier: 'DTC',
      service_type: 'SF',
    
    },
    quantity: 0
  });
  const { token } = getTokens();

  // New state for tracking and details modals
  const [trackingModal, setTrackingModal] = useState({
    isOpen: false,
    shipmentId: null,
    awbNumber: null,
    trackingData: null,
    loading: false
  });
  
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    shipment: null
  });
  const [shipments, setShipments] = useState([]);

  // Implement show details function
  const handleShowDetails = (shipment) => {
    console.log('shipment details - ', shipment)
    setDetailsModal({
      isOpen: true,
      shipment
    });
  };
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;  // Adjust based on your API prefix

  
  const refreshQuixGoToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/config/refresh-token/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to refresh QuixGo token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };


  // State for data
  const [dashboardData, setDashboardData] = useState({
    status_stats: {},
    courier_stats: {},
    recent_shipments: [],
    pending_orders: []
  });

  const [pendingOrders, setPendingOrders] = useState([]);
  const [configData, setConfigData] = useState({
    email: '',
    password: '',
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


  // Add this to your ShippingDashboard component
  const ensureValidToken = async () => {
    try {
      // Check token validity
      const response = await fetch(`${API_BASE_URL}/config/check-token/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      // If token is invalid, refresh it
      if (!data.valid) {
        console.log('Token is invalid, refreshing...');
        const refreshResponse = await fetch(`${API_BASE_URL}/config/refresh-token/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!refreshResponse.ok) {
          console.error('Failed to refresh token:', await refreshResponse.text());
        } else {
          console.log('Token refreshed successfully');
        }
      }
    } catch (error) {
      console.error('Error ensuring valid token:', error);
    }
  };

// Update the useEffect to use this function
useEffect(() => {
  // Ensure we have a valid token when dashboard loads
  if (activeTab === 'dashboard' || activeTab === 'shipments' || 
      activeTab === 'pending' || activeTab === 'settings') {
    ensureValidToken();
  }
  
  // Continue with loading the appropriate data
  if (activeTab === 'dashboard') {
    loadDashboardData();
  } else if (activeTab === 'shipments') {
    loadShipments();
  } else if (activeTab === 'pending') {
    loadPendingOrders();
    loadPickupAddresses();

  } else if (activeTab === 'settings') {
    loadConfigData();
    loadPickupAddresses();
  }
}, [activeTab]);
  // Load initial data
  // useEffect(() => {
  //   // Check and refresh token first
  // checkAndRefreshToken();

  //   if (activeTab === 'dashboard') {
  //     loadDashboardData();
  //     loadPickupAddresses();
  //   } else if (activeTab === 'shipments') {
  //     loadShipments();
  //   } else if (activeTab === 'pending') {
  //     loadPendingOrders();
  //   // } else if (activeTab === 'settings') {
  //   //   loadConfigData();
  //   //   loadPickupAddresses();
  //   }
  // }, [activeTab]);
  
  // Load dashboard data
  // const loadDashboardData = async () => {
  //   setLoading(prev => ({ ...prev, dashboard: true }));
  //   const data = await fetchShippingStats();
  //   if (data && data.success) {
  //     console.log('order data - ', data)
  //     setDashboardData(data);
  //   }
  //   setLoading(prev => ({ ...prev, dashboard: false }));
  // };
  const loadDashboardData = async () => {
    setLoading(prev => ({ ...prev, dashboard: true }));
    const data = await fetchShippingStats();
    console.log('Dashboard data received:', data);
    if (data && data.success) {
      // Ensure all expected properties exist
      const safeData = {
        status_stats: data.status_stats || {},
        courier_stats: data.courier_stats || {},
        recent_shipments: data.recent_shipments || [],
        pending_orders: data.pending_orders || []
      };
      setDashboardData(safeData);
    }
    setLoading(prev => ({ ...prev, dashboard: false }));
  };

  // Load shipments based on filters
  // const loadShipments = async () => {
  //   setLoading(prev => ({ ...prev, shipments: true }));
  //   const data = await fetchShipments(statusFilter, courierFilter, searchQuery);
  //   if (data) {
  //     setShipments(data.results || []);
  //   }
  //   setLoading(prev => ({ ...prev, shipments: false }));
  // };

  const loadShipments = async () => {
    setLoading(prev => ({ ...prev, shipments: true }));
    const data = await fetchShipments(statusFilter, courierFilter, searchQuery);
    console.log('Shipments data received:', data); // Add this
    if (data) {
      // Check the structure of data
      if (Array.isArray(data)) {
        setShipments(data);
      } else if (data.results && Array.isArray(data.results)) {
        setShipments(data.results);
      } else {
        // Handle other possible structures or log error
        console.error('Unexpected shipments data structure:', data);
        setShipments([]);
      }
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
      const response = await fetch(`${API_BASE_URL}/config/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Merge fetched data with default state to ensure all fields exist
        setConfigData(prevConfig => ({
          ...prevConfig,
          ...data,
          // Use fallback values for any missing fields
          email: data.email || prevConfig.email,
          password: data.password || prevConfig.password,
          first_name: data.firstName || prevConfig.first_name,
          last_name: data.lastName || prevConfig.last_name,
          mobile: data.mobile || prevConfig.mobile,
          default_courier: data.default_courier || prevConfig.default_courier,
          default_service_type: data.default_service_type || prevConfig.default_service_type,
        }));
      } else {
        // Log the error response
        const errorText = await response.text();
        console.error('Config fetch error:', errorText);
        
        // Optionally set a notification
        setNotification({
          type: 'error',
          message: 'Failed to load configuration'
        });
      }
    } catch (error) {
      console.error('Error loading config:', error);
      setNotification({
        type: 'error',
        message: 'Network error while loading configuration'
      });
    } finally {
      setLoading(prev => ({ ...prev, config: false }));
    }
  };

  // Load pickup addresses
  const loadPickupAddresses = async () => {
    try {
      console.log("Loading pickup addresses...");
      const response = await fetch(`${API_BASE_URL}/pickup-addresses/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const contentType = response.headers.get('content-type');
      console.log("Response content type:", contentType);
      
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log("Pickup addresses response:", data);
          
          // Handle different response formats
          if (Array.isArray(data)) {
            setPickupAddresses(data);
            console.log(`Loaded ${data.length} pickup addresses`);
          } else if (data.addresses && Array.isArray(data.addresses)) {
            setPickupAddresses(data.addresses);
            console.log(`Loaded ${data.addresses.length} pickup addresses`);
          } else if (data.success === false) {
            console.error("API returned an error:", data.message || data.error);
            setPickupAddresses([]);
          } else {
            console.error("Unexpected response format for pickup addresses:", data);
            setPickupAddresses([]);
          }
        } else {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          setPickupAddresses([]);
        }
      } else {
        try {
          const errorText = await response.text();
          console.error("Error loading pickup addresses:", errorText);
        } catch (textError) {
          console.error("Error reading error response:", textError);
        }
        setPickupAddresses([]);
      }
    } catch (error) {
      console.error('Exception loading pickup addresses:', error);
      setPickupAddresses([]);
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

  // Add more detailed error logging in form submission
  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs before submission
    if (!configData.quixgo_email || !configData.quixgo_password) {
      setNotification({
        type: 'error',
        message: 'Email and Password are required'
      });
      return;
    }
    console.log('config data - ', configData)
    try {
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
        
        // Log the detailed error
        console.error('Config save error:', response);
      }
    } catch (error) {
      console.error('Unexpected error saving config:', error);
      setNotification({
        type: 'error',
        message: 'An unexpected error occurred'
      });
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  // Debug logging for token and API URL
  useEffect(() => {
    console.log('Token:', token);
    console.log('API Base URL:', API_BASE_URL);
  }, [token, API_BASE_URL]);


// Handle showing the shipment modal
const handleShowShipmentModal = (order) => {
  // const defaultPickupAddress = pickupAddresses.find(addr => addr.is_default) || 
  //                              (pickupAddresses.length > 0 ? pickupAddresses[0] : null);
  console.log("Available pickup addresses:", pickupAddresses);
  
  const defaultPickupAddress = pickupAddresses.find(addr => addr.is_default) || 
                               (pickupAddresses.length > 0 ? pickupAddresses[0] : null);
  
  console.log("Selected default address:", defaultPickupAddress);
  // console.log("Selected default order:", order);

  setShipmentModal({
    isOpen: true,
    orderId: order.id,
    orderNumber: order.order_number,
    formData: {
      pickupAddressId: defaultPickupAddress ? defaultPickupAddress.id : '',
      weight: '1.0',
      length: '10.0',
      width: '10.0',
      height: '10.0',
      productName: 'Order Products',
      courier: 'DTC',
      service_type: 'SF',
      
    },
   
  });
};

// Handle creating the shipment after form submission
const handleCreateShipment = async (e) => {
  e.preventDefault();
  
  const { orderId, formData  } = shipmentModal;
  
  if (!formData.pickupAddressId) {
    setNotification({
      type: 'error',
      message: 'Please select a pickup address'
    });
    return;
  }
  
  const shipmentData = {
    order: orderId,
    pickup_address: formData.pickupAddressId,
    
    // Only send customizable shipping parameters
    weight: parseFloat(formData.weight),
    length: parseFloat(formData.length),
    width: parseFloat(formData.width),
    height: parseFloat(formData.height),
    
    // Service preferences
    service_type: formData.service_type,
    courier_name: formData.courier
  };

  
  try {
    console.log('shipment Data before sending -', shipmentData)
    // const response = await createShipment(shipmentData);
    const response = await fetch(`${API_BASE_URL}/shipments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(shipmentData) // Using our simplified version for our API
    });

    console.log('Response received:', response);

    if (response.ok) {
      setNotification({
        type: 'success',
        message: 'Shipment created successfully'
      });
      setShipmentModal({...shipmentModal, isOpen: false});
      loadDashboardData();
      loadShipments();
      loadPendingOrders();
      toast.success('Shipment created successfully');
      refreshData();
    } else {
      setNotification({
        type: 'error',
        message: response.message || 'Failed to create shipment'
      });
    }
  } catch (error) {
    console.error('Error creating shipment:', error);
    setNotification({
      type: 'error',
      message: 'An error occurred while creating the shipment'
    });
  }
  
  // Clear notification after 3 seconds
  setTimeout(() => {
    setNotification(null);
  }, 3000);
};

  

// Define status colors including QuixGo-specific statuses
const statusColors = {
  'PENDING': 'bg-yellow-100 text-yellow-800',
  'BOOKED': 'bg-blue-100 text-blue-800',
  'PICKED_UP': 'bg-blue-100 text-blue-800',
  'IN_TRANSIT': 'bg-purple-100 text-purple-800',
  'OUT_FOR_DELIVERY': 'bg-indigo-100 text-indigo-800',
  'DELIVERED': 'bg-green-100 text-green-800',
  'FAILED_DELIVERY': 'bg-orange-100 text-orange-800',
  'RETURNED': 'bg-red-100 text-red-800',
  'CANCELLED': 'bg-gray-100 text-gray-800',
  // QuixGo-specific statuses
  'Manifested': 'bg-blue-100 text-blue-800',
  'Picked Up': 'bg-blue-100 text-blue-800',
  'In Transit': 'bg-purple-100 text-purple-800',
  'Out For Delivery': 'bg-indigo-100 text-indigo-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Undelivered': 'bg-orange-100 text-orange-800',
  'RTO': 'bg-red-100 text-red-800',
  'Cancelled': 'bg-gray-100 text-gray-800',
};

// Updated Track Shipment handler
const handleTrackShipment = async (shipmentId, awbNumber) => {
  // Show tracking modal with loading state
  setTrackingModal({
    isOpen: true,
    shipmentId,
    awbNumber,
    trackingData: null,
    loading: true
  });
  
  try {
    console.log(`Tracking shipment ID: ${shipmentId}, AWB: ${awbNumber}`);
    
    // Make the API request
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/track/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Check for HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Tracking API error: ${response.status} ${response.statusText}`);
      console.error(`Error response: ${errorText}`);
      throw new Error(`Failed to track shipment: ${response.statusText}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    console.log('Tracking API response:', data);
    
    // Update the modal with tracking data
    setTrackingModal(prev => ({
      ...prev,
      trackingData: data,
      loading: false
    }));
    
    // Show success message (only if modal wasn't already open)
    if (!trackingModal.isOpen) {
      toast.success('Shipment tracking updated successfully');
    }
    
    // Refresh the data to update any status changes
    refreshData();
    
  } catch (error) {
    console.error('Error tracking shipment:', error);
    
    // Update modal with error state
    setTrackingModal(prev => ({
      ...prev,
      loading: false
    }));
    
    // Show error message
    toast.error(`Failed to track shipment: ${error.message}`);
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




const fetchShippingStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipping/dashboard/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching shipping stats:', error);
    return null;
  }
};

// const fetchShipments = async (status = null, courier = null, search = '') => {
//   let queryParams = new URLSearchParams();
//   if (status && status !== 'All') queryParams.append('status', status);
//   if (courier && courier !== 'All') queryParams.append('courier', courier);
//   if (search) queryParams.append('search', search);
  
//   try {
//     const response = await fetch(`${API_BASE_URL}/shipments/?${queryParams}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
//     if (!response.ok) throw new Error('Failed to fetch shipments');
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching shipments:', error);
//     return { results: [] };
//   }
// };

const fetchShipments = async (status = null, courier = null, search = '') => {
  let queryParams = new URLSearchParams();
  if (status && status !== 'All') queryParams.append('status', status);
  if (courier && courier !== 'All') queryParams.append('courier', courier);
  if (search) queryParams.append('search', search);
  
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error(`Error fetching shipments: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Response body: ${errorText}`);
      return { results: [] };
    }
    
    const data = await response.json();
    console.log('Raw shipments API response:', data);
    return data;
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
    const response = await fetch(`${API_BASE_URL}/allorders/?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch pending orders');
    const data = await response.json();
    console.log('all pending orders - '. data)
    return data
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    return [];
  }
};

const saveShippingConfig = async (configData) => {
  try {
    // const response = await fetch(`${API_BASE_URL}/config/`, { https://dev.api.quixgo.com/clientApi/login
      const response = await fetch(` https://dev.api.quixgo.com/clientApi/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configData)
    });
    
    const data = await response.json();
    if(response.ok) {
      toast.success('Login successfully');
      console.log('config data - ', data)
      return data;
    }else{
      toast.error('Error');
    }
  } catch (error) {
    console.error('Error saving shipping config:', error);
   
    return { success: false, message: 'Network error' };
  }
};



const createShipment = async (shipmentData) => {
  console.log('shipmentData at create shipmentData -', shipmentData)

  try {
    // Get pickup address details
    // const pickupAddress = pickupAddresses.find(addr => addr.id === shipmentData.pickup_address);
    // if (!pickupAddress) {
    //   return { success: false, message: 'Pickup address not found' };
    // }
    
    // Make the API call
    const response = await fetch(`${API_BASE_URL}/shipments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(shipmentData) // Using our simplified version for our API
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
      method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error cancelling shipment:', error);
    return { success: false, message: 'Network error' };
  }
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
          {/* <button className="flex items-center bg-indigo-50 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-100">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button> */}
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
          {/* <button
            className={`py-3 px-1 ${activeTab === 'settings' ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('settings')}
          >
            Configuration
          </button> */}
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
                                onClick={() => handleTrackShipment(shipment.id, shipment.awb_number)}
                            >
                                Track
                            </button>
                            <button 
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => handleShowDetails(shipment)}
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
                            onClick={() => handleShowDetails(shipment)}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.order_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.financial_details.final_amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* <button 
                            className="bg-green-50 text-green-600 px-3 py-1 rounded-md hover:bg-green-100"
                            onClick={() => handleCreateShipment(order.id)}
                        >
                            Ship Now
                        </button> */}
                        <button 
                          className="bg-green-50 text-green-600 px-3 py-1 rounded-md hover:bg-green-100"
                          onClick={() => handleShowShipmentModal(order)}
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

        {/* Shipment Creation Modal */}
          {shipmentModal.isOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Create Shipment</h3>
                  <button 
                    onClick={() => setShipmentModal({...shipmentModal, isOpen: false})}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleCreateShipment} className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Order: <span className="font-medium text-gray-900">{shipmentModal.orderNumber}</span></p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={shipmentModal.formData.pickupAddressId}
                      onChange={(e) => setShipmentModal({
                        ...shipmentModal, 
                        formData: {...shipmentModal.formData, pickupAddressId: e.target.value}
                      })}
                      required
                    >
                      <option value="">Select a pickup address</option>
                      {pickupAddresses.map((address , idx) => (
                        <option key={idx} value={address.id}>
                          {address.pickupName} - {address.addName} ({address.is_default ? 'Default' : ''})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Courier</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={shipmentModal.formData.courier}
                        onChange={(e) => setShipmentModal({
                          ...shipmentModal, 
                          formData: {...shipmentModal.formData, courier: e.target.value}
                        })}
                      >
                        <option value="DTC">DTDC</option>
                        <option value="DLV">Delhivery</option>
                        <option value="SFX">Shadowfax</option>
                        <option value="XBS">XpressBees</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Service Type</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={shipmentModal.formData.service_type}
                        onChange={(e) => setShipmentModal({
                          ...shipmentModal, 
                          formData: {...shipmentModal.formData, service_type: e.target.value}
                        })}
                      >
                        <option value="SF">Surface</option>
                        <option value="EXP">Express</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={shipmentModal.formData.productName}
                      onChange={(e) => setShipmentModal({
                        ...shipmentModal, 
                        formData: {...shipmentModal.formData, productName: e.target.value}
                      })}
                    />
                  </div> */}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={shipmentModal.formData.weight}
                        onChange={(e) => setShipmentModal({
                          ...shipmentModal, 
                          formData: {...shipmentModal.formData, weight: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={shipmentModal.formData.length}
                        onChange={(e) => setShipmentModal({
                          ...shipmentModal, 
                          formData: {...shipmentModal.formData, length: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={shipmentModal.formData.width}
                        onChange={(e) => setShipmentModal({
                          ...shipmentModal, 
                          formData: {...shipmentModal.formData, width: e.target.value}
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={shipmentModal.formData.height}
                        onChange={(e) => setShipmentModal({
                          ...shipmentModal, 
                          formData: {...shipmentModal.formData, height: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      className="mr-4 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setShipmentModal({...shipmentModal, isOpen: false})}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none"
                    >
                      Create Shipment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}



// Updated Tracking Modal Component
{trackingModal.isOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Tracking Details for AWB: {trackingModal.awbNumber || 'Unknown'}
        </h3>
        <button 
          onClick={() => setTrackingModal({...trackingModal, isOpen: false})}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {trackingModal.loading ? (
        // Loading state
        <div className="py-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Tracking shipment...</p>
        </div>
      ) : trackingModal.trackingData && trackingModal.trackingData.success ? (
        // Successfully loaded tracking data
        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-indigo-50 p-4 rounded-md">
            <h4 className="font-medium">Current Status</h4>
            <p className="text-lg font-semibold text-indigo-700 mt-1">
              {trackingModal.trackingData.current_status || trackingModal.trackingData.status || 'Unknown'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Last Updated: {trackingModal.trackingData.last_updated ? 
                new Date(trackingModal.trackingData.last_updated).toLocaleString() : 'N/A'}
            </p>
          </div>
          
          {/* Tracking Link */}
          {trackingModal.trackingData.tracking_link && (
            <div className="mt-2">
              <a 
                href={trackingModal.trackingData.tracking_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
              >
                Open courier tracking page <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          )}
          
          {/* Status Timeline */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Status Timeline</h4>
            {trackingModal.trackingData.status_history && 
             trackingModal.trackingData.status_history.length > 0 ? (
              <div className="border rounded-md divide-y">
                {trackingModal.trackingData.status_history.map((update, idx) => (
                  <div key={idx} className="p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          statusColors[update.status || update.statusName] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {update.status || update.statusName || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {update.timestamp ? new Date(update.timestamp).toLocaleString() : 
                         update.updateDate ? new Date(update.updateDate).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <p className="mt-1 text-sm">{update.details || update.comment || 'No additional details'}</p>
                    {(update.location || update.locationName) && (
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {update.locationName || update.location || 'Unknown location'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No status updates available</p>
            )}
          </div>
        </div>
      ) : (
        // Error state or no data
        <div className="py-8 text-center text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p>Unable to fetch tracking information</p>
          <p className="text-sm text-red-500 mt-2">
            {trackingModal.trackingData?.message || 'No tracking data available'}
          </p>
          <button 
            onClick={() => handleTrackShipment(trackingModal.shipmentId, trackingModal.awbNumber)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retry Tracking
          </button>
        </div>
      )}
    </div>
  </div>
)}

          {/* Shipment Details Modal */}
      {detailsModal.isOpen && detailsModal.shipment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Shipment Details
              </h3>
              <button 
                onClick={() => setDetailsModal({...detailsModal, isOpen: false})}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Shipment Info */}
              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Shipment Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">AWB Number</p>
                    <p className="font-medium">{detailsModal.shipment.awb_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      statusColors[detailsModal.shipment.status] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {detailsModal.shipment.status || 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Courier</p>
                    <p className="font-medium">{detailsModal.shipment.courier_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="font-medium">
                      {detailsModal.shipment.service_type === 'SF' ? 'Surface' : 
                       detailsModal.shipment.service_type === 'EXP' ? 'Express' : 
                       detailsModal.shipment.service_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created On</p>
                    <p className="font-medium">
                      {detailsModal.shipment.created_at ? 
                        new Date(detailsModal.shipment.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Updated On</p>
                    <p className="font-medium">
                      {detailsModal.shipment.updated_at ? 
                        new Date(detailsModal.shipment.updated_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Package Details */}
              <div>
                <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Package Details</h4>
                <div className="bg-white border rounded-md p-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">{detailsModal.shipment.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Length</p>
                      <p className="font-medium">{detailsModal.shipment.length} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Width</p>
                      <p className="font-medium">{detailsModal.shipment.width} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-medium">{detailsModal.shipment.height} cm</p>
                    </div>
                  </div>
                  
                  {detailsModal.shipment.is_cod && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-500">COD Amount</p>
                      <p className="font-medium">₹{detailsModal.shipment.cod_amount}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Order Information */}
              {/* {detailsModal.shipment.order && (
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Order Information</h4>
                  <div className="bg-white border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-medium">{detailsModal.shipment.order.order_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">
                          {new Date(detailsModal.shipment.order.order_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Status</p>
                        <p className="font-medium">{detailsModal.shipment.order.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Amount</p>
                        <p className="font-medium">₹{detailsModal.shipment.order.final_amount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
              
              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-2">
                {detailsModal.shipment.status !== 'CANCELLED' && 
                 detailsModal.shipment.status !== 'DELIVERED' && (
                  <>
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => {
                        setDetailsModal({...detailsModal, isOpen: false});
                        handleTrackShipment(detailsModal.shipment.id, detailsModal.shipment.awb_number);
                        // handleTrackShipment(shipment.id, shipment.awb_number)}
                      }}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Track
                    </button>
                    
                    {detailsModal.shipment.status !== 'RETURNED' && (
                      <button 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          setDetailsModal({...detailsModal, isOpen: false});
                          handleCancelShipment(detailsModal.shipment.id);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </>
                )}
                
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setDetailsModal({...detailsModal, isOpen: false})}
                >
                  Close
                </button>
              </div>
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

