
// 'use client'
// import React, { useState, useEffect } from 'react';
// import { CreditCard, ArrowDownRight, ArrowUpRight, Calendar, DollarSign, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
// import { getTokens } from '@/utils/cookies';
// import { toast } from 'react-hot-toast';

// const MLMWalletDashboard = () => {
//   const [wallet, setWallet] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [withdrawalRequests, setWithdrawalRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [withdrawalAmount, setWithdrawalAmount] = useState('');
//   const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
//   const [withdrawalEnabled, setWithdrawalEnabled] = useState(false);
//   const [daysUntilNextWithdrawal, setDaysUntilNextWithdrawal] = useState(0);
//   const [nextCommissionDate, setNextCommissionDate] = useState('');

//   const { token } = getTokens();

//   useEffect(() => {
//     if (token) {
//       fetchWalletData();
//       fetchTransactions();
//       fetchWithdrawalRequests();
//       checkWithdrawalEligibility();
//       calculateNextCommissionDate();
//     }
//   }, [token]);

//   const fetchWalletData = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to fetch wallet data');
//       }
      
//       const data = await response.json();
//       console.log('wallet data ', data)

//       setWallet(data.length > 0 ? data[0] : null);
//     } catch (error) {
//       toast.error(error.message || 'Error fetching wallet data');
//       console.error('Wallet fetch error:', error);
//     }
//   };

//   const fetchTransactions = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet-transactions/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to fetch transactions');
//       }
      
//       const data = await response.json();
//       console.log('wallet-transactions data ', data)
//       setTransactions(data);
//     } catch (error) {
//       toast.error(error.message || 'Error fetching transactions');
//       console.error('Transactions fetch error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWithdrawalRequests = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/withdrawal-requests/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to fetch withdrawal requests');
//       }
      
//       const data = await response.json();
//       console.log('wallet-requests data ', data)

//       setWithdrawalRequests(data);
//     } catch (error) {
//       console.error('Withdrawal requests fetch error:', error);
//     }
//   };

//   const checkWithdrawalEligibility = () => {
//     const today = new Date();
//     const day = today.getDate();
    
//     // Withdrawal is only allowed before the 15th of the month
//     const isWithdrawalEnabled = day <= 15;
//     setWithdrawalEnabled(isWithdrawalEnabled);
    
//     if (!isWithdrawalEnabled) {
//       // Calculate days until next month's 1st
//       const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
//       const daysUntil = Math.ceil((nextMonth - today) / (1000 * 60 * 60 * 24));
//       setDaysUntilNextWithdrawal(daysUntil);
//     } else {
//       // Calculate days until the 15th if we're before the 15th
//       const daysUntil = 15 - day;
//       setDaysUntilNextWithdrawal(daysUntil);
//     }
//   };

//   const calculateNextCommissionDate = () => {
//     const today = new Date();
//     let nextCommissionDate;
    
//     // If today is before the 1st of next month, next commission is on the 1st of next month
//     if (today.getDate() < 28) {
//       nextCommissionDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
//     } else {
//       // If we're close to month end, show the month after next
//       nextCommissionDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
//     }
    
//     setNextCommissionDate(nextCommissionDate.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     }));
//   };

//   const handleWithdrawalRequest = async () => {
//     try {
//       if (!withdrawalAmount || isNaN(withdrawalAmount) || parseFloat(withdrawalAmount) <= 0) {
//         toast.error('Please enter a valid amount');
//         return;
//       }

//       if (parseFloat(withdrawalAmount) > wallet?.balance) {
//         toast.error('Insufficient balance');
//         return;
//       }

//       // Check if withdrawal is allowed (before 15th of the month)
//       if (!withdrawalEnabled) {
//         toast.error('Withdrawals are only allowed before the 15th of each month');
//         return;
//       }

//       // Check if there's already a pending withdrawal request
//       const hasPendingRequest = withdrawalRequests.some(req => req.status === 'PENDING');
//       if (hasPendingRequest) {
//         toast.error('You already have a pending withdrawal request');
//         return;
//       }

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/withdraw/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           amount: parseFloat(withdrawalAmount)
//         })
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || error.message || 'Withdrawal request failed');
//       }

