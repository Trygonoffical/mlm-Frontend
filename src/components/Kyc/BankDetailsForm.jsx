'use client'
const { useState, useEffect } = require("react");
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';

const BankDetailsForm = () => {
    const [bankDetails, setBankDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      account_holder_name: '',
      account_number: '',
      ifsc_code: '',
      bank_name: '',
      branch_name: ''
    });
  
    const { token } = getTokens();
  
    useEffect(() => {
      fetchBankDetails();
    }, []);
  
    const fetchBankDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/bank-details/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          setBankDetails(data);
          setFormData(data || formData);
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
        toast.error('Failed to load bank details');
      } finally {
        setLoading(false);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/bank-details/`, {
          method: bankDetails ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        const responseData = await response.json(); // Try to get response body
        console.log('Response status:', response.status);
        console.log('Response data:', responseData);

        if (response.ok) {
          toast.success('Bank details saved successfully');
          setIsEditing(false);
          fetchBankDetails();
        } else {
          throw new Error('Failed to save bank details');
        }
      } catch (error) {
        console.error('Error saving bank details:', error);
        toast.error('Failed to save bank details');
      }
    };
  
    if (loading) {
      return <div className="p-4">Loading...</div>;
    }
  
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Bank Account Details</h3>
          {bankDetails && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit Details
            </button>
          )}
        </div>
  
        {(!bankDetails || isEditing) ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Account Holder Name</label>
              <input
                type="text"
                required
                value={formData.account_holder_name}
                onChange={(e) => setFormData({...formData, account_holder_name: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="text"
                required
                value={formData.account_number}
                onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">IFSC Code</label>
              <input
                type="text"
                required
                value={formData.ifsc_code}
                onChange={(e) => setFormData({...formData, ifsc_code: e.target.value.toUpperCase()})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Bank Name</label>
              <input
                type="text"
                required
                value={formData.bank_name}
                onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Branch Name</label>
              <input
                type="text"
                required
                value={formData.branch_name}
                onChange={(e) => setFormData({...formData, branch_name: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            <div className="flex gap-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(bankDetails);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Details
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Account Holder Name</p>
              <p className="font-medium">{bankDetails.account_holder_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Number</p>
              <p className="font-medium">{bankDetails.account_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">IFSC Code</p>
              <p className="font-medium">{bankDetails.ifsc_code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bank Name</p>
              <p className="font-medium">{bankDetails.bank_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Branch Name</p>
              <p className="font-medium">{bankDetails.branch_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Verification Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${bankDetails.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {bankDetails.is_verified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

export default BankDetailsForm;
