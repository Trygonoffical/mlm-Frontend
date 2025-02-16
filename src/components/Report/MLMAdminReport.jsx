
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
  Trophy
} from 'lucide-react';

const AdminMLMReports = () => {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
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
    is_active: ''
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
      default:
        return null;
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
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
           }
         ].map((report) => (
           <button
             key={report.type}
             className={`flex items-center justify-center p-4 rounded-lg border transition-all ${
               reportType === report.type 
                 ? 'bg-blue-500 text-white' 
                 : 'bg-white text-gray-700 hover:bg-gray-100'
             }`}
             onClick={() => setReportType(report.type)}
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