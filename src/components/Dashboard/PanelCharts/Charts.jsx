'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie } from 'recharts';

const Charts = () => {
  const monthlyData = [
    { name: 'January', value: 65 },
    { name: 'February', value: 58 },
    { name: 'March', value: 80 },
    { name: 'April', value: 81 },
    { name: 'May', value: 56 },
    { name: 'June', value: 55 },
    { name: 'July', value: 40 }
  ];
  
  const pieData = [
    { name: 'A', value: 30 },
    { name: 'B', value: 25 },
    { name: 'C', value: 20 },
    { name: 'D', value: 15 },
    { name: 'E', value: 10 }
  ];
  
  return (
    <> 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
            <LineChart width={500} height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
            </div>
        
            <div className="bg-white p-4 rounded-lg shadow-md">
            <PieChart width={400} height={300}>
                <Pie
                data={pieData}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                />
            </PieChart>
            </div>
    </div>
  </>
  )
}

export default Charts