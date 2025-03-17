'use client';

import React, { useState, useEffect } from 'react';
import { getTokens } from '@/utils/cookies';
// import MLMLiveCommissions from '@/components/MLM/MLMLiveCommissions';
import { 
  UserIcon, 
  UsersIcon, 
  IdentificationIcon, 
  BanknotesIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CreditCardIcon,
  QrCodeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import MLMLiveCommissions from '../MLMLiveCommissions';
import { useSelector } from 'react-redux';
import MLMAds from '@/components/Ads/MLMAds';

const MLMDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = getTokens();
  const { userInfo } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('featured');
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      console.log('dashboard data - ', data)
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load dashboard data. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome and Status Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, {userInfo?.first_name || 'Member'}</h1>
            <div className="flex items-center space-x-2 text-blue-100">
              <IdentificationIcon className="h-5 w-5" />
              <span>Member ID: {userInfo?.user_data.member_id || '0'}</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100 mt-1">
              <QrCodeIcon className="h-5 w-5" />
              <span>Position: {userInfo?.user_data.position.name}</span>
            </div>
          </div>
          {dashboardData.current_rank !== "Preferred Customer" ? (
            <div className="mt-4 md:mt-0">
            <div className="px-4 py-2 bg-white bg-opacity-20 rounded-md backdrop-blur-sm">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <div>
                  <div className="text-sm font-medium">Monthly Quota:</div>
                  <div className={`text-lg font-bold ${dashboardData.monthly_quota_status === "COMPLETED" ? "text-green-300" : "text-yellow-300"}`}>
                    {dashboardData.monthly_quota_status === "COMPLETED" ? "Completed" : `₹${dashboardData.monthly_quota_remaining} remaining`}
                  </div>
                </div>
              </div>
            </div>
            </div>
          ):''}
          

        </div>
      </div>

      {/* Ads Section  */}
      <MLMAds />
    {dashboardData.current_rank !== "Preferred Customer" ? (
      <>
              {/* Key Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total BP Points</p>
                    <p className="text-2xl font-bold">{dashboardData.total_bp}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  BP Points determine your position level
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Team Size</p>
                    <p className="text-2xl font-bold">{dashboardData.total_team_members}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <UsersIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Total members in your downline network
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold">₹{parseFloat(dashboardData.total_income).toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <BanknotesIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Lifetime earnings from commissions
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current Month Income</p>
                    <p className="text-2xl font-bold">₹{parseFloat(dashboardData.current_month_income).toFixed(2)}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <CreditCardIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Earnings for this month
                </div>
              </div>
              </div>

              {/* Live Commission Component */}
              <MLMLiveCommissions memberId={dashboardData.member_id} mlmData={dashboardData} />

              {/* Verification Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-5 rounded-lg shadow-md ${dashboardData.kyc_status === 'VERIFIED' ? 'bg-green-50 border border-green-200' : dashboardData.kyc_status === 'REJECTED' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <h3 className="font-medium text-gray-800 mb-2">KYC Verification</h3>
                <div className={`text-sm ${dashboardData.kyc_status === 'VERIFIED' ? 'text-green-700' : dashboardData.kyc_status === 'REJECTED' ? 'text-red-700' : 'text-yellow-700'}`}>
                  {dashboardData.kyc_status === 'VERIFIED' 
                    ? 'Your KYC documents have been verified.'
                    : dashboardData.kyc_status === 'REJECTED'
                    ? 'Your KYC verification was rejected. Please submit again.'
                    : 'Your KYC verification is pending.'}
                </div>
                <Link href="/mu/dashboard/kyc" className="block mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">
                  {dashboardData.kyc_status === 'VERIFIED' ? 'View details' : 'Submit/Update KYC'}
                </Link>
              </div>

              <div className={`p-5 rounded-lg shadow-md ${dashboardData.bank_verification_status === 'VERIFIED' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <h3 className="font-medium text-gray-800 mb-2">Bank Account Verification</h3>
                <div className={`text-sm ${dashboardData.bank_verification_status === 'VERIFIED' ? 'text-green-700' : 'text-yellow-700'}`}>
                  {dashboardData.bank_verification_status === 'VERIFIED' 
                    ? 'Your bank account has been verified.'
                    : 'Your bank account verification is pending.'}
                </div>
                <Link href="/mu/dashboard/profile" className="block mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">
                  {dashboardData.bank_verification_status === 'VERIFIED' ? 'View details' : 'Update bank details'}
                </Link>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-2">Next Commission Calculation</h3>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Commissions are calculated on the 1st of every month. Next calculation:
                    <div className="font-semibold mt-1 text-indigo-600">
                      {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-indigo-300" />
                </div>
              </div>
              </div>

              {/* Quick Action Links */}
              <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/mu/dashboard/register" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <UserIcon className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-sm text-center">Register New Member</span>
                </Link>
                
                <Link href="/mu/dashboard/networks" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <UsersIcon className="h-6 w-6 text-green-600 mb-2" />
                  <span className="text-sm text-center">View Network</span>
                </Link>
                
                <Link href="/mu/dashboard/wallet" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <BanknotesIcon className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-sm text-center">Wallet & Withdrawals</span>
                </Link>
                
                <Link href="/mu/dashboard/reports" className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <ChartBarIcon className="h-6 w-6 text-yellow-600 mb-2" />
                  <span className="text-sm text-center">View Reports</span>
                </Link>
              </div>
              </div>
              </>
    ):(
      <>
      
       {/* Verification Status Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className={`p-5 rounded-lg shadow-md ${dashboardData.kyc_status === 'VERIFIED' ? 'bg-green-50 border border-green-200' : dashboardData.kyc_status === 'REJECTED' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <h3 className="font-medium text-gray-800 mb-2">KYC Verification</h3>
          <div className={`text-sm ${dashboardData.kyc_status === 'VERIFIED' ? 'text-green-700' : dashboardData.kyc_status === 'REJECTED' ? 'text-red-700' : 'text-yellow-700'}`}>
            {dashboardData.kyc_status === 'VERIFIED' 
              ? 'Your KYC documents have been verified.'
              : dashboardData.kyc_status === 'REJECTED'
              ? 'Your KYC verification was rejected. Please submit again.'
              : 'Your KYC verification is pending.'}
          </div>
          <Link href="/mlm/profile/kyc" className="block mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">
            {dashboardData.kyc_status === 'VERIFIED' ? 'View details' : 'Submit/Update KYC'}
          </Link>
        </div>

        <div className={`p-5 rounded-lg shadow-md ${dashboardData.bank_verification_status === 'VERIFIED' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <h3 className="font-medium text-gray-800 mb-2">Bank Account Verification</h3>
          <div className={`text-sm ${dashboardData.bank_verification_status === 'VERIFIED' ? 'text-green-700' : 'text-yellow-700'}`}>
            {dashboardData.bank_verification_status === 'VERIFIED' 
              ? 'Your bank account has been verified.'
              : 'Your bank account verification is pending.'}
          </div>
          <Link href="/mlm/profile/bank-details" className="block mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">
            {dashboardData.bank_verification_status === 'VERIFIED' ? 'View details' : 'Update bank details'}
          </Link>
        </div>
       </div>
       </>
    )
  }
     

      {/* Featured Products */}
      {/* {dashboardData.featured_products && dashboardData.featured_products.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Featured Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.featured_products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                  {product.image && (
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover object-center"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                  <div className="mt-1 flex justify-between items-center">
                    <p className="text-sm font-bold text-gray-900">₹{parseFloat(product.price).toFixed(2)}</p>
                    <p className="text-xs text-blue-600">{product.bp} BP</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/mu/dashboard/shop" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Products →
            </Link>
          </div>
        </div>



      )} */}
      {/* Featured Products and Recent Orders */}
      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
          {/* Products with Tabs */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'featured' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('featured')}
              >
                <Package className="inline-block mr-1 h-4 w-4" /> Featured Products
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'purchased' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('purchased')}
              >
                <ShoppingCart className="inline-block mr-1 h-4 w-4" /> My Purchases
              </button>
            </div>
            
            {activeTab === 'featured' ? (
              // Featured Products Tab
              <div>
                {dashboardData.featured_products?.length > 0 ? (
                  dashboardData.featured_products.map((product) => (
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
                          {product.price && (
                            <p className="text-sm text-gray-500">₹{product.price}</p>
                          )}
                        </div>
                      </div>
                      <Link href={`/product/${product.slug}`} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">
                        View
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No featured products available</p>
                )}
              </div>
            ) : (
              // Recent Purchases Tab
              <div>
                {recentPurchases.length > 0 ? (
                  recentPurchases.map((product) => (
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
                          {product.purchase_date && (
                            <p className="text-sm text-gray-500">Purchased: {new Date(product.purchase_date).toLocaleDateString()}</p>
                          )}
                          {product.price && (
                            <p className="text-sm text-gray-500">₹{product.price}</p>
                          )}
                        </div>
                      </div>
                      <Link href={`/product/${product.slug}`} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">
                        View
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No recent purchases</p>
                )}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingCart className="mr-2" /> Recent Orders
            </h3>
            {dashboardData.recent_orders?.length > 0 ? (
              dashboardData.recent_orders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex justify-between border-b py-3 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.order_date).toLocaleDateString()}
                    </p>
                    {order.total_amount && (
                      <p className="text-sm text-gray-600">₹{order.total_amount.toLocaleString()}</p>
                    )}
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
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent orders</p>
            )}
          </div>
        </div>
    </div>
  );
};

export default MLMDashboard;