//       await response.json();
//       toast.success('Withdrawal request submitted successfully');
//       setWithdrawalAmount('');
//       setShowWithdrawalModal(false);
      
//       // Refresh data
//       await Promise.all([
//         fetchWalletData(),
//         fetchTransactions(),
//         fetchWithdrawalRequests()
//       ]);
//     } catch (error) {
//       toast.error(error.message || 'Error submitting withdrawal request');
//       console.error('Withdrawal error:', error);
//     }
//   };

//   const getTransactionIcon = (type) => {
//     switch (type) {
//       case 'COMMISSION':
//         return <ArrowUpRight className="text-green-500" />;
//       case 'WITHDRAWAL':
//         return <ArrowDownRight className="text-red-500" />;
//       case 'REFUND':
//         return <ArrowUpRight className="text-blue-500" />;
//       default:
//         return <DollarSign className="text-gray-500" />;
//     }
//   };

//   const getTransactionStatus = (transaction) => {
//     const statusClasses = {
//       PENDING: 'bg-yellow-100 text-yellow-800',
//       COMPLETED: 'bg-green-100 text-green-800',
//       REJECTED: 'bg-red-100 text-red-800',
//       APPROVED: 'bg-green-100 text-green-800',
//       default: 'bg-gray-100 text-gray-800'
//     };

//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//         statusClasses[transaction.status] || statusClasses.default
//       }`}>
//         {transaction.status}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Commission Date Banner */}
//       <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
//         <div className="flex items-center">
//           <CalendarIcon className="text-blue-500 mr-3" />
//           <div>
//             <h3 className="font-medium text-blue-800">Next Commission Calculation: {nextCommissionDate}</h3>
//             <p className="text-sm text-blue-600">
//               Monthly commissions and BP points are calculated on the 1st of every month. 
//               Make sure your downline maintains their monthly quotas.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Wallet Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">Available Balance</h3>
//             <CreditCard className="text-green-500" />
//           </div>
//           <p className="text-3xl font-bold">₹{wallet?.balance?.toFixed(2) || '0.00'}</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">Total Earnings</h3>
//             <ArrowUpRight className="text-green-500" />
//           </div>
//           <p className="text-3xl font-bold">₹{wallet?.total_earnings?.toFixed(2) || '0.00'}</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">Pending Withdrawals</h3>
//             <Calendar className="text-orange-500" />
//           </div>
//           <p className="text-3xl font-bold">₹{wallet?.pending_withdrawals?.toFixed(2) || '0.00'}</p>
//         </div>
//       </div>

//       {/* Withdrawal Button & Info */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Withdrawal Options</h3>
//           {withdrawalEnabled ? (
//             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
//               Withdrawals Open
//             </span>
//           ) : (
//             <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
//               Withdrawals Closed
//             </span>
//           )}
//         </div>
        
//         <div className="mb-4">
//           {withdrawalEnabled ? (
//             <p className="text-sm text-gray-600">
//               You can request withdrawals until the 15th of this month. 
//               <strong> {daysUntilNextWithdrawal} days remaining</strong> to make a withdrawal request.
//             </p>
//           ) : (
//             <div className="flex items-start">
//               <AlertTriangle className="text-orange-500 mr-2 mt-0.5" size={18} />
//               <p className="text-sm text-gray-600">
//                 Withdrawals are only allowed before the 15th of each month. 
//                 <strong> {daysUntilNextWithdrawal} days remaining</strong> until next withdrawal window.
//               </p>
//             </div>
//           )}
//         </div>
        
//         <button
//           onClick={() => setShowWithdrawalModal(true)}
//           disabled={!withdrawalEnabled}
//           className={`px-6 py-2 rounded-lg transition-colors ${
//             withdrawalEnabled 
//               ? 'bg-green-600 text-white hover:bg-green-700' 
//               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//           }`}
//         >
//           Request Withdrawal
//         </button>
//       </div>

