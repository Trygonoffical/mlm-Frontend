'use client'

import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Fragment, useState , useEffect} from 'react'
import { Dialog,DialogPanel, DialogTitle,Transition ,TransitionChild } from '@headlessui/react'
import { XMarkIcon} from '@heroicons/react/24/outline'
import { PencilIcon } from 'lucide-react';


const EdfitPositionForm = ({setRefreshKey , data={}}) => {
    const [isSidebarVisible , setisSidebarVisible]  = useState(false)
    const [id , setId]  = useState(null)
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

      }
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('udp[ated')
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/positions/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Position updated successfully');
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
                toast.error(data.message || 'Error updated position');
            }
        } catch (error) {
            toast.error('Error updated position');
            console.log('error-' , error)
        }
    };

    useEffect(() => {
        setFormData({
            name: data.name,
            bp_required_min: data.bp_required_min,
            bp_required_max: data.bp_required_max,
            discount_percentage: data.discount_percentage,
            commission_percentage: data.commission_percentage,
            can_earn_commission: data.can_earn_commission,
            monthly_quota: data.monthly_quota,
            level_order: data.level_order,
            is_active: data.is_active,
        })
        setId(data.id)
        }, [data]);

    return (
        <>
            <button className="text-blue-600 hover:text-blue-900"  onClick={()=>showSidebarStatus()}>
                <PencilIcon className="h-5 w-5" />
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
                                                </div>

                                                <div>
                                                    <label className="block mb-1">Minimum BP Required</label>
                                                    <input
                                                        type="number"
                                                        name="bp_required_min"
                                                        value={formData.bp_required_min}
                                                        onChange={handleChange}
                                                        className="w-full p-2 border rounded"
                                                        required
                                                    />
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
                                            Update Position
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

export default EdfitPositionForm;