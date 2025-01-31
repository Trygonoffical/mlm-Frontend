'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { PencilIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import AdvertisementForm from './AdvertisementForm';

const AdvertisementList = () => {
    const [advertisements, setAdvertisements] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editingAd, setEditingAd] = useState(null);

    useEffect(() => {
        fetchAdvertisements();
    }, [refreshKey]);

    const fetchAdvertisements = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisements/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAdvertisements(data);
        } catch (error) {
            console.error('Error fetching advertisements:', error);
            toast.error('Error fetching advertisements');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this advertisement?')) return;

        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisements/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Advertisement deleted successfully');
                setRefreshKey(old => old + 1);
            } else {
                toast.error('Error deleting advertisement');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error deleting advertisement');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/advertisements/${id}/toggle_status/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                setRefreshKey(old => old + 1);
                toast.success('Status updated successfully');
            } else {
                toast.error('Error updating status');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error updating status');
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
                <h1 className="text-2xl font-bold">Advertisements</h1>
                <AdvertisementForm setRefreshKey={setRefreshKey} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advertisements.map(ad => (
                    <div 
                        key={ad.id} 
                        className="bg-white rounded-lg shadow p-6 relative"
                    >
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                                onClick={() => setEditingAd(ad)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(ad.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {ad.image_url && (
                            <div className="mb-4">
                                <Image
                                    src={ad.image_url}
                                    alt={ad.title || 'Advertisement'}
                                    width={300}
                                    height={200}
                                    className="rounded object-cover w-full"
                                />
                            </div>
                        )}

                        <h3 className="text-lg font-semibold">{ad.title || 'Untitled'}</h3>
                        <p className="text-gray-600 text-sm mb-2">{ad.position || 'No position specified'}</p>

                        {ad.link && (
                            <a 
                                href={ad.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                            >
                                <LinkIcon className="h-4 w-4 mr-1" />
                                View Link
                            </a>
                        )}

                        <div className="flex items-center justify-between mt-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                ad.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {ad.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                                onClick={() => handleToggleStatus(ad.id)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Toggle Status
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingAd && (
                <AdvertisementForm
                    advertisement={editingAd}
                    setRefreshKey={setRefreshKey}
                    onClose={() => setEditingAd(null)}
                />
            )}
        </div>
    );
};

export default AdvertisementList;