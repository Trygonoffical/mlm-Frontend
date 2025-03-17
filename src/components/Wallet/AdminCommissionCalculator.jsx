'use client'
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { getTokens } from '@/utils/cookies';

const AdminCommissionCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [forcePayment, setForcePayment] = useState(true);
  const [memberId, setMemberId] = useState('');
  const [targetDate, setTargetDate] = useState('');
  
  const { token } = getTokens();
  
  const calculateCommissions = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Prepare request data
      const requestData = {
        force_payment: forcePayment
      };
      
      // Add optional parameters if provided
      if (memberId.trim()) {
        requestData.member_id = memberId;
      }
      
      if (targetDate) {
        requestData.target_date = targetDate;
      }
      
      // Make API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/calculate-commissions-now/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Calculation failed');
        setResult({
          success: false,
          message: data.message || 'Calculation failed',
          details: data.details || {}
        });
      }
    } catch (error) {
      console.error('Error calculating commissions:', error);
      toast.error('Error calculating commissions');
      setResult({
        success: false,
        message: error.message || 'An unexpected error occurred',
        details: {}
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Calculate Commissions</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Force Immediate Payment</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={forcePayment}
              onChange={(e) => setForcePayment(e.target.checked)}
              className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Mark commissions as paid immediately (adds to wallet balance)
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Target Date (Optional)</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Defaults to today if not specified
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Member ID (Optional)</label>
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            placeholder="Calculate for specific member only"
          />
        </div>
      </div>
      
      <button
        onClick={calculateCommissions}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex justify-center items-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Processing...
          </>
        ) : (
          'Calculate Commissions Now'
        )}
      </button>
      
      {result && (
        <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-start">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            )}
            <div>
              <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? 'Calculation Successful' : 'Calculation Failed'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">{result.message}</p>
              
              {result.success && result.details && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Details</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Date Range: {result.details.date_range}</li>
                    <li>Members Processed: {result.details.members_processed}</li>
                    <li>Total Commissions: {result.details.total_commissions}</li>
                    <li>Total Amount: ₹{result.details.total_amount}</li>
                  </ul>
                  
                  {result.details.member_results && result.details.member_results.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Member Results</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {result.details.member_results.map((member, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  {member.name} ({member.member_id})
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    member.status === 'SUCCESS' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {member.status}
                                    {member.reason ? ` (${member.reason})` : ''}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  ₹{member.commission_amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommissionCalculator;