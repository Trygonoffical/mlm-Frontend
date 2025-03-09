'use client'
import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle, AlertCircle, MapPin, RefreshCw } from 'lucide-react';

const ShipmentTracking = ({ orderId, awbNumber }) => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(awbNumber || '');

  // Replace with actual API call
  const fetchTrackingInfo = async (trackingNumber) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for demonstration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Example response
      const mockResponse = {
        awbNumber: trackingNumber,
        courier: 'DTDC',
        currentStatus: 'In Transit',
        expectedDelivery: '2023-08-25',
        origin: 'Noida, UP',
        destination: 'Bangalore, KA',
        shipDate: '2023-08-18',
        statusHistory: [
          { status: 'Booked', date: '2023-08-18 10:15', location: 'Noida, UP', details: 'Shipment booked' },
          { status: 'Picked Up', date: '2023-08-18 16:30', location: 'Noida, UP', details: 'Shipment picked up' },
          { status: 'In Transit', date: '2023-08-19 08:45', location: 'Delhi Hub', details: 'Shipment in transit to Bangalore' },
          { status: 'In Transit', date: '2023-08-20 07:30', location: 'Mumbai Hub', details: 'Shipment in transit' },
        ]
      };
      
      setTrackingInfo(mockResponse);
    } catch (err) {
      console.error('Error fetching tracking info:', err);
      setError('Failed to load tracking information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (awbNumber) {
      fetchTrackingInfo(awbNumber);
    }
  }, [awbNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchTrackingInfo(searchQuery.trim());
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Booked':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'Picked Up':
        return <Package className="w-5 h-5 text-indigo-500" />;
      case 'In Transit':
        return <Truck className="w-5 h-5 text-yellow-500" />;
      case 'Out for Delivery':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Failed Delivery':
      case 'Cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Booked':
        return 'bg-blue-100 text-blue-800';
      case 'Picked Up':
        return 'bg-indigo-100 text-indigo-800';
      case 'In Transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Failed Delivery':
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Track Your Shipment</h2>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter AWB or tracking number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Track
          </button>
        </div>
      </form>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading tracking information...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tracking Information */}
      {!loading && !error && trackingInfo && (
        <div>
          {/* Tracking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">AWB Number</p>
                <p className="font-semibold">{trackingInfo.awbNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Courier</p>
                <p className="font-semibold">{trackingInfo.courier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(trackingInfo.currentStatus)}`}>
                  {trackingInfo.currentStatus}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Delivery</p>
                <p className="font-semibold">{trackingInfo.expectedDelivery}</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{trackingInfo.origin}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{trackingInfo.destination}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipment Progress */}
          <h3 className="text-lg font-medium mb-4">Shipment Progress</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-7 w-0.5 bg-gray-200" />
            
            {/* Timeline events */}
            <div className="space-y-6">
              {trackingInfo.statusHistory.map((event, index) => (
                <div key={index} className="relative flex items-start">
                  <div className="flex items-center justify-center h-14">
                    <div className={`absolute flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? 'bg-indigo-100 border-2 border-indigo-500' : 'bg-white border border-gray-300'}`}>
                      {getStatusIcon(event.status)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {event.status}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      <p>{event.details}</p>
                      <p className="mt-1">
                        <span className="font-medium">{event.location}</span> · {event.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                <Truck className="w-4 h-4 mr-2" /> Contact courier service
              </a>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" /> Report an issue
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && !trackingInfo && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking information</h3>
          <p className="text-gray-500">Enter a tracking number to get started</p>
        </div>
      )}
    </div>
  );
};

export default ShipmentTracking;