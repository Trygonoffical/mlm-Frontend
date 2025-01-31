'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { 
    PencilIcon, 
    TrashIcon, 
    VideoCameraIcon 
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import CustomerPickForm from './CustomerPickForm';

const CustomerPickList = () => {
    const [customerPicks, setCustomerPicks] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editingPick, setEditingPick] = useState(null);

    useEffect(() => {
        fetchCustomerPicks();
    }, [refreshKey]);

    const fetchCustomerPicks = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-pick/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch customer picks');
            }

            const data = await response.json();
            setCustomerPicks(data);
        } catch (error) {
            console.error('Error fetching customer picks:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer pick?')) return;

        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-pick/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete customer pick');
            }

            toast.success('Customer pick deleted successfully');
            setRefreshKey(old => old + 1);
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/customer-pick/${id}/toggle_status/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            setRefreshKey(old => old + 1);
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customer Picks</h1>
                <CustomerPickForm setRefreshKey={setRefreshKey} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {customerPicks.map(pick => (
                    <div 
                        key={pick.id} 
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 relative"
                    >
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                                onClick={() => setEditingPick(pick)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition duration-200"
                                title="Edit"
                            >
                            <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(pick.id)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition duration-200"
                                title="Delete"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {pick.thumbnail_url && (
                            <div className="mb-4 relative h-48 mt-3">
                                <Image
                                    src={pick.thumbnail_url}
                                    alt={pick.title || 'Customer Pick'}
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        )}

                        <h3 className="text-lg font-semibold mb-2">{pick.title || 'Untitled'}</h3>
                        
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {pick.description || 'No description available'}
                        </p>
                        
                        <p className="text-gray-500 text-sm mb-2">
                            Position: {pick.position || 'Not specified'}
                        </p>

                        {pick.youtube_link && (
                            <a 
                                href={pick.youtube_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm"
                            >
                                <VideoCameraIcon className="h-4 w-4 mr-1" />
                                Watch Review
                            </a>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                pick.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {pick.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                                onClick={() => handleToggleStatus(pick.id)}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Toggle Status
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingPick && (
                <CustomerPickForm
                    customerPick={editingPick}
                    setRefreshKey={setRefreshKey}
                    onClose={() => setEditingPick(null)}
                />
            )}
        </div>
    );
};

export default CustomerPickList;