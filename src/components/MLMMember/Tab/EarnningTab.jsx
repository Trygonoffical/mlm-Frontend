// components/MLM/tabs/EarningsTab.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EarningsTab = ({ member }) => {
    console.log('member - ', member )
    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500">Total Earnings</h4>
                    <p className="text-2xl font-bold">₹{member.total_earnings}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500">This Month</h4>
                    <p className="text-2xl font-bold">
                        ₹{member.monthly_earnings[member.monthly_earnings.length - 1]?.amount || 0}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500">Pending Payouts</h4>
                    <p className="text-2xl font-bold">₹{member.pending_payouts}</p>
                </div>
            </div>

            {/* Earnings Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Monthly Earnings</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={member.monthly_earnings}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="amount" 
                                stroke="#2563eb" 
                                activeDot={{ r: 8 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Commissions */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Recent Commissions</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    From
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {member.recent_commissions.map((commission, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(commission.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ₹{commission.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {commission.from_member_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            commission.is_paid 
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {commission.is_paid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdrawal History */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Withdrawal History</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {member.withdrawals.map((withdrawal, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(withdrawal.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ₹{withdrawal.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            withdrawal.status === 'COMPLETED'
                                                ? 'bg-green-100 text-green-800'
                                                : withdrawal.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {withdrawal.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EarningsTab;