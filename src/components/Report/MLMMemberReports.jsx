'use client'

import React, { useEffect, useState } from 'react';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import { 
  BarChart2, 
  RefreshCw, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Download, 
  Award,
  Layers
} from 'lucide-react';

const MLMMemberReports = () => {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    period: 'monthly'
  });

  const { token } = getTokens();

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
        `${process.env.NEXT_PUBLIC_API_URL}/mlm/member-reports/?${queryParams}`,
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
    if (!reportData) return;

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
      </div>
    );
  };

  const renderReportData = () => {
    if (!reportData || !reportData.data) return <p>No data to display</p>;

    const { report_type, data } = reportData;

    switch(report_type) {
      case 'commissions':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Commission Report</h2>
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
                    <th className="py-3 px-4 text-left border-b">Date</th>
                    <th className="py-3 px-4 text-left border-b">From Member</th>
                    <th className="py-3 px-4 text-left border-b">Level</th>
                    <th className="py-3 px-4 text-left border-b">Amount</th>
                    <th className="py-3 px-4 text-left border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">{item.from_member_name}</td>
                      <td className="py-2 px-4 border-b">{item.level}</td>
                      <td className="py-2 px-4 border-b">
                        ₹{parseFloat(item.amount).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.is_paid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.is_paid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
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
              <h2 className="text-lg font-semibold">Personal Sales Report</h2>
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
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">{item.period}</td>
                      <td className="py-2 px-4 border-b">{item.total_orders}</td>
                      <td className="py-2 px-4 border-b">
                        ₹{parseFloat(item.total_revenue).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">{item.total_bp}</td>
                      <td className="py-2 px-4 border-b">
                        ₹{parseFloat(item.avg_order_value).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary Metrics */}
            {reportData.summary && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-500">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ₹{parseFloat(reportData.summary.total_revenue).toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-500">Total Orders</p>
                  <p className="text-2xl font-bold">{reportData.summary.total_orders}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-500">Total BP</p>
                  <p className="text-2xl font-bold">{reportData.summary.total_bp}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-500">Avg Order Value</p>
                  <p className="text-2xl font-bold">
                    ₹{parseFloat(reportData.summary.avg_order_value).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'team_performance':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Team Performance Report</h2>
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
                    <th className="py-3 px-4 text-left border-b">Level</th>
                    <th className="py-3 px-4 text-left border-b">Members</th>
                    <th className="py-3 px-4 text-left border-b">Total Sales</th>
                    <th className="py-3 px-4 text-left border-b">Total Commissions</th>
                    <th className="py-3 px-4 text-left border-b">BP Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">Level {item.level}</td>
                      <td className="py-2 px-4 border-b">{item.total_members}</td>
                      <td className="py-2 px-4 border-b">
                        ₹{parseFloat(item.total_sales).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        ₹{parseFloat(item.total_commissions).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">{item.total_bp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

        case 'network_growth':
          return (
              <div>
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Network Growth Report</h2>
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
                                  <th className="py-3 px-4 text-left border-b">New Members</th>
                                  <th className="py-3 px-4 text-left border-b">Total Network Size</th>
                                  <th className="py-3 px-4 text-left border-b">Total BP</th>
                                  <th className="py-3 px-4 text-left border-b">Total Sales</th>
                              </tr>
                          </thead>
                          <tbody>
                              {data.map((item, index) => (
                                  <React.Fragment key={index}>
                                      <tr className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                          <td className="py-2 px-4 border-b">{item.period}</td>
                                          <td className="py-2 px-4 border-b">{item.new_members}</td>
                                          <td className="py-2 px-4 border-b">{item.total_network_size}</td>
                                          <td className="py-2 px-4 border-b">{item.total_bp}</td>
                                          <td className="py-2 px-4 border-b">
                                              ₹{parseFloat(item.total_sales).toFixed(2)}
                                          </td>
                                      </tr>
                                      {item.new_members_details && item.new_members_details.length > 0 && (
                                          <tr>
                                              <td colSpan="5" className="p-4">
                                                  <div className="bg-gray-100 rounded-lg p-4">
                                                      <h3 className="text-md font-semibold mb-2">New Members for {item.period}</h3>
                                                      <table className="w-full">
                                                          <thead>
                                                              <tr>
                                                                  <th className="text-left">Member ID</th>
                                                                  <th className="text-left">Username</th>
                                                                  <th className="text-left">Full Name</th>
                                                                  <th className="text-left">Position</th>
                                                                  <th className="text-left">Join Date</th>
                                                              </tr>
                                                          </thead>
                                                          <tbody>
                                                              {item.new_members_details.map((member, idx) => (
                                                                  <tr key={idx} className="border-t">
                                                                      <td>{member.member_id}</td>
                                                                      <td>{member.username}</td>
                                                                      <td>{member.full_name}</td>
                                                                      <td>{member.position}</td>
                                                                      <td>{new Date(member.join_date).toLocaleDateString()}</td>
                                                                  </tr>
                                                              ))}
                                                          </tbody>
                                                      </table>
                                                  </div>
                                              </td>
                                          </tr>
                                      )}
                                  </React.Fragment>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          );

      default:
        return <p>No data to display</p>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <BarChart2 className="mr-2" /> My Reports
        </h1>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        {[
          { 
            type: 'commissions', 
            icon: <DollarSign className="mr-2" />, 
            label: 'Commissions' 
          },
          { 
            type: 'sales', 
            icon: <TrendingUp className="mr-2" />, 
            label: 'Personal Sales' 
          },
          { 
            type: 'team_performance', 
            icon: <Users className="mr-2" />, 
            label: 'Team Performance' 
          },
          { 
            type: 'network_growth', 
            icon: <Layers className="mr-2" />, 
            label: 'Network Growth' 
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
              <RefreshCw className="mr-2" /> Report Filters
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

export default MLMMemberReports;