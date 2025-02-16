'use client'
import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowDownRight, ArrowUpRight, Calendar, DollarSign } from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';

const MLMWalletDashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  const { token } = getTokens();

  useEffect(() => {
    if (token) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [token]);

  const fetchWalletData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet-transactions/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch wallet data');
      }
      
      const data = await response.json();
      setWallet(data[0]); // Assuming the first wallet is the user's wallet
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
      setTransactions(data);
    } catch (error) {
      toast.error(error.message || 'Error fetching transactions');
      console.error('Transactions fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async () => {
    try {
      if (!withdrawalAmount || isNaN(withdrawalAmount) || parseFloat(withdrawalAmount) <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      if (parseFloat(withdrawalAmount) > wallet?.balance) {
        toast.error('Insufficient balance');
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
        throw new Error(error.message || 'Withdrawal request failed');
      }

      await response.json();
      toast.success('Withdrawal request submitted successfully');
      setWithdrawalAmount('');
      setShowWithdrawalModal(false);
      
      // Refresh data
      await Promise.all([fetchWalletData(), fetchTransactions()]);
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
    const statusClasses = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusClasses[transaction.status] || statusClasses.default
      }`}>
        {transaction.status}
      </span>
    );
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
      {/* Wallet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Available Balance</h3>
            <CreditCard className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">₹{wallet?.balance?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Total Earnings</h3>
            <ArrowUpRight className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">₹{wallet?.total_earnings?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Pending Withdrawals</h3>
            <Calendar className="text-orange-500" />
          </div>
          <p className="text-3xl font-bold">₹{wallet?.pending_withdrawals?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Withdrawal Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowWithdrawalModal(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Request Withdrawal
        </button>
      </div>

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
                        {transaction.transaction_type === 'WITHDRAWAL' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{transaction.description}</td>
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

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
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