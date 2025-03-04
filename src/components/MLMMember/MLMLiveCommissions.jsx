// 'use client'

// import React, { useState, useEffect } from 'react';
// import { BanknotesIcon, ArrowPathIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';

// const MLMLiveCommissions = ({ memberId }) => {
//   const [liveCommissions, setLiveCommissions] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [calculationTime, setCalculationTime] = useState(null);
//   const { token } = getTokens();

//   useEffect(() => {
//     fetchLiveCommissions();
//   }, [memberId]);

//   // const fetchLiveCommissions = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const response = await fetch(
//   //       `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${memberId}/live-commissions/`,
//   //       {
//   //         headers: {
//   //           'Authorization': `Bearer ${token}`
//   //         }
//   //       }
//   //     );
  
//   //     if (!response.ok) {
//   //       const errorData = await response.json();
//   //       throw new Error(errorData.error || 'Failed to fetch live commissions');
//   //     }
      
//   //     const data = await response.json();
//   //     setLiveCommissions(data);
//   //     setCalculationTime(new Date().toLocaleTimeString());
//   //   } catch (error) {
//   //     console.error('Error:', error);
//   //     toast.error(error.message || 'Failed to load live commission data');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchLiveCommissions = async () => {
//     try {
//       setLoading(true);
      
//       // Use the new endpoint - we'll pass memberId as a query param if needed
//       let url = `${process.env.NEXT_PUBLIC_API_URL}/mlm/live-commission/`;
//       if (memberId) {
//         url += `?member_id=${memberId}`;
//       }
      
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || errorData.error || 'Failed to fetch live commissions');
//       }
      
//       const data = await response.json();
      
//       if (!data.status) {
//         throw new Error(data.message || 'Failed to load commission data');
//       }
      
//       // Transform the data to match the expected format
//       const transformedData = {
//         current_month_estimate: data.commission_data.current_month_estimate || 0,
//         last_month_earned: data.commission_data.last_month_earned || 0,
//         total_pending: data.commission_data.total_pending || 0,
//         level_breakdown: data.commission_data.level_breakdown || [],
//         top_performers: data.commission_data.top_performers || [],
//         recent_transactions: data.commission_data.recent_transactions || []
//       };
      
