'use client'
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Package, 
  Award 
} from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import Link from 'next/link';
import MLMAds from '../Ads/MLMAds';

const MLMMemberDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = getTokens();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/dashboard/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      console.log('data - dash' , data)
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error loading dashboard');
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-10">
        <p>Unable to load dashboard data</p>
      </div>
    );
  }

  // Income Distribution Chart Data
  const incomeDistributionData = [
    { name: 'Self Income', value: dashboardData.self_income || 0 },
    { name: 'Team Income', value: dashboardData.team_income || 0 },
    { name: 'Bonus Income', value: dashboardData.bonus_income || 0 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Monthly Performance Chart Data
  const monthlyPerformanceData = dashboardData.monthly_performance || [
    { month: 'Jan', performance: 0 },
    { month: 'Feb', performance: 0 },
    { month: 'Mar', performance: 0 },
    { month: 'Apr', performance: 0 },
    { month: 'May', performance: 0 },
    { month: 'Jun', performance: 0 }
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
        

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                <div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
                        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
                            <div className="bg-blue-100 rounded-full p-3 mr-4">
                            <DollarSign className="text-blue-600" />
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Total Income</p>
                            <p className="text-xl font-bold">₹{dashboardData.total_income?.toLocaleString() || 0}</p>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
                            <div className="bg-green-100 rounded-full p-3 mr-4">
                            <TrendingUp className="text-green-600" />
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Current Month Income</p>
                            <p className="text-xl font-bold">₹{dashboardData.current_month_income?.toLocaleString() || 0}</p>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
                            <div className="bg-purple-100 rounded-full p-3 mr-4">
                            <Users className="text-purple-600" />
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Team Size</p>
                            <p className="text-xl font-bold">{dashboardData.total_team_members || 0}</p>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
                            <div className="bg-red-100 rounded-full p-3 mr-4">
                            <Award className="text-red-600" />
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Current Rank</p>
                            <p className="text-xl font-bold">{dashboardData.current_rank || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-green-600 text-white rounded-lg p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">My Rank: {dashboardData.current_rank}</h3>
                            <p className="text-sm mb-4">Total Team Commission: ₹{dashboardData.total_team_commission?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                            <span>Team Income</span>
                            <span>₹{dashboardData.team_income?.toLocaleString() || 0}</span>
                            </div>
                            <div className="bg-green-500 rounded-full h-2 w-full">
                            <div 
                                className="bg-white h-2 rounded-full" 
                                style={{
                                width: `${Math.min(
                                    (dashboardData.team_income / dashboardData.rank_target) * 100, 
                                    100
                                )}%`
                                }}
                            ></div>
                            </div>
                            <p className="text-xs mt-2">
                            {`${Math.min((dashboardData.team_income / dashboardData.rank_target) * 100, 100).toFixed(2)}% to next rank`}
                            </p>
                        </div>
                    </div>
                </div>
        </div>

        <div className="max-w-7xl mx-auto ">

            {/* Charts Section */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
            {/* Income Distribution Pie Chart */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Income Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                    data={incomeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    >
                    {incomeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Monthly Performance Bar Chart */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyPerformanceData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#8884d8" />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>

            {/* Ads Section  */}
            <MLMAds />
            {/* Featured Products and Recent Orders */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
            {/* Featured Products */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="mr-2" /> Featured Products
                </h3>
                {dashboardData.featured_products?.map((product) => (
                <div 
                    key={product.id} 
                    className="flex items-center justify-between border-b py-3 last:border-b-0"
                >
                    <div className="flex items-center">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                        <p className="font-medium">{product.name}</p>
                        {/* <p className="text-sm text-gray-500">₹{product.price}</p> */}
                    </div>
                    </div>
                    <Link href={`/product/${product.slug}`}   className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">
                        View
                    </Link>
                </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ShoppingCart className="mr-2" /> Recent Orders
                </h3>
                {dashboardData.recent_orders?.map((order) => (
                <div 
                    key={order.id} 
                    className="flex justify-between border-b py-3 last:border-b-0"
                >
                    <div>
                    <p className="font-medium">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(order.order_date).toLocaleDateString()}
                    </p>
                    </div>
                    <div>
                    <span 
                        className={`px-3 py-1 rounded-full text-xs ${
                        order.status === 'DELIVERED' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                        {order.status}
                    </span>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
      </div>
  );
};

export default MLMMemberDashboard;