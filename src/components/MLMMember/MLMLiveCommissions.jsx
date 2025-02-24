'use client'

import React, { useState, useEffect } from 'react';
import { BanknotesIcon, ArrowPathIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';

const MLMLiveCommissions = ({ memberId }) => {
  const [liveCommissions, setLiveCommissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculationTime, setCalculationTime] = useState(null);
  const { token } = getTokens();

  useEffect(() => {
    fetchLiveCommissions();
  }, [memberId]);

  const fetchLiveCommissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${memberId}/live-commissions/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch live commissions');
      }
      
      const data = await response.json();
      setLiveCommissions(data);
      setCalculationTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to load live commission data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <BanknotesIcon className="h-5 w-5 mr-2 text-blue-500" />
          Live Commission Estimates
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLiveCommissions}
            className="flex items-center text-xs px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <ArrowPathIcon className="h-3 w-3 mr-1" />
            Refresh
          </button>
          {calculationTime && (
            <span className="text-xs text-gray-500">
              Last updated: {calculationTime}
            </span>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4 flex items-center">
        <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
        <span>
          These are estimated commissions based on current downline purchases. Final amounts will be calculated at month-end.
        </span>
      </div>

      {liveCommissions ? (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-700">Current Month Estimate</div>
              <div className="text-2xl font-bold text-blue-900">
                ₹{parseFloat(liveCommissions.current_month_estimate).toFixed(2)}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-700">Last Month Earned</div>
              <div className="text-2xl font-bold text-green-900">
                ₹{parseFloat(liveCommissions.last_month_earned).toFixed(2)}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-700">Total Pending</div>
              <div className="text-2xl font-bold text-purple-900">
                ₹{parseFloat(liveCommissions.total_pending).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Downline Purchase Breakdown */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Downline Purchase Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Commission</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {liveCommissions.level_breakdown.map((level) => (
                    <tr key={level.level} className={level.level === 1 ? "bg-blue-50" : ""}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        Level {level.level}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {level.member_count}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        ₹{parseFloat(level.total_purchases).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {level.commission_rate}%
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        ₹{parseFloat(level.estimated_commission).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900" colSpan={4}>
                      Total Estimated Commission
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      ₹{parseFloat(liveCommissions.current_month_estimate).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Performers */}
          {liveCommissions.top_performers && liveCommissions.top_performers.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Top Performing Downline Members</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Your Commission</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {liveCommissions.top_performers.map((performer, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{performer.name}</div>
                            <div className="text-xs text-gray-500 ml-1">({performer.member_id})</div>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          Level {performer.level}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {performer.position}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ₹{parseFloat(performer.total_purchases).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          ₹{parseFloat(performer.your_commission).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {liveCommissions.recent_transactions && liveCommissions.recent_transactions.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Recent Downline Purchases</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Your Commission</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {liveCommissions.recent_transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{transaction.member_name}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          Level {transaction.level}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {transaction.order_id}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ₹{parseFloat(transaction.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          ₹{parseFloat(transaction.your_commission).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-700">No commission data available yet. This could be because:</p>
          <ul className="list-disc ml-5 mt-2 text-yellow-700">
            <li>The member has no downline purchases yet</li>
            <li>The commission rates may not be configured properly</li>
            <li>The member's position doesn't qualify for commissions</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MLMLiveCommissions;