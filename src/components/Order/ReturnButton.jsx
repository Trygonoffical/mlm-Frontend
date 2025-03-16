import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';
import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ReturnButton = ({ order, onReturnSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = getTokens();

  // Check if return is available (within 7 days of delivery)
  const isReturnAvailable = () => {
    if (!order) return false;
    if (order.status !== 'DELIVERED') return false;

    // Find delivery status update
    const deliveryUpdate = order.shipments?.find(s => 
      s.status_updates?.some(update => update.status === 'DELIVERED')
    );

    if (!deliveryUpdate) return false;

    // Get delivery date from the first delivered status update
    const deliveryStatus = deliveryUpdate.status_updates.find(u => u.status === 'DELIVERED');
    if (!deliveryStatus) return false;

    const deliveryDate = new Date(deliveryStatus.timestamp);
    const currentDate = new Date();
    
    // Check if within 7 days
    const daysDiff = Math.floor((currentDate - deliveryDate) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  };

  // Function to create return
  const initiateReturn = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for return');
      return;
    }

    setLoading(true);
    try {
      // Find the original shipment to reference
      const originalShipment = order.shipments?.[0];
      
      // Prepare return data
      const returnData = {
        order: order.id,
        original_shipment_id: originalShipment?.id,
        reason: reason
      };

      // Call the API to create return
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipments/return/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(returnData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create return');
      }

      const data = await response.json();
      toast.success('Return initiated successfully!');
      setShowModal(false);
      
      // Notify parent component
      if (onReturnSuccess) {
        onReturnSuccess(data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to initiate return');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // If return is not available, don't render anything
  if (!isReturnAvailable()) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
      >
        <ArrowUturnLeftIcon className="h-5 w-5 mr-1" />
        Return Order
      </button>

      {/* Return Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Return Order</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Please provide a reason for returning this order.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for return..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={initiateReturn}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-300"
              >
                {loading ? 'Processing...' : 'Submit Return Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReturnButton;