'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Dialog, DialogContent, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const MLMMemberForm = ({ setRefreshKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone_number: '',
        first_name: '',
        last_name: '',
        position_id: '',
        sponsor_id: '',
        is_active: true
    });

    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/positions/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
           
            setPositions(data);
        } catch (error) {
            console.error('Error fetching positions:', error);
            toast.error('Error fetching positions');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            // Helper function to display error messages
            const getErrorMessage = (fieldName) => {
                if (!errors) return null;
                
                // Check for nested errors
                if (errors[fieldName]) {
                    return Array.isArray(errors[fieldName]) 
                        ? errors[fieldName].join(', ')
                        : errors[fieldName];
                }
                
                // Check for field-specific errors in root errors
                if (errors.non_field_errors) {
                    return errors.non_field_errors.join(', ');
                }
                
                return null;
            };
            if (response.ok) {
                toast.success('MLM Member created successfully');
                setRefreshKey(old => old + 1);
                setIsOpen(false);
                setFormData({
                    username: '',
                    password: '',
                    email: '',
                    phone_number: '',
                    first_name: '',
                    last_name: '',
                    position_id: '',
                    sponsor_id: '',
                    is_active: true
                });
            } else {
                setErrors(data);
                // toast.error('Please correct the errors in the form');
                // Display first error message in toast
                const firstError = Object.values(data)[0];
                toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                console.log('error - ' , data)
            }
        } catch (error) {
            console.error('Error creating member:', error);
            toast.error('Error creating member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Add New Member
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 w-full">
                        <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-medium">Create MLM Member</Dialog.Title>
                            <button onClick={() => setIsOpen(false)}>
                                <XMarkIcon className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.username ? 'border-red-500' : 'border-gray-300'
                                        } shadow-sm p-2`}
                                        required
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600">{errors.username.join(', ')}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.password ? 'border-red-500' : 'border-gray-300'
                                        } shadow-sm p-2`}
                                        required
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password.join(', ')}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.first_name ? 'border-red-500' : 'border-gray-300'
                                        } shadow-sm p-2`}
                                        required
                                    />
                                    {errors.first_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.first_name.join(', ')}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.last_name ? 'border-red-500' : 'border-gray-300'
                                        } shadow-sm p-2`}
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.last_name.join(', ')}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        } shadow-sm p-2`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.join(', ')}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                        } shadow-sm p-2`}
                                        required
                                        maxLength="10"
                                    />
                                    {errors.phone_number && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone_number.join(', ')}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <select
                                        name="position_id"
                                        value={formData.position_id}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.position_id ? 'border-red-500' : 'border-gray-300'
                                        } shadow-sm p-2`}
                                        required
                                    >
                                        <option value="">Select Position</option>
                                        {positions.map(position => (
                                            <option key={position.id} value={position.id}>
                                                {position.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.position_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.position_id.join(', ')}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sponsor ID (Optional)</label>
                                    <input
                                        type="text"
                                        name="sponsor_id"
                                        value={formData.sponsor_id}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border ${
                                            errors.sponsor_id ? 'border-red-500' : 'border-gray-300'
                                        } shadow-sm p-2`}
                                    />
                                    {errors.sponsor_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.sponsor_id.join(', ')}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Member'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
};

export default MLMMemberForm;