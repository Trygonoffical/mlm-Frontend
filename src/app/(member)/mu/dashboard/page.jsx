
import Charts from '@/components/Dashboard/PanelCharts/Charts';

import { 
    Wallet
  } from 'lucide-react';


const Dashboard = () => {

  return (
      <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Wallet className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Income</div>
                  <div className="text-xl font-semibold">₹ 1000.00</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Wallet className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Current Month Income</div>
                  <div className="text-xl font-semibold">₹ 1000.00</div>
                </div>
              </div>
            </div>

            <div className="bg-green-600 p-4 rounded-lg shadow-md text-white">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">My Rank</h3>
                <div className="text-2xl font-bold mb-2">Executive Marketing</div>
                <div className="space-y-1 text-sm">
                  <div>Total Commission - ₹ 1000.00</div>
                  <div>Team Income - ₹ 1000.00</div>
                  <div>Total Team - 24</div>
                </div>
              </div>
            </div>
          </div>
      </>
          
        
  );
};

export default Dashboard;