//       setLiveCommissions(transformedData);
//       setCalculationTime(new Date().toLocaleTimeString());
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error(error.message || 'Failed to load live commission data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-4 flex justify-center items-center h-48">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold flex items-center">
//           <BanknotesIcon className="h-5 w-5 mr-2 text-blue-500" />
//           Live Commission Estimates
//         </h2>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={fetchLiveCommissions}
//             className="flex items-center text-xs px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
//           >
//             <ArrowPathIcon className="h-3 w-3 mr-1" />
//             Refresh
//           </button>
//           {calculationTime && (
//             <span className="text-xs text-gray-500">
//               Last updated: {calculationTime}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="text-sm text-gray-500 mb-4 flex items-center">
//         <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
//         <span>
//           These are estimated commissions based on current downline purchases. Final amounts will be calculated at month-end.
//         </span>
//       </div>

//       {liveCommissions ? (
//         <div className="space-y-6">
//           {/* Summary Card */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <div className="text-sm text-blue-700">Current Month Estimate</div>
//               <div className="text-2xl font-bold text-blue-900">
//                 ₹{parseFloat(liveCommissions.current_month_estimate).toFixed(2)}
//               </div>
//             </div>
//             <div className="bg-green-50 p-4 rounded-lg">
//               <div className="text-sm text-green-700">Last Month Earned</div>
//               <div className="text-2xl font-bold text-green-900">
//                 ₹{parseFloat(liveCommissions.last_month_earned).toFixed(2)}
//               </div>
//             </div>
//             <div className="bg-purple-50 p-4 rounded-lg">
//               <div className="text-sm text-purple-700">Total Pending</div>
//               <div className="text-2xl font-bold text-purple-900">
//                 ₹{parseFloat(liveCommissions.total_pending).toFixed(2)}
//               </div>
//             </div>
//           </div>

//           {/* Downline Purchase Breakdown */}
//           <div>
//             <h3 className="font-medium text-gray-700 mb-2">Downline Purchase Breakdown</h3>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
//                     <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Commission</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {liveCommissions.level_breakdown.map((level) => (
//                     <tr key={level.level} className={level.level === 1 ? "bg-blue-50" : ""}>
//                       <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
//                         Level {level.level}
//                       </td>
//                       <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                         {level.member_count}
//                       </td>
//                       <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                         ₹{parseFloat(level.total_purchases).toFixed(2)}
//                       </td>
//                       <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                         {level.commission_rate}%
//                       </td>
//                       <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
//                         ₹{parseFloat(level.estimated_commission).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                   <tr className="bg-gray-50 font-medium">
//                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900" colSpan={4}>
//                       Total Estimated Commission
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
//                       ₹{parseFloat(liveCommissions.current_month_estimate).toFixed(2)}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Top Performers */}
//           {liveCommissions.top_performers && liveCommissions.top_performers.length > 0 && (
//             <div>
//               <h3 className="font-medium text-gray-700 mb-2">Top Performing Downline Members</h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
//                       <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
//                       <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Your Commission</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {liveCommissions.top_performers.map((performer, index) => (
//                       <tr key={index}>
//                         <td className="px-4 py-2 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="text-sm font-medium text-gray-900">{performer.name}</div>
//                             <div className="text-xs text-gray-500 ml-1">({performer.member_id})</div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                           Level {performer.level}
//                         </td>
//                         <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                           {performer.position}
//                         </td>
//                         <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                           ₹{parseFloat(performer.total_purchases).toFixed(2)}
//                         </td>
//                         <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
//                           ₹{parseFloat(performer.your_commission).toFixed(2)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Recent Transactions */}
//           {liveCommissions.recent_transactions && liveCommissions.recent_transactions.length > 0 && (
//             <div>
//               <h3 className="font-medium text-gray-700 mb-2">Recent Downline Purchases</h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                       <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                       <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Your Commission</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {liveCommissions.recent_transactions.map((transaction, index) => (
//                       <tr key={index}>
//                         <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                           {new Date(transaction.date).toLocaleDateString()}
//                         </td>
//                         <td className="px-4 py-2 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{transaction.member_name}</div>
//                         </td>
//                         <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                           Level {transaction.level}
//                         </td>
//                         <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                           {transaction.order_id}
//                         </td>
//                         <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
//                           ₹{parseFloat(transaction.amount).toFixed(2)}
//                         </td>
//                         <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-gray-900">
//                           ₹{parseFloat(transaction.your_commission).toFixed(2)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="bg-yellow-50 p-4 rounded-lg">
//           <p className="text-yellow-700">No commission data available yet. This could be because:</p>
//           <ul className="list-disc ml-5 mt-2 text-yellow-700">
//             <li>The member has no downline purchases yet</li>
//             <li>The commission rates may not be configured properly</li>
//             <li>The member's position doesn't qualify for commissions</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MLMLiveCommissions;

// 'use client'

// import React, { useState, useEffect } from 'react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import { 
//   BanknotesIcon, 
//   UsersIcon, 
//   ArrowTrendingUpIcon, 
//   CalendarIcon, 
//   CheckCircleIcon 
// } from '@heroicons/react/24/outline';

// const MLMLiveCommissions = ({ memberId }) => {
//   const [loading, setLoading] = useState(true);
//   const [commissionData, setCommissionData] = useState(null);
//   const { token } = getTokens();

//   useEffect(() => {
//     if (token && memberId) {
//       fetchCommissionData();
//     }
//   }, [token, memberId]);

//   const fetchCommissionData = async () => {
//     try {
//       setLoading(true);
      
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/mlm/member/${memberId}/live-commissions/`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || errorData.message || 'Failed to fetch commission data');
//       }

//       const data = await response.json();
//       setCommissionData(data);
//     } catch (error) {
//       console.error('Error fetching commission data:', error);
//       toast.error(error.message || 'Error fetching commission data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-10">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!commissionData) {
//     return (
//       <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="ml-3">
//             <p className="text-sm text-yellow-700">
//               Commission data is not available. This may be because:
//             </p>
//             <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
//               <li>The member's position does not allow earning commissions</li>
//               <li>The member has no downline members</li>
//               <li>There was an error fetching the data</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">Current Month Estimate</h3>
//             <ArrowTrendingUpIcon className="text-blue-500 h-6 w-6" />
//           </div>
//           <p className="text-3xl font-bold">₹{parseFloat(commissionData.current_month_estimate).toFixed(2)}</p>
//           <p className="text-sm text-gray-500 mt-2">Estimated earnings for this month</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">Last Month Earned</h3>
//             <CheckCircleIcon className="text-green-500 h-6 w-6" />
//           </div>
//           <p className="text-3xl font-bold">₹{parseFloat(commissionData.last_month_earned).toFixed(2)}</p>
//           <p className="text-sm text-gray-500 mt-2">Total earned last month</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">Pending Payout</h3>
//             <CalendarIcon className="text-orange-500 h-6 w-6" />
//           </div>
//           <p className="text-3xl font-bold">₹{parseFloat(commissionData.total_pending).toFixed(2)}</p>
//           <p className="text-sm text-gray-500 mt-2">Total pending commission</p>
//         </div>
//       </div>
      
//       {/* Level Breakdown */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold mb-4">Level-wise Commission Breakdown</h3>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Commission</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {commissionData.level_breakdown && commissionData.level_breakdown.length > 0 ? (
//                 commissionData.level_breakdown.map((level, index) => (
//                   <tr key={index}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <span className="text-sm font-medium text-gray-900">Level {level.level}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
//                         <span className="text-sm text-gray-500">{level.member_count}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       ₹{parseFloat(level.total_purchases).toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {parseFloat(level.commission_rate).toFixed(2)}%
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
//                       ₹{parseFloat(level.estimated_commission).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
//                     No level data available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
      
//       {/* Top Performing Members */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold mb-4">Top Performing Members</h3>
          
//           {commissionData.top_performers && commissionData.top_performers.length > 0 ? (
//             <div className="space-y-4">
//               {commissionData.top_performers.map((performer, index) => (
//                 <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div>
//                     <p className="font-medium text-gray-900">{performer.name}</p>
//                     <p className="text-sm text-gray-500">Level {performer.level} • {performer.position}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium text-gray-900">₹{parseFloat(performer.total_purchases).toFixed(2)}</p>
//                     <p className="text-sm text-green-600">₹{parseFloat(performer.your_commission).toFixed(2)} commission</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               No top performers data available
//             </div>
//           )}
//         </div>
        
//         {/* Recent Transactions */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          
//           {commissionData.recent_transactions && commissionData.recent_transactions.length > 0 ? (
//             <div className="space-y-3">
//               {commissionData.recent_transactions.map((transaction, index) => (
//                 <div key={index} className="flex items-center p-3 border-b border-gray-100">
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900">{transaction.member_name}</p>
//                     <p className="text-sm text-gray-500">
//                       {new Date(transaction.date).toLocaleDateString()} • Order #{transaction.order_id}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium text-gray-900">₹{parseFloat(transaction.amount).toFixed(2)}</p>
//                     <p className="text-sm text-green-600">₹{parseFloat(transaction.your_commission).toFixed(2)} earned</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               No recent transactions
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Commission Calculation Explanation */}
//       <div className="bg-blue-50 p-6 rounded-lg">
//         <h3 className="text-lg font-semibold mb-3 text-blue-800">How Commissions Are Calculated</h3>
//         <div className="space-y-2 text-sm text-blue-800">
//           <p>
//             <span className="font-medium">Commission Calculation:</span> Based on the difference between your position discount percentage and your downline's position percentage.
//           </p>
//           <p>
//             <span className="font-medium">Monthly Processing:</span> Commissions and BP points are calculated on the 1st of each month.
//           </p>
//           <p>
//             <span className="font-medium">Eligibility Requirements:</span> You must maintain your monthly quota to earn commissions from your downline.
//           </p>
//           <p>
//             <span className="font-medium">Position Upgrades:</span> As you accumulate more BP points, you may qualify for position upgrades which can increase your commission percentage.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MLMLiveCommissions;

// 'use client'

// import React, { useState, useEffect } from 'react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import { 
//   BanknotesIcon, 
//   ArrowPathIcon,
//   UsersIcon, 
//   CalendarIcon,
//   ChartBarIcon,
//   QuestionMarkCircleIcon,
//   ExclamationCircleIcon
// } from '@heroicons/react/24/outline';

// const MLMLiveCommissions = ({ memberId }) => {
//   const [commissionData, setCommissionData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [calculationTime, setCalculationTime] = useState(null);
//   const { token } = getTokens();

//   useEffect(() => {
//     if (token) {
//       fetchLiveCommissions();
//     }
//   }, [token, memberId]);

//   const fetchLiveCommissions = async () => {
//     try {
//       setRefreshing(true);
      
//       // Use API endpoint - we'll pass memberId as a query param if needed
//       let url = `${process.env.NEXT_PUBLIC_API_URL}/mlm/live-commission/`;
//       if (memberId) {
//         url += `?member_id=${memberId}`;
//       }
      
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || errorData.error || 'Failed to fetch live commissions');
//       }
      
//       const data = await response.json();
      
//       if (!data.status) {
//         throw new Error(data.message || 'Failed to load commission data');
//       }
      
//       setCommissionData(data.commission_data);
//       setCalculationTime(new Date().toLocaleTimeString());
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error(error.message || 'Failed to load live commission data');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-48">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold flex items-center">
//           <BanknotesIcon className="h-5 w-5 mr-2 text-blue-500" />
//           Live Commission Dashboard
//         </h2>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={fetchLiveCommissions}
//             disabled={refreshing}
//             className="flex items-center text-xs px-3 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition duration-150 disabled:opacity-50"
//           >
//             {refreshing ? (
//               <>
//                 <div className="animate-spin h-3 w-3 mr-1 border-t-2 border-blue-500 rounded-full"></div>
//                 Refreshing...
//               </>
//             ) : (
//               <>
//                 <ArrowPathIcon className="h-3 w-3 mr-1" />
//                 Refresh
//               </>
//             )}
//           </button>
//           {calculationTime && (
//             <span className="text-xs text-gray-500">
//               Last updated: {calculationTime}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="text-sm text-gray-600 mb-6 bg-blue-50 p-4 rounded-md flex items-start">
//         <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
//         <div>
//           <p className="mb-1">
//             <strong>How commissions work:</strong> You earn commissions based on the difference between your position percentage and your downline's position percentage.
//           </p>
//           <p>
//             This dashboard shows real-time estimates based on the current month's purchases. Final calculations are processed on the 1st of each month.
//           </p>
//         </div>
//       </div>

//       {commissionData ? (
//         <div className="space-y-6">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
//               <div className="text-sm text-blue-700 font-medium mb-1">Current Month Estimate</div>
//               <div className="text-2xl font-bold text-blue-900">
//                 ₹{parseFloat(commissionData.current_month_estimate).toFixed(2)}
//               </div>
//               <div className="text-xs text-blue-600 mt-1">Based on current downline purchases</div>
//             </div>
            
//             <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
//               <div className="text-sm text-green-700 font-medium mb-1">Last Month Earned</div>
//               <div className="text-2xl font-bold text-green-900">
//                 ₹{parseFloat(commissionData.last_month_earned).toFixed(2)}
//               </div>
//               <div className="text-xs text-green-600 mt-1">Already credited to your wallet</div>
//             </div>
            
//             <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 rounded-lg border border-purple-100">
//               <div className="text-sm text-purple-700 font-medium mb-1">Total Pending</div>
//               <div className="text-2xl font-bold text-purple-900">
//                 ₹{parseFloat(commissionData.total_pending).toFixed(2)}
//               </div>
//               <div className="text-xs text-purple-600 mt-1">Available for withdrawal</div>
//             </div>
//           </div>

//           {/* Downline Purchase Breakdown */}
//           <div className="bg-white border border-gray-200 rounded-lg">
//             <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center">
//               <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
//               <h3 className="font-medium text-gray-700">Level-wise Commission Breakdown</h3>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Commission</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {commissionData.level_breakdown && commissionData.level_breakdown.length > 0 ? (
//                     commissionData.level_breakdown.map((level) => (
//                       <tr key={level.level} className={level.level === 1 ? "bg-blue-50" : ""}>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                           Level {level.level}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {level.member_count}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           ₹{parseFloat(level.total_purchases).toFixed(2)}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {parseFloat(level.commission_rate).toFixed(2)}%
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
//                           ₹{parseFloat(level.estimated_commission).toFixed(2)}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">
//                         No level data available. This could be because you don't have any active downline members yet.
//                       </td>
//                     </tr>
//                   )}
                  
//                   {commissionData.level_breakdown && commissionData.level_breakdown.length > 0 && (
//                     <tr className="bg-gray-50 font-medium">
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900" colSpan={4}>
//                         Total Estimated Commission
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
//                         ₹{parseFloat(commissionData.current_month_estimate).toFixed(2)}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Top Performers & Recent Transactions in Tabs */}
//           {(commissionData.top_performers?.length > 0 || commissionData.recent_transactions?.length > 0) && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Top Performers */}
//               {commissionData.top_performers && commissionData.top_performers.length > 0 && (
//                 <div className="bg-white border border-gray-200 rounded-lg">
//                   <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
//                     <h3 className="font-medium text-gray-700">Top Performing Members</h3>
//                   </div>
//                   <div className="divide-y divide-gray-100">
//                     {commissionData.top_performers.map((performer, index) => (
//                       <div key={index} className="p-4 flex items-start justify-between">
//                         <div>
//                           <div className="flex items-center">
//                             <div className="text-sm font-medium text-gray-900">{performer.name}</div>
//                             <div className="ml-2 text-xs text-gray-500">({performer.member_id})</div>
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             Level {performer.level} • {performer.position}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-sm font-medium text-gray-900">₹{parseFloat(performer.total_purchases).toFixed(2)}</div>
//                           <div className="text-xs text-green-600 mt-1">₹{parseFloat(performer.your_commission).toFixed(2)} commission</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Recent Transactions */}
//               {commissionData.recent_transactions && commissionData.recent_transactions.length > 0 && (
//                 <div className="bg-white border border-gray-200 rounded-lg">
//                   <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
//                     <h3 className="font-medium text-gray-700">Recent Downline Purchases</h3>
//                   </div>
//                   <div className="divide-y divide-gray-100">
//                     {commissionData.recent_transactions.map((transaction, index) => (
//                       <div key={index} className="p-4 flex items-start justify-between">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{transaction.member_name}</div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             {new Date(transaction.date).toLocaleDateString()} • Order #{transaction.order_id} • Level {transaction.level}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-sm font-medium text-gray-900">₹{parseFloat(transaction.amount).toFixed(2)}</div>
//                           <div className="text-xs text-green-600 mt-1">₹{parseFloat(transaction.your_commission).toFixed(2)} commission</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
//           <div className="flex">
//             <ExclamationCircleIcon className="h-6 w-6 text-yellow-400 mr-3" />
//             <div>
//               <p className="text-yellow-700 font-medium">No commission data available</p>
//               <p className="text-yellow-600 mt-1">This could be because:</p>
//               <ul className="list-disc ml-5 mt-1 text-yellow-600 text-sm">
//                 <li>Your position doesn't qualify to earn commissions yet</li>
//                 <li>You don't have any active downline members</li>
//                 <li>Your downline members haven't made any purchases this month</li>
//                 <li>Your downline members have equal or higher position percentages</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MLMLiveCommissions;

// 'use client'

// import React, { useState, useEffect } from 'react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';
// import { 
//   BanknotesIcon, 
//   ArrowPathIcon,
//   UsersIcon, 
//   CalendarIcon,
//   ChartBarIcon,
//   QuestionMarkCircleIcon,
//   ExclamationCircleIcon,
//   ArrowTrendingUpIcon,
//   CheckCircleIcon,
//   ShieldCheckIcon,
//   ShieldExclamationIcon,
//   CurrencyRupeeIcon
// } from '@heroicons/react/24/outline';

// const MLMLiveCommissions = ({ memberId }) => {
//   const [commissionData, setCommissionData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [calculationTime, setCalculationTime] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const { token } = getTokens();

//   useEffect(() => {
//     if (token) {
//       fetchLiveCommissions();
//     }
//   }, [token, memberId]);

//   const fetchLiveCommissions = async () => {
//     try {
//       setRefreshing(true);
      
//       // Use API endpoint - we'll pass memberId as a query param if needed
//       let url = `${process.env.NEXT_PUBLIC_API_URL}/mlm/live-commission/`;
//       if (memberId) {
//         url += `?member_id=${memberId}`;
//       }
      
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || errorData.error || 'Failed to fetch live commissions');
//       }
      
//       const data = await response.json();
      
//       if (!data.status) {
//         throw new Error(data.message || 'Failed to load commission data');
//       }
      
//       setCommissionData(data.commission_data);
//       setCalculationTime(new Date().toLocaleTimeString());
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error(error.message || 'Failed to load live commission data');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-48">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   const toggleDetails = () => {
//     setShowDetails(!showDetails);
//   };

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 2
//     }).format(parseFloat(value));
//   };

//   const formatNumber = (value) => {
//     return new Intl.NumberFormat('en-IN').format(parseInt(value));
//   };

//   const getColorForDifference = (difference) => {
//     const diff = parseFloat(difference);
//     if (diff <= 0) return 'text-red-500';
//     if (diff <= 10) return 'text-yellow-500';
//     if (diff <= 20) return 'text-green-500';
//     return 'text-blue-500';
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold flex items-center">
//           <BanknotesIcon className="h-5 w-5 mr-2 text-blue-500" />
//           Live Commission Dashboard
//         </h2>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={fetchLiveCommissions}
//             disabled={refreshing}
//             className="flex items-center text-xs px-3 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition duration-150 disabled:opacity-50"
//           >
//             {refreshing ? (
//               <>
//                 <div className="animate-spin h-3 w-3 mr-1 border-t-2 border-blue-500 rounded-full"></div>
//                 Refreshing...
//               </>
//             ) : (
//               <>
//                 <ArrowPathIcon className="h-3 w-3 mr-1" />
//                 Refresh
//               </>
//             )}
//           </button>
//           {calculationTime && (
//             <span className="text-xs text-gray-500">
//               Last updated: {calculationTime}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Monthly Quota Status */}
//       {commissionData && (
//         <div className={`px-4 py-3 rounded-md mb-4 ${commissionData.monthly_quota_status ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
//           <div className="flex items-center">
//             {commissionData.monthly_quota_status ? (
//               <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
//             ) : (
//               <ShieldExclamationIcon className="h-5 w-5 text-yellow-500 mr-2" />
//             )}
//             <div>
//               <p className={`font-medium ${commissionData.monthly_quota_status ? 'text-green-700' : 'text-yellow-700'}`}>
//                 {commissionData.monthly_quota_status 
//                   ? 'Monthly Quota Status: Maintained' 
//                   : 'Monthly Quota Status: Not Maintained'}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">
//                 {commissionData.monthly_quota_status 
//                   ? 'You are currently meeting your monthly quota requirement and will earn commissions from your downline.' 
//                   : 'You are not currently meeting your monthly quota requirement. You need to make purchases to earn commissions from your downline.'}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="text-sm text-gray-600 mb-6 bg-blue-50 p-4 rounded-md flex items-start">
//         <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
//         <div>
//           <p className="mb-1">
//             <strong>How the Differential Commission Model works:</strong> You earn commissions based on the difference between your position percentage and your downline's position percentage.
//           </p>
//           <p>
//             For example, if your position is at 40% and your downline is at 20%, you earn 20% of their purchases as commission. Next calculation: {commissionData?.next_calculation_date ? new Date(commissionData.next_calculation_date).toLocaleDateString() : 'Loading...'}
//           </p>
//           <button 
//             onClick={toggleDetails} 
//             className="text-blue-600 font-medium mt-1 underline hover:text-blue-800"
//           >
//             {showDetails ? 'Hide Details' : 'Show More Details'}
//           </button>
          
//           {showDetails && (
//             <div className="mt-2 p-3 bg-white rounded border border-blue-100">
//               <ul className="list-disc list-inside space-y-1 text-gray-700">
//                 <li>Your commissions are calculated based on the <strong>difference</strong> in position percentages</li>
//                 <li>If your downline has an equal or higher position than yours, you earn <strong>zero commission</strong> from them</li>
//                 <li>At the end of each month, all your downline's BP points are added to your total</li>
//                 <li>Position upgrades happen automatically when you have enough BP points</li>
//                 <li>You must maintain your monthly quota to earn commissions from your downline</li>
//                 <li>You earn a special ₹1,000 bonus when your directly sponsored members make their first qualifying purchase</li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {commissionData ? (
//         <div className="space-y-6">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
//               <div className="text-sm text-blue-700 font-medium mb-1">Current Month Estimate</div>
//               <div className="text-2xl font-bold text-blue-900">
//                 {formatCurrency(commissionData.current_month_estimate)}
//               </div>
//               <div className="text-xs text-blue-600 mt-1">Based on current downline purchases</div>
//             </div>
            
//             <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
//               <div className="text-sm text-green-700 font-medium mb-1">Last Month Earned</div>
//               <div className="text-2xl font-bold text-green-900">
//                 {formatCurrency(commissionData.last_month_earned)}
//               </div>
//               <div className="text-xs text-green-600 mt-1">Already credited to your wallet</div>
//             </div>
            
//             <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 rounded-lg border border-purple-100">
//               <div className="text-sm text-purple-700 font-medium mb-1">Total Pending</div>
//               <div className="text-2xl font-bold text-purple-900">
//                 {formatCurrency(commissionData.total_pending)}
//               </div>
//               <div className="text-xs text-purple-600 mt-1">Available for withdrawal</div>
//             </div>
//           </div>

//           {/* BP Points and Position Information */}
//           {commissionData.bp_points && (
//             <div className="bg-white border border-gray-200 rounded-lg">
//               <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center">
//                 <ArrowTrendingUpIcon className="h-5 w-5 text-gray-500 mr-2" />
//                 <h3 className="font-medium text-gray-700">BP Points & Position Status</h3>
//               </div>
              
//               <div className="p-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="bg-gray-50 p-3 rounded-md">
//                     <div className="text-sm text-gray-500">Current BP Points</div>
//                     <div className="text-xl font-bold text-gray-800">{formatNumber(commissionData.bp_points.current)}</div>
//                   </div>
                  
//                   <div className="bg-gray-50 p-3 rounded-md">
//                     <div className="text-sm text-gray-500">BP from Downline</div>
//                     <div className="text-xl font-bold text-gray-800">+{formatNumber(commissionData.bp_points.from_downline)}</div>
//                     <div className="text-xs text-gray-500">Will be added on next calculation</div>
//                   </div>
                  
//                   <div className="bg-gray-50 p-3 rounded-md">
//                     <div className="text-sm text-gray-500">BP Needed for Upgrade</div>
//                     <div className="text-xl font-bold text-gray-800">{formatNumber(commissionData.bp_points.needed_for_upgrade)}</div>
//                   </div>
//                 </div>
                
//                 <div className="mt-4 text-sm text-gray-600">
//                   <p>On the first of each month, BP points from your downline members are added to your total, which might qualify you for position upgrades.</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Downline Purchase Breakdown */}
//           <div className="bg-white border border-gray-200 rounded-lg">
//             <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center">
//               <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
//               <h3 className="font-medium text-gray-700">Level-wise Commission Breakdown</h3>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifying</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comm. Rate</th>
//                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Commission</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {commissionData.level_breakdown && commissionData.level_breakdown.length > 0 ? (
//                     commissionData.level_breakdown.map((level) => (
//                       <tr key={level.level} className={level.level === 1 ? "bg-blue-50" : ""}>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                           Level {level.level}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {level.member_count}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           <span className="text-green-600">{level.qualifying_members}</span>
//                           {level.non_qualifying_members > 0 && 
//                             <span className="text-red-500 ml-1">({level.non_qualifying_members} non-qualifying)</span>
//                           }
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {formatCurrency(level.total_purchases)}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {parseFloat(level.commission_rate).toFixed(2)}%
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
//                           {formatCurrency(level.estimated_commission)}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
//                         No level data available. This could be because you don't have any active downline members yet.
//                       </td>
//                     </tr>
//                   )}
                  
//                   {commissionData.level_breakdown && commissionData.level_breakdown.length > 0 && (
//                     <tr className="bg-gray-50 font-medium">
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900" colSpan={5}>
//                         Total Estimated Commission
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
//                         {formatCurrency(commissionData.current_month_estimate)}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Top Performers & Recent Transactions in Tabs */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Top Performers */}
//             <div className="bg-white border border-gray-200 rounded-lg">
//               <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
//                 <h3 className="font-medium text-gray-700">Top Performing Members</h3>
//               </div>
//               <div className="divide-y divide-gray-100">
//                 {commissionData.top_performers && commissionData.top_performers.length > 0 ? (
//                   commissionData.top_performers.map((performer, index) => (
//                     <div key={index} className="p-4 flex items-start justify-between">
//                       <div>
//                         <div className="flex items-center">
//                           <div className="text-sm font-medium text-gray-900">{performer.name}</div>
//                           <div className="ml-2 text-xs text-gray-500">({performer.member_id})</div>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Level {performer.level} • {performer.position} • BP: {performer.total_bp}
//                         </div>
//                         <div className="text-xs mt-1">
//                           <span>Diff: </span>
//                           <span className={getColorForDifference(performer.difference)}>
//                             {performer.difference}%
//                           </span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium text-gray-900">{formatCurrency(performer.total_purchases)}</div>
//                         <div className="text-xs text-green-600 mt-1">{formatCurrency(performer.your_commission)} commission</div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-6 text-center text-gray-500">
//                     No top performers data available yet
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Recent Transactions */}
//             <div className="bg-white border border-gray-200 rounded-lg">
//               <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
//                 <h3 className="font-medium text-gray-700">Recent Downline Purchases</h3>
//               </div>
//               <div className="divide-y divide-gray-100">
//                 {commissionData.recent_transactions && commissionData.recent_transactions.length > 0 ? (
//                   commissionData.recent_transactions.map((transaction, index) => (
//                     <div key={index} className="p-4 flex items-start justify-between">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{transaction.member_name}</div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {new Date(transaction.date).toLocaleDateString()} • Order #{transaction.order_id} • Level {transaction.level}
//                         </div>
//                         <div className="text-xs mt-1 flex items-center">
//                           <span>Diff: </span>
//                           <span className={getColorForDifference(transaction.difference)}>
//                             {transaction.difference}%
//                           </span>
//                           {transaction.bp_points > 0 && (
//                             <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
//                               +{transaction.bp_points} BP
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium text-gray-900">{formatCurrency(transaction.amount)}</div>
//                         <div className={`text-xs mt-1 ${parseFloat(transaction.your_commission) > 0 ? 'text-green-600' : 'text-red-500'}`}>
//                           {parseFloat(transaction.your_commission) > 0 
//                             ? `${formatCurrency(transaction.your_commission)} commission` 
//                             : 'No commission (equal/higher position)'}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-6 text-center text-gray-500">
//                     No recent transactions available
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
//           <div className="flex">
//             <ExclamationCircleIcon className="h-6 w-6 text-yellow-400 mr-3" />
//             <div>
//               <p className="text-yellow-700 font-medium">No commission data available</p>
//               <p className="text-yellow-600 mt-1">This could be because:</p>
//               <ul className="list-disc ml-5 mt-1 text-yellow-600 text-sm">
//                 <li>Your position doesn't qualify to earn commissions yet</li>
//                 <li>You don't have any active downline members</li>
//                 <li>Your downline members haven't made any purchases this month</li>
//                 <li>Your downline members have equal or higher position percentages</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MLMLiveCommissions;



'use client'

import React, { useState, useEffect } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  BanknotesIcon, 
  ArrowPathIcon,
  UsersIcon, 
  ChartBarIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  InformationCircleIcon,
  CurrencyRupeeIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const MLMLiveCommissions = ({ memberId }) => {
  const [commissionData, setCommissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calculationTime, setCalculationTime] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('levels'); // 'levels', 'topPerformers', 'transactions'
  const { token } = getTokens();

  useEffect(() => {
    if (token) {
      fetchLiveCommissions();
    }
  }, [token, memberId]);

  const fetchLiveCommissions = async () => {
    try {
      setRefreshing(true);
      
      // Use API endpoint - we'll pass memberId as a query param if needed
      let url = `${process.env.NEXT_PUBLIC_API_URL}/mlm/live-commission/`;
      if (memberId) {
        url += `?member_id=${memberId}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch live commissions');
      }
      
      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Failed to load commission data');
      }
      
      setCommissionData(data.commission_data);
      setCalculationTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to load live commission data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper functions
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(parseFloat(value || 0));
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(parseInt(value || 0));
  };

  const formatPercentage = (value) => {
    return parseFloat(value || 0).toFixed(2) + '%';
  };

  const getColorForDifference = (difference) => {
    const diff = parseFloat(difference || 0);
    if (diff <= 0) return 'text-red-500';
    if (diff <= 10) return 'text-yellow-500';
    if (diff <= 20) return 'text-green-500';
    return 'text-blue-500';
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <BanknotesIcon className="h-5 w-5 mr-2 text-blue-500" />
          Live Commission Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLiveCommissions}
            disabled={refreshing}
            className="flex items-center text-xs px-3 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition duration-150 disabled:opacity-50"
          >
            {refreshing ? (
              <>
                <div className="animate-spin h-3 w-3 mr-1 border-t-2 border-blue-500 rounded-full"></div>
                Refreshing...
              </>
            ) : (
              <>
                <ArrowPathIcon className="h-3 w-3 mr-1" />
                Refresh
              </>
            )}
          </button>
          {calculationTime && (
            <span className="text-xs text-gray-500">
              Last updated: {calculationTime}
            </span>
          )}
        </div>
      </div>

      {/* Monthly Quota Status */}
      {commissionData && (
        <div className={`px-4 py-3 rounded-md mb-4 ${commissionData.monthly_quota_status ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-start">
            {commissionData.monthly_quota_status ? (
              <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <ShieldExclamationIcon className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className={`font-medium ${commissionData.monthly_quota_status ? 'text-green-700' : 'text-yellow-700'}`}>
                {commissionData.monthly_quota_status 
                  ? 'Monthly Quota Status: Maintained' 
                  : 'Monthly Quota Status: Not Maintained'}
              </p>
              {/* <p className="text-sm text-gray-600 mt-1">
                {commissionData.monthly_quota_status 
                  ? 'You are currently meeting your monthly quota requirement and will earn commissions from your downline.' 
                  : `You need to purchase at least ${formatCurrency(commissionData.monthly_quota_remaining || 0)} more this month to qualify for downline commissions.`}
              </p> */}

              {!commissionData.monthly_quota_status && (
                <div className="text-sm text-yellow-700">
                  {parseFloat(commissionData.monthly_quota_remaining || 0) > 0
                    ? `You need to purchase at least ${formatCurrency(commissionData.monthly_quota_remaining)} more this month to qualify for downline commissions.`
                    : 'You have met your monthly quota requirement.'}
                </div>
              )}
              {!commissionData.monthly_quota_status && (
                <div className="mt-2">
                  <a 
                    href="/shop"
                    className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-md hover:bg-yellow-200"
                  >
                    <CreditCardIcon className="h-4 w-4 mr-1" />
                    Shop Now to Maintain Quota
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 mb-6 bg-blue-50 p-4 rounded-md flex items-start">
        <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="mb-1">
            <strong>How the Differential Commission Model works:</strong> You earn commissions based on the difference between your position percentage and your downline's position percentage.
          </p>
          <p>
            For example, if your position is at 40% and your downline is at 20%, you earn 20% of their purchases as commission. Next calculation: {commissionData?.next_calculation_date ? new Date(commissionData.next_calculation_date).toLocaleDateString() : 'Loading...'}
          </p>
          <button 
            onClick={toggleDetails} 
            className="text-blue-600 font-medium mt-1 underline hover:text-blue-800"
          >
            {showDetails ? 'Hide Details' : 'Show More Details'}
          </button>
          
          {showDetails && (
            <div className="mt-2 p-3 bg-white rounded border border-blue-100">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Your commissions are calculated based on the <strong>difference</strong> in position discount percentages</li>
                <li>If your downline has an equal or higher position than yours, you earn <strong>zero commission</strong> from them</li>
                <li>At the end of each month, all your downline's BP points are added to your total</li>
                <li>Position upgrades happen automatically when you have enough BP points</li>
                <li>You must maintain your monthly quota to earn commissions from your downline</li>
                <li>You earn a special ₹1,000 bonus when your directly sponsored members make their first qualifying purchase</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {commissionData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-700 font-medium mb-1">Current Month Estimate</div>
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(commissionData.current_month_estimate)}
              </div>
              <div className="text-xs text-blue-600 mt-1">Based on current downline purchases</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-700 font-medium mb-1">Last Month Earned</div>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(commissionData.last_month_earned)}
              </div>
              <div className="text-xs text-green-600 mt-1">Already credited to your wallet</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 rounded-lg border border-purple-100">
              <div className="text-sm text-purple-700 font-medium mb-1">Total Pending</div>
              <div className="text-2xl font-bold text-purple-900">
                {formatCurrency(commissionData.total_pending)}
              </div>
              <div className="text-xs text-purple-600 mt-1">
                Available for withdrawal
                {parseFloat(commissionData.total_pending) > 0 && (
                  <a href="/dashboard/wallet" className="ml-2 underline">Withdraw</a>
                )}
              </div>
            </div>
          </div>

          {/* BP Points and Position Information */}
          {commissionData.bp_points && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="font-medium text-gray-700">BP Points & Position Status</h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">Current BP Points</div>
                    <div className="text-xl font-bold text-gray-800">{formatNumber(commissionData.bp_points?.current || 0)}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">BP from Downline</div>
                    <div className="text-xl font-bold text-gray-800">+{formatNumber(commissionData.bp_points?.from_downline || 0)}</div>
                    <div className="text-xs text-gray-500">Will be added on next calculation</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">BP Needed for Upgrade</div>
                    <div className="text-xl font-bold text-gray-800">{formatNumber(commissionData.bp_points?.needed_for_upgrade || 0)}</div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>On the first of each month, BP points from your downline members are added to your total, which might qualify you for position upgrades.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setActiveTab('levels')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'levels' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Level Breakdown
              </button>
              <button
                onClick={() => setActiveTab('topPerformers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'topPerformers' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Top Performers
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'transactions' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Recent Transactions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {/* Levels Tab */}
            {activeTab === 'levels' && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="font-medium text-gray-700">Level-wise Commission Breakdown</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifying</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comm. Rate</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Commission</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {commissionData.level_breakdown && commissionData.level_breakdown.length > 0 ? (
                        commissionData.level_breakdown.map((level) => (
                          <tr key={level.level} className={level.level === 1 ? "bg-blue-50" : ""}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              Level {level.level}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {level.member_count || 0}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <span className="text-green-600">{level.qualifying_members || 0}</span>
                              {(level.non_qualifying_members || 0) > 0 && 
                                <span className="text-red-500 ml-1">({level.non_qualifying_members} non-qualifying)</span>
                              }
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(level.total_purchases)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatPercentage(level.commission_rate)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                              {formatCurrency(level.estimated_commission)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                            No level data available. This could be because you don't have any active downline members yet.
                          </td>
                        </tr>
                      )}
                      
                      {commissionData.level_breakdown && commissionData.level_breakdown.length > 0 && (
                        <tr className="bg-gray-50 font-medium">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900" colSpan={5}>
                            Total Estimated Commission
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                            {formatCurrency(commissionData.current_month_estimate)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Members are considered "qualifying" if they have a lower position percentage than you and have maintained their monthly quota.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Top Performers Tab */}
            {activeTab === 'topPerformers' && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <h3 className="font-medium text-gray-700">Top Performing Members</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {commissionData.top_performers && commissionData.top_performers.length > 0 ? (
                    commissionData.top_performers.map((performer, index) => (
                      <div key={index} className="p-4 flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{performer.name}</div>
                            <div className="ml-2 text-xs text-gray-500">({performer.member_id})</div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Level {performer.level} • {performer.position} • BP: {performer.total_bp || 0}
                          </div>
                          <div className="text-xs mt-1 flex items-center">
                            <span>Your %: {performer.your_percentage || 0}% • </span>
                            <span>Their %: {performer.position_percentage || 0}% • </span>
                            <span>Diff: </span>
                            <span className={getColorForDifference(performer.difference)}>
                              {performer.difference || 0}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(performer.total_purchases)}</div>
                          <div className="text-xs text-green-600 mt-1">{formatCurrency(performer.your_commission)} commission</div>
                          {performer.bp_earned && (
                            <div className="text-xs text-blue-500 mt-1">+{performer.bp_earned} BP to you</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No top performers data available yet. This could be because your downline members haven't made any purchases this month.
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Members are ranked based on the commission they generate for you. The "Diff" percentage shows the difference between your position percentage and theirs.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <h3 className="font-medium text-gray-700">Recent Downline Purchases</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {commissionData.recent_transactions && commissionData.recent_transactions.length > 0 ? (
                    commissionData.recent_transactions.map((transaction, index) => (
                      <div key={index} className="p-4 flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.member_name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(transaction.date).toLocaleDateString()} • Order #{transaction.order_id} • Level {transaction.level}
                          </div>
                          <div className="text-xs mt-1 flex items-center flex-wrap">
                            <span>Your %: {transaction.your_percentage || 0}% • </span>
                            <span>Their %: {transaction.their_percentage || 0}% • </span>
                            <span>Diff: </span>
                            <span className={getColorForDifference(transaction.difference)}>
                              {transaction.difference || 0}%
                            </span>
                            {(transaction.bp_points || 0) > 0 && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                +{transaction.bp_points} BP
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(transaction.amount)}</div>
                          <div className={`text-xs mt-1 ${parseFloat(transaction.your_commission) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {parseFloat(transaction.your_commission) > 0 
                              ? `${formatCurrency(transaction.your_commission)} commission` 
                              : 'No commission (equal/higher position)'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No recent transactions available. When your downline members make purchases, they will appear here.
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                    <span>These are recent purchases made by your downline members. The "Diff" percentage shows the difference between your position percentage and theirs, which determines your commission.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* First Purchase Bonuses */}
          {commissionData.pending_bonuses && commissionData.pending_bonuses.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center">
                <CurrencyRupeeIcon className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-gray-700">Pending First Purchase Bonuses</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  When your directly sponsored members make their first qualifying purchase, you'll receive a ₹1,000 bonus.
                </p>
                <div className="grid gap-3">
                  {commissionData.pending_bonuses.map((bonus, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-md border border-green-100">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{bonus.name}</div>
                          <div className="text-xs text-gray-500">Joined: {new Date(bonus.join_date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-700">₹{bonus.bonus_amount}</div>
                          <div className="text-xs text-gray-500">
                            Needs to purchase: {formatCurrency(bonus.quota_required)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <ExclamationCircleIcon className="h-6 w-6 text-yellow-400 mr-3 flex-shrink-0" />
            <div>
              <p className="text-yellow-700 font-medium">No commission data available</p>
              <p className="text-yellow-600 mt-1">This could be because:</p>
              <ul className="list-disc ml-5 mt-1 text-yellow-600 text-sm">
                <li>Your position doesn't qualify to earn commissions yet</li>
                <li>You don't have any active downline members</li>
                <li>Your downline members haven't made any purchases this month</li>
                <li>Your downline members have equal or higher position percentages</li>
              </ul>
              <div className="mt-3">
                <a 
                  href="/dashboard/network/invite"
                  className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-md hover:bg-yellow-200"
                >
                  <UsersIcon className="h-4 w-4 mr-1" />
                  Invite New Members
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLMLiveCommissions;