// // components/admin/ShippingConfiguration.jsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { getTokens } from '@/utils/cookies';
// import { CogIcon } from '@heroicons/react/24/outline';

// const ShippingConfiguration = () => {
//   const [config, setConfig] = useState({
//     quixgo_api_base_url: '',
//     quixgo_email: '',
//     quixgo_password: '',
//     quixgo_customer_id: '',
//     enable_shipping: true,
//     default_service_type: 'SF',
//     default_courier: 'DTC'
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const { token } = getTokens();

//   // Fetch configuration
//   const fetchConfig = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/shipping/config/`, 
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       if (!response.ok) throw new Error('Failed to fetch shipping configuration');
      
//       const data = await response.json();
//       setConfig(data);
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to load shipping configuration');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Save configuration
//   const saveConfig = async () => {
//     setSaving(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/shipping/config/`, 
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify(config)
//         }
//       );
      
//       if (!response.ok) throw new Error('Failed to save shipping configuration');
      
//       toast.success('Shipping configuration saved successfully');
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to save shipping configuration');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Test API connection
//   const testConnection = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/shipping/config/test-connection/`, 
//         {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       if (!response.ok) throw new Error('Connection test failed');
      
//       const data = await response.json();
//       if (data.success) {
//         toast.success('Successfully connected to QuixGo API');
//       } else {
//         toast.error(`Connection failed: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to test connection');
//     }
//   };

//   useEffect(() => {
//     fetchConfig();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setConfig(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     saveConfig();
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6 flex items-center">
//         <CogIcon className="h-6 w-6 mr-2 text-blue-500" />
//         Shipping Configuration
//       </h1>
      
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <form onSubmit={handleSubmit}>
//           <h2 className="text-lg font-medium mb-4">QuixGo API Settings</h2>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 API Base URL
//               </label>
//               <input
//                 type="text"
//                 name="quixgo_api_base_url"
//                 value={config.quixgo_api_base_url}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 placeholder="https://dev.api.quixgo.com/clientApi"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Customer ID
//               </label>
//               <input
//                 type="text"
//                 name="quixgo_customer_id"
//                 value={config.quixgo_customer_id}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 placeholder="Customer ID"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="quixgo_email"
//                 value={config.quixgo_email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 placeholder="Email"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="quixgo_password"
//                 value={config.quixgo_password}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 placeholder="Password"
//               />
//             </div>
//           </div>
          
//           <div className="border-t border-gray-200 pt-4">
//             <h2 className="text-lg font-medium mb-4">Shipping Settings</h2>
            
//             <div className="mb-4">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="enable_shipping"
//                   id="enable_shipping"
//                   checked={config.enable_shipping}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-blue-600"
//                 />
//                 <label htmlFor="enable_shipping" className="ml-2 text-sm text-gray-700">
//                   Enable Shipping System
//                 </label>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Default Service Type
//                 </label>
//                 <select
//                   name="default_service_type"
//                   value={config.default_service_type}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="SF">Surface</option>
//                   <option value="EXP">Express</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Default Courier
//                 </label>
//                 <select
//                   name="default_courier"
//                   value={config.default_courier}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="DTC">DTDC</option>
//                   <option value="DLV">Delhivery</option>
//                   <option value="SFX">Shadowfax</option>
//                   <option value="quixgo">Quixgo Priority (Cheapest)</option>
//                 </select>
//               </div>
//             </div>
//           </div>
          
//           <div className="mt-6 flex items-center justify-between">
//             <button
//               type="button"
//               onClick={testConnection}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//             >
//               Test Connection
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
//             >
//               {saving && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
//               Save Configuration
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ShippingConfiguration;

// components/admin/ShippingConfiguration.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getTokens } from '@/utils/cookies';
import { CogIcon } from '@heroicons/react/24/outline';

const ShippingConfiguration = () => {
  const [config, setConfig] = useState({
    quixgo_email: '',
    quixgo_password: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { token } = getTokens();

  // Fetch configuration
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/config/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch shipping configuration');
      
      const data = await response.json();
      setConfig({
        quixgo_email: data.quixgo_email || '',
        quixgo_password: data.quixgo_password || '',
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load shipping configuration');
    } finally {
      setLoading(false);
    }
  };

  // Save configuration
  const saveConfig = async () => {
    setSaving(true);
    try {
      // Try POST method first (this will work with our updated backend)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/config/`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(config)
        }
      );
      
      if (!response.ok) throw new Error('Failed to save shipping configuration');
      
      toast.success('Shipping configuration saved successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save shipping configuration');
    } finally {
      setSaving(false);
    }
  };

  // Test API connection
  const testConnection = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/config/test-connection/`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({}) // Send empty object to ensure proper content type
        }
      );
      
      if (!response.ok) throw new Error('Connection test failed');
      
      const data = await response.json();
      if (data.success) {
        toast.success('Successfully connected to QuixGo API');
      } else {
        toast.error(`Connection failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to test connection');
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveConfig();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <CogIcon className="h-6 w-6 mr-2 text-blue-500" />
        Shipping Configuration
      </h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-medium mb-4">QuixGo API Settings</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Base URL
              </label>
              <input
                type="text"
                name="quixgo_api_base_url"
                value={config.quixgo_api_base_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://dev.api.quixgo.com/clientApi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer ID
              </label>
              <input
                type="text"
                name="quixgo_customer_id"
                value={config.quixgo_customer_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Customer ID"
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="quixgo_email"
                value={config.quixgo_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="quixgo_password"
                value={config.quixgo_password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Password"
              />
            </div>
          </div>
          
          {/* <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-medium mb-4">Shipping Settings</h2>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="enable_shipping"
                  id="enable_shipping"
                  checked={config.enable_shipping}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="enable_shipping" className="ml-2 text-sm text-gray-700">
                  Enable Shipping System
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Service Type
                </label>
                <select
                  name="default_service_type"
                  value={config.default_service_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="SF">Surface</option>
                  <option value="EXP">Express</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Courier
                </label>
                <select
                  name="default_courier"
                  value={config.default_courier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="DTC">DTDC</option>
                  <option value="DLV">Delhivery</option>
                  <option value="SFX">Shadowfax</option>
                  <option value="quixgo">Quixgo Priority (Cheapest)</option>
                </select>
              </div>
            </div>
          </div> */}
          
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={testConnection}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Test Connection
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingConfiguration;