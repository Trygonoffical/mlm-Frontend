import { useState, useEffect , Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogPanel, DialogTitle ,Transition ,TransitionChild} from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { getTokens } from '@/utils/cookies';

const AddressManager = ({ onSelect, showSelection = false }) => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user info and token from Redux store
  const { userInfo } = useSelector((state) => state.auth);
  const {token} = getTokens()
  const [formData, setFormData] = useState({
    name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
  });

  const fetchAddresses = async () => {
    try {
    
    console.log('tokenval - ' , token)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.log('featch address error' , response)
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      console.log('data address ', data)
      setAddresses(data);
    } catch (error) {
      toast.error('Failed to fetch addresses');
      console.log('data error address ', error)

      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]); // Re-fetch when token changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('tokenval - ' , token)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        console.log('address featching error - ' , response)
        throw new Error('Failed to add address');
      }

      toast.success('Address added successfully');
      setIsModalOpen(false);
      fetchAddresses();
      setFormData({
        name: '',
        street_address: '',
        city: '',
        state: '',
        postal_code: '',
      });
    } catch (error) {
      toast.error('Failed to add address');
      console.error('Error adding address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}/set_default/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      await fetchAddresses();
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to update default address');
      console.error('Error setting default address:', error);
    }
  };

  const deleteAddress = async (id) => {
    try {
    
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
      console.error('Error deleting address:', error);
    }
  };

  // if (!token) {
  //   return <div>Please log in to manage addresses</div>;
  // }

  return (
    <>

    {/* <div className="space-y-4"> */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 text-sm"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Add New 
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`p-4 border rounded-lg ${
              address.is_active ? 'border-indigo-500' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{address.name}</p>
                <p className="text-sm text-gray-600">{address.street_address}</p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} {address.postal_code}
                </p>
              </div>
              {address.is_active && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Default
                </span>
              )}
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              {!address.is_active && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Set as Default
                </button>
              )}
              {showSelection && (
                <button
                  onClick={() => onSelect(address)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Select
                </button>
              )}
              <button
                onClick={() => deleteAddress(address.id)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Address Form Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-full min-w-full md:min-w-[412px] rounded bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <DialogTitle className="text-lg font-medium">
                Add New Address
              </DialogTitle>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  placeholder="Home, Office, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.street_address}
                  onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit postal code"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Adding...' : 'Add Address'}
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>

    {/* </div> */}
    </>
  );
};

export default AddressManager;