//       {/* Pending Withdrawal Requests */}
//       {withdrawalRequests.some(req => req.status === 'PENDING') && (
//         <div className="bg-white rounded-lg shadow-md mb-8">
//           <div className="p-6 border-b">
//             <h2 className="text-xl font-semibold">Pending Withdrawal Requests</h2>
//           </div>
//           <div className="p-6">
//             {withdrawalRequests.filter(req => req.status === 'PENDING')
//               .map(request => (
//                 <div key={request.id} className="bg-yellow-50 p-4 rounded-lg">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-medium">Pending Withdrawal Request</span>
//                     <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
//                       Pending
//                     </span>
//                   </div>
//                   <div className="mb-3">
//                     <span className="text-2xl font-bold">₹{request.amount.toFixed(2)}</span>
//                     <span className="text-gray-500 ml-2">requested on {new Date(request.created_at).toLocaleDateString()}</span>
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     Your withdrawal request is being reviewed. This process typically takes 2-3 business days.
//                   </p>
//                 </div>
//               ))}
//           </div>
//         </div>
//       )}

//       {/* Transaction History */}
//       <div className="bg-white rounded-lg shadow-md">
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-semibold">Transaction History</h2>
//         </div>
//         <div className="overflow-x-auto">
//           {transactions.length > 0 ? (
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {transactions.map((transaction) => (
//                   <tr key={transaction.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {getTransactionIcon(transaction.transaction_type)}
//                         <span className="ml-2">{transaction.transaction_type}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={transaction.transaction_type === 'WITHDRAWAL' ? 'text-red-600' : 'text-green-600'}>
//                         {transaction.transaction_type === 'WITHDRAWAL' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">{transaction.description}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {new Date(transaction.created_at).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {getTransactionStatus(transaction)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               No transactions found
//             </div>
//           )}
//         </div>
//       </div>

//       {/* BP Points Section */}
//       <div className="bg-white rounded-lg shadow-md mt-6 p-6">
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold">BP Points Information</h2>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h3 className="font-medium mb-2">How BP Points Work</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Business Points (BP) are accumulated through purchases and from your downline members.
//               On the 1st of each month, BP points from your direct downline are added to your total.
//               Higher BP points can qualify you for position upgrades.
//             </p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="font-medium">Your Total BP Points</h3>
//               <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
//                 BP Points
//               </span>
//             </div>
//             <p className="text-3xl font-bold mb-2">{wallet?.total_bp || 0}</p>
//             <p className="text-sm text-gray-600">
//               BP points from your downline will be added on {nextCommissionDate}.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Withdrawal Modal */}
//       {showWithdrawalModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
//             <div className="mb-6">
//               <p className="text-sm text-gray-600 mb-4">
//                 <span className="flex items-center text-amber-600 mb-2">
//                   <AlertTriangle size={16} className="mr-1" />
//                   Withdrawal requests can only be made before the 15th of each month.
//                 </span>
//                 Your request will be processed within 2-3 business days.
//               </p>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">Amount</label>
//               <input
//                 type="number"
//                 value={withdrawalAmount}
//                 onChange={(e) => setWithdrawalAmount(e.target.value)}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
//                 placeholder="Enter amount"
//                 min="0"
//                 max={wallet?.balance}
//                 step="0.01"
//               />
//               <p className="text-sm text-gray-500 mt-1">
//                 Available Balance: ₹{wallet?.balance?.toFixed(2) || '0.00'}
//               </p>
//             </div>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setShowWithdrawalModal(false)}
//                 className="px-4 py-2 border rounded hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleWithdrawalRequest}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 disabled={!withdrawalAmount || withdrawalAmount <= 0}
//               >
//                 Submit Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MLMWalletDashboard;

'use client'
import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowDownRight, ArrowUpRight, Calendar, DollarSign, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';

const MLMWalletDashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalEnabled, setWithdrawalEnabled] = useState(false);
  const [daysUntilNextWithdrawal, setDaysUntilNextWithdrawal] = useState(0);
  const [nextCommissionDate, setNextCommissionDate] = useState('');

  const { token } = getTokens();

  useEffect(() => {
    if (token) {
      fetchWalletData();
      fetchTransactions();
      fetchWithdrawalRequests();
      checkWithdrawalEligibility();
      calculateNextCommissionDate();
    }
  }, [token]);

  const fetchWalletData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch wallet data');
      }
      
      const data = await response.json();
      console.log('Wallet data:', data);

      // Check if data is an array and has at least one item
      if (Array.isArray(data) && data.length > 0) {
        setWallet(data[0]);
      } else if (data && typeof data === 'object') {
        // If it's a single object, use it directly
        setWallet(data);
      } else {
        console.error('Unexpected wallet data format:', data);
        setWallet(null);
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching wallet data');
      console.error('Wallet fetch error:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet-transactions/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch transactions');
      }
      
      const data = await response.json();
      console.log('Wallet transactions data:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error('Unexpected transactions data format:', data);
        setTransactions([]);
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching transactions');
      console.error('Transactions fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalRequests = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/withdrawal-requests/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch withdrawal requests');
      }
      
      const data = await response.json();
      console.log('Withdrawal requests data:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setWithdrawalRequests(data);
      } else {
        console.error('Unexpected withdrawal requests data format:', data);
        setWithdrawalRequests([]);
      }
    } catch (error) {
      console.error('Withdrawal requests fetch error:', error);
    }
  };

  const checkWithdrawalEligibility = () => {
    const today = new Date();
    const day = today.getDate();
    
    // FIXED: Withdrawal is only allowed AFTER the 15th of the month (not before)
    const isWithdrawalEnabled = day > 15;
    setWithdrawalEnabled(isWithdrawalEnabled);
    
    if (isWithdrawalEnabled) {
      // If it's after the 15th, calculate days until end of month
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const daysUntil = lastDay - day;
      setDaysUntilNextWithdrawal(daysUntil);
    } else {
      // If it's before the 15th, calculate days until the 16th
      const daysUntil = 16 - day; // 16th day (after 15th)
      setDaysUntilNextWithdrawal(daysUntil);
    }
  };

  const calculateNextCommissionDate = () => {
    const today = new Date();
    let nextCommissionDate;
    
    // If today is before the 1st of next month, next commission is on the 1st of next month
    if (today.getDate() < 28) {
      nextCommissionDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    } else {
      // If we're close to month end, show the month after next
      nextCommissionDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    }
    
    setNextCommissionDate(nextCommissionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  };

  const handleWithdrawalRequest = async () => {
    try {
      if (!withdrawalAmount || isNaN(withdrawalAmount) || parseFloat(withdrawalAmount) <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      if (!wallet?.balance || parseFloat(withdrawalAmount) > wallet.balance) {
        toast.error('Insufficient balance');
        return;
      }

      // Check if withdrawal is allowed (after 15th of the month)
      if (!withdrawalEnabled) {
        toast.error('Withdrawals are only allowed after the 15th of each month');
        return;
      }

      // Check if there's already a pending withdrawal request
      const hasPendingRequest = withdrawalRequests.some(req => req.status === 'PENDING');
      if (hasPendingRequest) {
        toast.error('You already have a pending withdrawal request');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/withdraw/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawalAmount)
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Withdrawal request failed');
      }

      await response.json();
      toast.success('Withdrawal request submitted successfully');
      setWithdrawalAmount('');
      setShowWithdrawalModal(false);
      
      // Refresh data
      await Promise.all([
        fetchWalletData(),
        fetchTransactions(),
        fetchWithdrawalRequests()
      ]);
    } catch (error) {
      toast.error(error.message || 'Error submitting withdrawal request');
      console.error('Withdrawal error:', error);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'COMMISSION':
        return <ArrowUpRight className="text-green-500" />;
      case 'WITHDRAWAL':
        return <ArrowDownRight className="text-red-500" />;
      case 'REFUND':
        return <ArrowUpRight className="text-blue-500" />;
      default:
        return <DollarSign className="text-gray-500" />;
    }
  };

  const getTransactionStatus = (transaction) => {
    // Fallback to a default status if none is provided
    const status = transaction.status || 'COMPLETED';
    
    const statusClasses = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      APPROVED: 'bg-green-100 text-green-800',
      default: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusClasses[status] || statusClasses.default
      }`}>
        {status}
      </span>
    );
  };

  // Helper function to safely get number values
  const safeNumber = (value) => {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Commission Date Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
        <div className="flex items-center">
          <CalendarIcon className="text-blue-500 mr-3" />
          <div>
            <h3 className="font-medium text-blue-800">Next Commission Calculation: {nextCommissionDate}</h3>
            <p className="text-sm text-blue-600">
              Monthly commissions and BP points are calculated on the 1st of every month. 
              Make sure your downline maintains their monthly quotas.
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Available Balance</h3>
            <CreditCard className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">₹{safeNumber(wallet?.balance).toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Total Earnings</h3>
            <ArrowUpRight className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">₹{safeNumber(wallet?.total_earnings).toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Pending Withdrawals</h3>
            <Calendar className="text-orange-500" />
          </div>
          <p className="text-3xl font-bold">₹{safeNumber(wallet?.pending_withdrawals).toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Withdrawal Button & Info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Withdrawal Options</h3>
          {withdrawalEnabled ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Withdrawals Open
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
              Withdrawals Closed
            </span>
          )}
        </div>
        
        <div className="mb-4">
          {withdrawalEnabled ? (
            <p className="text-sm text-gray-600">
              You can request withdrawals after the 15th of this month. 
              <strong> {daysUntilNextWithdrawal} days remaining</strong> in the current withdrawal window.
            </p>
          ) : (
            <div className="flex items-start">
              <AlertTriangle className="text-orange-500 mr-2 mt-0.5" size={18} />
              <p className="text-sm text-gray-600">
                Withdrawals are only allowed after the 15th of each month. 
                <strong> {daysUntilNextWithdrawal} days remaining</strong> until the withdrawal window opens.
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowWithdrawalModal(true)}
          disabled={!withdrawalEnabled}
          className={`px-6 py-2 rounded-lg transition-colors ${
            withdrawalEnabled 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Request Withdrawal
        </button>
      </div>

      {/* Pending Withdrawal Requests */}
      {withdrawalRequests.some(req => req.status === 'PENDING') && (
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Pending Withdrawal Requests</h2>
          </div>
          <div className="p-6">
            {withdrawalRequests.filter(req => req.status === 'PENDING')
              .map(request => (
                <div key={request.id} className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Pending Withdrawal Request</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      Pending
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold">₹{safeNumber(request.amount).toFixed(2)}</span>
                    <span className="text-gray-500 ml-2">requested on {new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your withdrawal request is being reviewed. This process typically takes 2-3 business days.
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          {transactions.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.transaction_type)}
                        <span className="ml-2">{transaction.transaction_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={transaction.transaction_type === 'WITHDRAWAL' ? 'text-red-600' : 'text-green-600'}>
                        {transaction.transaction_type === 'WITHDRAWAL' ? '-' : '+'}₹{safeNumber(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{transaction.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTransactionStatus(transaction)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          )}
        </div>
      </div>

      {/* BP Points Section */}
      <div className="bg-white rounded-lg shadow-md mt-6 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">BP Points Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">How BP Points Work</h3>
            <p className="text-sm text-gray-600 mb-4">
              Business Points (BP) are accumulated through purchases and from your downline members.
              On the 1st of each month, BP points from your direct downline are added to your total.
              Higher BP points can qualify you for position upgrades.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Your Total BP Points</h3>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                BP Points
              </span>
            </div>
            <p className="text-3xl font-bold mb-2">{safeNumber(wallet?.total_bp) || 0}</p>
            <p className="text-sm text-gray-600">
              BP points from your downline will be added on {nextCommissionDate}.
            </p>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                <span className="flex items-center text-amber-600 mb-2">
                  <AlertTriangle size={16} className="mr-1" />
                  Withdrawal requests can only be made after the 15th of each month.
                </span>
                Your request will be processed within 2-3 business days.
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                placeholder="Enter amount"
                min="0"
                max={wallet?.balance}
                step="0.01"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available Balance: ₹{safeNumber(wallet?.balance).toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdrawalRequest}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={!withdrawalAmount || withdrawalAmount <= 0}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLMWalletDashboard;