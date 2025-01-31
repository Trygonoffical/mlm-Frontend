'use client'

import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const AdvertisementForm = ({ advertisement, setRefreshKey, onClose }) => {
    const [isOpen, setIsOpen] = useState(!!advertisement);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: advertisement?.title || '',
        link: advertisement?.link || '',
        position: advertisement?.position || '',
        is_active: advertisement?.is_active ?? true,
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(advertisement?.image_url || null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && formData[key]) {
                form.append('image', formData[key]);
            } else if (key !== 'image' && formData[key] !== null) {
                form.append(key, formData[key]);
            }
        });

        try {
            const token = Cookies.get('token');
            const url = advertisement
                ? `${process.env.NEXT_PUBLIC_API_URL}/advertisements/${advertisement.id}/`
                : `${process.env.NEXT_PUBLIC_API_URL}/advertisements/`;

            const response = await fetch(url, {
                method: advertisement ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            if (response.ok) {
                toast.success(`Advertisement ${advertisement ? 'updated' : 'created'} successfully`);
                setRefreshKey(old => old + 1);
                setIsOpen(false);
                if (onClose) onClose();
            } else {
                const data = await response.json();
                toast.error(data.message || `Error ${advertisement ? 'updating' : 'creating'} advertisement`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(`Error ${advertisement ? 'updating' : 'creating'} advertisement`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file' && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
            setPreviewUrl(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    return (
        <>
            {!advertisement && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Advertisement
                </button>
            )}

            <Dialog 
                open={isOpen} 
                onClose={() => {
                    setIsOpen(false);
                    if (onClose) onClose();
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-md rounded bg-white p-6 w-full">
                        <div className="flex justify-between items-center mb-4">
                            <DialogTitle className="text-lg font-medium">
                                {advertisement ? 'Edit' : 'Add'} Advertisement
                            </DialogTitle>
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    if (onClose) onClose();
                                }}
                            >
                                <XMarkIcon className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Link</label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="mt-1 block w-full"
                                />
                                {previewUrl && (
                                    <div className="mt-2">
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            width={100}
                                            height={100}
                                            className="rounded-full"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1">Position</label>
                                <input
                                type="number"
                                value={formData.position}
                                onChange={(e) => setFormData({...formData, position: e.target.value})}
                                className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label className="ml-2 text-sm text-gray-700">Active</label>
                            </div>
                            <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 
                                        `${advertisement ? 'Updating...' : 'Creating...'}` : 
                                        `${advertisement ? 'Update' : 'Create'} advertisement`
                                    }
                            </button>
                       </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};
    export default AdvertisementForm;