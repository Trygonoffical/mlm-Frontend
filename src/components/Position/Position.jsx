'use client'

import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Fragment, useState , useContext, useEffect} from 'react'
import { Dialog,DialogPanel, DialogTitle,Transition ,TransitionChild } from '@headlessui/react'
import { XMarkIcon, ShoppingCartIcon , ShoppingBagIcon, TrashIcon} from '@heroicons/react/24/outline'


const PositionForm = ({setRefreshKey}) => {
    const [isSidebarVisible , setisSidebarVisible]  = useState(false)
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        bp_required_min: '',
        bp_required_max: '',
        discount_percentage: '',
        commission_percentage: '',
        can_earn_commission: false,
        monthly_quota: '',
        level_order: '',
        is_active: true
    });

    const showSidebarStatus = () =>{
        setisSidebarVisible(true);
      }
    //   // hide CartSidebar 
      const hideSidebarStatus = ()=>{
        // console.log('vvvv')
        setisSidebarVisible(false);
        setFormData({
            name: '',
            bp_required_min: '',
            bp_required_max: '',
            discount_percentage: '',
            commission_percentage: '',
            can_earn_commission: false,
            monthly_quota: '',
            level_order: '',
            is_active: true
        })
        setErrors({})

      }
    // Update handleChange to handle numeric values properly
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? '' : type === 'number' ? parseFloat(value) : value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
    
        // Validate BP range
        if (parseInt(formData.bp_required_min) > parseInt(formData.bp_required_max)) {
            newErrors.bp_required_min = ['Minimum BP cannot be greater than maximum BP'];
        }
    
        // Validate percentages
        if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
            newErrors.discount_percentage = ['Discount percentage must be between 0 and 100'];
        }
        if (formData.commission_percentage < 0 || formData.commission_percentage > 100) {
            newErrors.commission_percentage = ['Commission percentage must be between 0 and 100'];
        }
    
        // Validate monthly quota
        if (formData.monthly_quota < 0) {
            newErrors.monthly_quota = ['Monthly quota cannot be negative'];
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validate form before submission
        if (!validateForm()) {
            toast.error('Please correct the errors in the form');
            return;
        }
        // Convert string values to appropriate types
        const processedFormData = {
            ...formData,
            bp_required_min: parseInt(formData.bp_required_min),
            bp_required_max: parseInt(formData.bp_required_max),
            discount_percentage: parseFloat(formData.discount_percentage),
            commission_percentage: parseFloat(formData.commission_percentage),
            monthly_quota: parseFloat(formData.monthly_quota),
            level_order: parseInt(formData.level_order),
            can_earn_commission: Boolean(formData.can_earn_commission),
            is_active: Boolean(formData.is_active)
        };

        // Log the data being sent
        console.log('Sending data:', processedFormData);
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/positions/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(processedFormData)
            });
    
            const data = await response.json();
            console.log('Server response:', data);
    
            if (response.ok) {
                toast.success('Position created successfully');
                setFormData({
                    name: '',
                    bp_required_min: '',
                    bp_required_max: '',
                    discount_percentage: '',
                    commission_percentage: '',
                    can_earn_commission: false,
                    monthly_quota: '',
                    level_order: '',
                    is_active: true
                });
                setRefreshKey(old => old + 1);
                hideSidebarStatus();
            } else {
                // Display specific error messages from the server
                if (data.error) {
                    toast.error(data.error);
                } else if (typeof data === 'object') {
                    // Handle validation errors
                    Object.keys(data).forEach(key => {
                        const errorMessage = `${key}: ${data[key].join(', ')}`;
                        toast.error(errorMessage);
                    });
                } else {
                    toast.error('Error creating position');
                }
                console.error('Server error response:', data);
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Error creating position');
        }
    };

    return (
        <>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"  onClick={()=>showSidebarStatus()}>
                New Position
            </button>
        <Transition show={isSidebarVisible} as={Fragment}>
        <Dialog className="relative z-[9999]" onClose={()=>hideSidebarStatus()}>
            <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-400"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full md:pl-10">
                <TransitionChild
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-400"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-400"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                >
                    <DialogPanel className="pointer-events-auto w-screen max-w-md ">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                            <DialogTitle className="text-lg font-medium text-gray-900">Create Position</DialogTitle>
                            <div className="ml-3 flex h-7 items-center">
                            <button
                                type="button"
                                className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                onClick={()=>hideSidebarStatus()}
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flow-root">
                            <form onSubmit={handleSubmit} className="space-y-6">
                <div className=" ">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                            <label className="block mb-1">Position Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.join(', ')}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1">Level Order</label>
                            <input
                                type="number"
                                name="level_order"
                                value={formData.level_order}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                             {errors.level_order && (
                            <p className="text-red-500 text-sm mt-1">{errors.level_order.join(', ')}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1">Minimum BP Required</label>
                            <input
                                type="number"
                                name="bp_required_min"
                                value={formData.bp_required_min}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="0"
                                step="1"  
                                required
                            />
                            {errors.bp_required_min && (
                                <p className="text-red-500 text-sm mt-1">{errors.bp_required_min.join(', ')}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1">Maximum BP Required</label>
                            <input
                                type="number"
                                name="bp_required_max"
                                value={formData.bp_required_max}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                                
                            />
                            {errors.bp_required_max && (
                                <p className="text-red-500 text-sm mt-1">{errors.bp_required_max.join(', ')}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1">Discount Percentage</label>
                            <input
                                type="number"
                                name="discount_percentage"
                                value={formData.discount_percentage}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                step="0.01"
                                min="0"
                                max="100"
                                required
                            />
                             {errors.discount_percentage && (
                            <p className="text-red-500 text-sm mt-1">{errors.discount_percentage.join(', ')}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1">Commission Percentage</label>
                            <input
                                type="number"
                                name="commission_percentage"
                                value={formData.commission_percentage}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                step="0.01"
                                min="0"
                                max="100"
                                required
                            />
                             {errors.commission_percentage && (
                            <p className="text-red-500 text-sm mt-1">{errors.commission_percentage.join(', ')}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1">Monthly Quota</label>
                            <input
                                type="number"
                                name="monthly_quota"
                                value={formData.monthly_quota}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                step="0.01"
                                required
                            />
                             {errors.monthly_quota && (
                            <p className="text-red-500 text-sm mt-1">{errors.monthly_quota.join(', ')}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="can_earn_commission"
                                checked={formData.can_earn_commission}
                                onChange={handleChange}
                                className="rounded"
                            />
                            <label>Can Earn Commission</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="rounded"
                            />
                            <label>Is Active</label>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create Position
                </button>
            </form>
                            </div>
                        </div>
                        </div>
                    </div>
                    </DialogPanel>
                </TransitionChild>
                </div>
            </div>
            </div>
        </Dialog>
        </Transition>
        </>
    );
};

export default PositionForm;