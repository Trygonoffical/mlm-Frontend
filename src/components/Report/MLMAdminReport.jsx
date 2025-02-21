
'use client'
import React, { useEffect, useState } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Filter, 
  Search, 
  Download, 
  BarChart2, 
  Users, 
  Calendar, 
  Trophy,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

const AdminMLMReports = () => {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    period: 'daily',
    name: '',
    city: '',
    state: '',
    // Custom report filters
    min_earnings: '',
    max_earnings: '',
    min_bp: '',
    max_bp: '',
    position: '',
    is_active: '',
    // Sales report filters
    category: '',
    product_id: '',
    min_amount: '',
    max_amount: '',
    payment_status: '',
    order_status: ''
  });

  const { token } = getTokens();

  // Fetch positions when component mounts
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/positions/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch positions');
        }

        const data = await response.json();
        setPositions(data);
      } catch (error) {
        console.error('Error fetching positions:', error);
        toast.error('Failed to load positions');
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
    fetchPositions();
  }, [token]);


  const fetchReport = async () => {
    if (!reportType) {
      toast.error('Please select a report type');
      return;
    }

    setLoading(true);
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        type: reportType,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v != null && v !== '')
        )
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/reports/?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const data = await response.json();
      setReportData(data);
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Error generating report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    // Implement CSV or Excel download logic
    if (!reportData) return;

    // Convert report data to CSV
    const convertToCSV = (data) => {
      const headers = Object.keys(data[0] || {});
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            `"${row[header] !== null && row[header] !== undefined 
              ? String(row[header]).replace(/"/g, '""') 
              : ''}"`
          ).join(',')
        )
      ];
      return csvRows.join('\n');
    };

    const csvContent = convertToCSV(reportData.data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderReportFilters = () => {
    switch(reportType) {
      case 'level_wise':
      case 'joining':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input 
                type="date" 
                className="w-full border rounded-lg p-2"
                value={filters.start_date}
                onChange={(e) => setFilters({...filters, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input 
                type="date" 
                className="w-full border rounded-lg p-2"
                value={filters.end_date}
                onChange={(e) => setFilters({...filters, end_date: e.target.value})}
              />
            </div>
            {reportType === 'joining' && (
              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select 
                  className="w-full border rounded-lg p-2"
                  value={filters.period}
                  onChange={(e) => setFilters({...filters, period: e.target.value})}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>
        );
      case 'member_search':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input 
                type="text" 
                className="w-full border rounded-lg p-2"
                placeholder="Search by name"
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input 
                type="text" 
                className="w-full border rounded-lg p-2"
                placeholder="Search by city"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input 
                type="text" 
                className="w-full border rounded-lg p-2"
                placeholder="Search by state"
                value={filters.state}
                onChange={(e) => setFilters({...filters, state: e.target.value})}
              />
            </div>
          </div>
        );
      case 'custom':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Earnings</label>
              <input 
                type="number" 
                className="w-full border rounded-lg p-2"
                placeholder="Minimum Earnings"
                value={filters.min_earnings}
                onChange={(e) => setFilters({...filters, min_earnings: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Earnings</label>
              <input 
                type="number" 
                className="w-full border rounded-lg p-2"
                placeholder="Maximum Earnings"
                value={filters.max_earnings}
                onChange={(e) => setFilters({...filters, max_earnings: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <select
                className="w-full border rounded-lg p-2"
                value={filters.position}
                onChange={(e) => setFilters({...filters, position: e.target.value})}
              >
                <option value="">All Positions</option>
                {positions.map((position) => (
                  <option 
                    key={position.id} 
                    value={position.name}
                  >
                    {position.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min BP</label>
              <input 
                type="number" 
                className="w-full border rounded-lg p-2"
                placeholder="Minimum BP"
                value={filters.min_bp}
                onChange={(e) => setFilters({...filters, min_bp: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max BP</label>
              <input 
                type="number" 
                className="w-full border rounded-lg p-2"
                placeholder="Maximum BP"
                value={filters.max_bp}
                onChange={(e) => setFilters({...filters, max_bp: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Active Status</label>
              <select
                className="w-full border rounded-lg p-2"
                value={filters.is_active}
                onChange={(e) => setFilters({...filters, is_active: e.target.value})}
              >
                <option value="">All Members</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        );
        case 'sales':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input 
                type="date" 
                className="w-full border rounded-lg p-2"
                value={filters.start_date}
                onChange={(e) => setFilters({...filters, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input 
                type="date" 
                className="w-full border rounded-lg p-2"
                value={filters.end_date}
                onChange={(e) => setFilters({...filters, end_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full border rounded-lg p-2"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Amount</label>
              <input 
                type="number" 
                className="w-full border rounded-lg p-2"
                placeholder="Minimum Amount"
                value={filters.min_amount}
                onChange={(e) => setFilters({...filters, min_amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Amount</label>
              <input 
                type="number" 
                className="w-full border rounded-lg p-2"
                placeholder="Maximum Amount"
                value={filters.max_amount}
                onChange={(e) => setFilters({...filters, max_amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order Status</label>
              <select
                className="w-full border rounded-lg p-2"
                value={filters.order_status}
                onChange={(e) => setFilters({...filters, order_status: e.target.value})}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Period</label>
              <select
                className="w-full border rounded-lg p-2"
                value={filters.period}
                onChange={(e) => setFilters({...filters, period: e.target.value})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderReportData = () => {
    if (!reportData || !reportData.data) return <p>No data to display</p>;

    const { report_type, data } = reportData;

    switch(report_type) {
      case 'level_wise':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Level-wise Report</h2>
              <button 
                onClick={downloadReport}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Download className="mr-1 h-4 w-4" /> Download CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left border-b">Position</th>
                    <th className="py-3 px-4 text-left border-b">Total Members</th>
                    <th className="py-3 px-4 text-left border-b">Total Earnings</th>
                    <th className="py-3 px-4 text-left border-b">Total BP</th>
                    <th className="py-3 px-4 text-left border-b">Avg Monthly Purchase</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">{item.position__name}</td>
                      <td className="py-2 px-4 border-b">{item.total_members}</td>
                      <td className="py-2 px-4 border-b">₹{item.total_earnings?.toFixed(2) || '0.00'}</td>
                      <td className="py-2 px-4 border-b">{item.total_bp}</td>
                      <td className="py-2 px-4 border-b">₹{item.avg_monthly_purchase?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'joining':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Joining Report</h2>
              <button 
                onClick={downloadReport}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Download className="mr-1 h-4 w-4" /> Download CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left border-b">Period</th>
                    <th className="py-3 px-4 text-left border-b">Total Members</th>
                    <th className="py-3 px-4 text-left border-b">Total BP</th>
                    <th className="py-3 px-4 text-left border-b">Total Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">{item.period}</td>
                      <td className="py-2 px-4 border-b">{item.total_members}</td>
                      <td className="py-2 px-4 border-b">{item.total_bp}</td>
                      <td className="py-2 px-4 border-b">₹{item.total_earnings?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'member_search':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Member Search Results</h2>
              <button 
                onClick={downloadReport}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Download className="mr-1 h-4 w-4" /> Download CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left border-b">Member ID</th>
                    <th className="py-3 px-4 text-left border-b">Name</th>
                    <th className="py-3 px-4 text-left border-b">Email</th>
                    <th className="py-3 px-4 text-left border-b">Phone</th>
                    <th className="py-3 px-4 text-left border-b">Position</th>
                    <th className="py-3 px-4 text-left border-b">Total Earnings</th>
                    <th className="py-3 px-4 text-left border-b">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">{item.member_id}</td>
                      <td className="py-2 px-4 border-b">{item.name}</td>
                      <td className="py-2 px-4 border-b">{item.email}</td>
                      <td className="py-2 px-4 border-b">{item.phone}</td>
                      <td className="py-2 px-4 border-b">{item.position}</td>
                      <td className="py-2 px-4 border-b">₹{item.total_earnings?.toFixed(2) || '0.00'}</td>
                      <td className="py-2 px-4 border-b">{new Date(item.join_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'custom':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Custom Report</h2>
              <button 
                onClick={downloadReport}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Download className="mr-1 h-4 w-4" /> Download CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left border-b">Member ID</th>
                    <th className="py-3 px-4 text-left border-b">Name</th>
                    <th className="py-3 px-4 text-left border-b">Position</th>
                    <th className="py-3 px-4 text-left border-b">Is Active</th>
                    <th className="py-3 px-4 text-left border-b">Total Earnings</th>
                    <th className="py-3 px-4 text-left border-b">Total BP</th>
                    <th className="py-3 px-4 text-left border-b">Current Month Purchase</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">{item.member_id}</td>
                      <td className="py-2 px-4 border-b">{item.name}</td>
                      <td className="py-2 px-4 border-b">{item.position}</td>
                      <td className="py-2 px-4 border-b">{item.is_active ? 'Yes' : 'No'}</td>
                      <td className="py-2 px-4 border-b">₹{item.total_earnings?.toFixed(2) || '0.00'}</td>
                      <td className="py-2 px-4 border-b">{item.total_bp}</td>
                      <td className="py-2 px-4 border-b">₹{item.current_month_purchase?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'sales':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sales Report</h2>
              <button 
                onClick={downloadReport}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Download className="mr-1 h-4 w-4" /> Download CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left border-b">Period</th>
                    <th className="py-3 px-4 text-left border-b">Total Orders</th>
                    <th className="py-3 px-4 text-left border-b">Total Revenue</th>
                    <th className="py-3 px-4 text-left border-b">Total BP</th>
                    <th className="py-3 px-4 text-left border-b">Avg Order Value</th>
                    {filters.category && <th className="py-3 px-4 text-left border-b">Category</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">{item.period}</td>
                      <td className="py-2 px-4 border-b">{item.total_orders}</td>
                      <td className="py-2 px-4 border-b">₹{item.total_revenue?.toFixed(2) || '0.00'}</td>
                      <td className="py-2 px-4 border-b">{item.total_bp}</td>
                      <td className="py-2 px-4 border-b">₹{item.avg_order_value?.toFixed(2) || '0.00'}</td>
                      {filters.category && <td className="py-2 px-4 border-b">{item.category_name}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Show additional summary metrics */}
            {reportData.summary && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-500">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{reportData.summary.total_revenue?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-500">Total Orders</p>
                  <p className="text-2xl font-bold">{reportData.summary.total_orders || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-500">Total BP Generated</p>
                  <p className="text-2xl font-bold">{reportData.summary.total_bp || 0}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-500">Average Order Value</p>
                  <p className="text-2xl font-bold">₹{reportData.summary.avg_order_value?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <p>No data to display</p>;
    }
  };

  // Rest of the component remains the same as in the previous implementation

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* The existing return content remains unchanged */}
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold flex items-center">
           <BarChart2 className="mr-2" /> MLM Reports
         </h1>
      </div>

       {/* Report Type Selection */}
       <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
         {[
           { 
             type: 'level_wise', 
             icon: <Trophy className="mr-2" />, 
             label: 'Level-wise Report' 
           },
           { 
             type: 'joining', 
             icon: <Users className="mr-2" />, 
             label: 'Joining Report' 
           },
           { 
             type: 'member_search', 
             icon: <Search className="mr-2" />, 
             label: 'Member Search' 
           },
           { 
             type: 'custom', 
             icon: <Filter className="mr-2" />, 
             label: 'Custom Report' 
           },
           { 
            type: 'sales', 
            icon: <ShoppingCart className="mr-2" />, 
            label: 'Sales Report' 
          }
         ].map((report) => (
           <button
             key={report.type}
             className={`flex items-center justify-center p-4 rounded-lg border transition-all ${
               reportType === report.type 
                 ? 'bg-blue-500 text-white' 
                 : 'bg-white text-gray-700 hover:bg-gray-100'
             }`}
             onClick={() => {
              setReportType(report.type);
              setReportData(null); // Clear previous report data
            }}
           >
             {report.icon}
             {report.label}
           </button>
         ))}
       </div>

       {/* Filters Section */}
       {reportType && (
         <div className="bg-white shadow-md rounded-lg p-6 mb-6">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold flex items-center">
               <Filter className="mr-2" /> Report Filters
             </h2>
           </div>
           {renderReportFilters()}
         </div>
       )}

       {/* Generate Report Button */}
       {reportType && (
         <div className="flex justify-end mb-6">
           <button
             onClick={fetchReport}
             disabled={loading}
             className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
           >
             {loading ? 'Generating...' : 'Generate Report'}
           </button>
         </div>
       )}

       {/* Report Data Section */}
       {reportData && (
         <div className="bg-white shadow-md rounded-lg p-6">
           {renderReportData()}
         </div>
       )}
    </div>
  );
};

export default AdminMLMReports;