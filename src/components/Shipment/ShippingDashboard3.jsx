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
      productName: 'Order Products',
      courier: 'DTC',
      service_type: 'SF'
    }
  });
  const { token } = getTokens();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;  // Adjust based on your API prefix


  const checkAndRefreshToken = async () => {
    try {
      // Make a request to check token validity
      const response = await fetch(`${API_BASE_URL}/config/check-token/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!data.valid) {
        // Token is invalid or expired, refresh it
        await refreshQuixGoToken();
      }
    } catch (error) {
      console.error('Error checking token:', error);
      // Try to refresh anyway on error
      await refreshQuixGoToken();
    }
  };
  
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
  const [shipments, setShipments] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [configData, setConfigData] = useState({
    email: '',
    password: '',
    // quixgo_firstName: '',
    // quixgo_lastName: '',
    // quixgo_mobile: '',
    // default_courier: 'DTC',
    // default_service_type: 'SF',
    // quixgo_api_base_url: 'https://dev.api.quixgo.com/clientApi/login'
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
      const response = await fetch(`${API_BASE_URL}/pickup-addresses/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  const handleTestConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/config/test/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: configData.quixgo_email,
          password: configData.quixgo_password
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Connection successful'
        });
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Connection failed'
        });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setNotification({
        type: 'error',
        message: 'Network error'
      });
    }
  };

// Handle showing the shipment modal
const handleShowShipmentModal = (order) => {
  const defaultPickupAddress = pickupAddresses.find(addr => addr.is_default) || 
                               (pickupAddresses.length > 0 ? pickupAddresses[0] : null);
  
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
      service_type: 'SF'
    }
  });
};

// Handle creating the shipment after form submission
const handleCreateShipment = async (e) => {
  e.preventDefault();
  
  const { orderId, formData } = shipmentModal;
  
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
    weight: parseFloat(formData.weight),
    length: parseFloat(formData.length),
    width: parseFloat(formData.width),
    height: parseFloat(formData.height),
    service_type: formData.service_type,
    courier_name: formData.courier,
    is_cod: false, // You can make this dynamic if needed
    product_name: formData.productName
  };
  
  try {
    const response = await createShipment(shipmentData);
    
    if (response.success) {
      setNotification({
        type: 'success',
        message: 'Shipment created successfully'
      });
      setShipmentModal({...shipmentModal, isOpen: false});
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

  
  // Handle create shipment
  // const handleCreateShipment = async (orderId) => {
  //   // Get default pickup address
  //   const defaultAddress = pickupAddresses.find(addr => addr.is_default) || pickupAddresses[0];
    
  //   if (!defaultAddress) {
  //     setNotification({
  //       type: 'error',
  //       message: 'No pickup address available. Please create one first.'
  //     });
  //     return;
  //   }
    
  //   const shipmentData = {
  //     order: orderId,
  //     pickup_address: defaultAddress.id,
  //     weight: 1.0,
  //     length: 10.0,
  //     width: 10.0,
  //     height: 10.0,
  //     service_type: configData.default_service_type,
  //     is_cod: false
  //   };
    
  //   const response = await createShipment(shipmentData);
    
  //   if (response.success) {
  //     setNotification({
  //       type: 'success',
  //       message: 'Shipment created successfully'
  //     });
  //     refreshData();
  //   } else {
  //     setNotification({
  //       type: 'error',
  //       message: response.message || 'Failed to create shipment'
  //     });
  //   }
    
  //   // Clear notification after 3 seconds
  //   setTimeout(() => {
  //     setNotification(null);
  //   }, 3000);
  // };

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
    const response = await fetch(`${API_BASE_URL}/allorders/?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch pending orders');
    return await response.json();
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

const testConnection = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
    // Get pickup address details
    const pickupAddress = pickupAddresses.find(addr => addr.id === shipmentData.pickup_address);
    if (!pickupAddress) {
      return { success: false, message: 'Pickup address not found' };
    }
    
    // Get order details
    const orderResponse = await fetch(`${API_BASE_URL}/orders/${shipmentData.order}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!orderResponse.ok) {
      return { success: false, message: 'Failed to fetch order details' };
    }
    
    const order = await orderResponse.json();
    
    // Extract delivery address from order shipping address
    // This assumes shipping_address is a string like "Name, Address1, City, State, Pincode"
    const addressParts = order.shipping_address.split(',').map(part => part.trim());
    const deliveryAddress = {
      name: addressParts[0] || 'Customer',
      address1: addressParts[1] || '',
      address2: addressParts[2] || '',
      landmark: '',
      city: addressParts[3] || '',
      state: addressParts[4] || '',
      pincode: addressParts[5] || '',
      mobile: order.user?.phone_number || '',
      email: order.user?.email || '',
      addressType: 'Home'
    };
    
    // Format pickupAddress for QuixGo
    const quixgoPickupAddress = {
      addressId: pickupAddress.address_id,
      customerId: pickupAddress.customer_id,
      pickupName: pickupAddress.name,
      addressCategory: 'pickup',
      addressType: pickupAddress.address_type,
      shipmentType: 'B2C',
      cpPerson: pickupAddress.contact_person,
      address1: pickupAddress.address_line1,
      address2: pickupAddress.address_line2 || '',
      city: pickupAddress.city,
      state: pickupAddress.state,
      country: pickupAddress.country || 'India',
      landmark: pickupAddress.landmark || '',
      pincode: pickupAddress.pincode,
      cpMobile: pickupAddress.phone,
      alternateNumber: pickupAddress.alternate_phone || '',
      email: pickupAddress.email || '',
      isActive: true,
      isDeleted: false,
      addName: `${pickupAddress.contact_person}-${pickupAddress.pincode}-${pickupAddress.customer_id}-${pickupAddress.address_id}`
    };
    
    // Prepare the payload according to QuixGo's API requirements
    const payload = [{
      deliveryAddress: deliveryAddress,
      pickupAddress: quixgoPickupAddress,
      returnAddress: quixgoPickupAddress, // Using same pickup address for return
      customerType: 'Business',
      productDetails: {
        weight: shipmentData.weight.toString(),
        height: shipmentData.height.toString(),
        width: shipmentData.width.toString(),
        length: shipmentData.length.toString(),
        invoice: order.final_amount.toString(),
        productName: shipmentData.product_name || 'Order Products',
        productType: 'Merchandise',
        quantity: '1',
        skuNumber: '',
        orderNumber: order.order_number
      },
      serviceProvider: shipmentData.courier_name,
      serviceType: shipmentData.service_type,
      paymentMode: order.orderType === 'COD' ? 'COD' : 'Prepaid',
      codAmount: order.orderType === 'COD' ? order.final_amount : 0,
      insuranceCharge: 0,
      customerId: pickupAddress.customer_id,
      serviceMode: 'FW' // Forward shipment
    }];
    
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

const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pickup-addresses/${addressId}/set_default/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
                      {pickupAddresses.map(address => (
                        <option key={address.id} value={address.id}>
                          {address.name} - {address.city} ({address.is_default ? 'Default' : ''})
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
                  
                  <div>
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
                  </div>
                  
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

