'use client'
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Activity, 
  Globe, 
  Award, 
  Layers, 
  Link
} from 'lucide-react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = getTokens();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/`, 
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

  // Prepare data for charts
  const monthlyRevenueData = dashboardData.monthly_revenue || [];
  const memberDistributionData = dashboardData.member_distribution || [];
  const salesByCategoryData = dashboardData.sales_by_category || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-wrap items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <DollarSign className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">₹{dashboardData.total_revenue?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Total MLM Members */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-wrap items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <Users className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total MLM Members</p>
              <p className="text-2xl font-bold">{dashboardData.total_mlm_members || 0}</p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-wrap items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <ShoppingCart className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{dashboardData.total_orders || 0}</p>
            </div>
          </div>

          {/* Active Positions */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-wrap items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <Award className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Positions</p>
              <p className="text-2xl font-bold">{dashboardData.active_positions || 0}</p>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="mr-2" /> Monthly Revenue
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Member Distribution Pie Chart */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="mr-2" /> Member Distribution by Position
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={memberDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {memberDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Insights and Recent Activities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Sales by Category */}
          <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Layers className="mr-2" /> Sales by Product Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Critical Alerts and Notifications */}
          {/* <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="mr-2" /> Critical Alerts
            </h3>
            <div className="space-y-4">
              {dashboardData.critical_alerts?.map((alert, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    alert.severity === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : alert.severity === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm">{alert.description}</p>
                </div>
              ))}
            </div>
          </div> */}
          {/* Critical Alerts and Notifications */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="mr-2" /> Critical Alerts
            </h3>
            <div className="space-y-4">
              {dashboardData.critical_alerts?.map((alert, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    alert.severity === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : alert.severity === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm">{alert.description}</p>
                    </div>
                    {alert.type === 'password_reset' && (
                      <Link
                        href="/auth/dashboard/password-resets"
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                      >
                        View Requests
                      </Link>
                    )}
                  </div>
                  {alert.type === 'password_reset' && (
                    <p className="mt-2 text-xs text-red-700">
                      * Requires immediate attention
                    </p>
                  )}
                </div>
              ))}
              {!dashboardData.critical_alerts?.length && (
                <p className="text-gray-500 text-center">No critical alerts at this time</p>
              )}
            </div>
          </div>


        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingCart className="mr-2" /> Recent Activities
          </h3>
          <div className="space-y-4">
            {dashboardData.recent_activities?.map((activity, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center border-b pb-3 last:border-b-0"
              >
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
                <span 
                  className={`px-3 py-1 rounded-full text-xs ${
                    activity.type === 'order' 
                      ? 'bg-blue-100 text-blue-800' 
                      : activity.type === 'member' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {activity.type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;