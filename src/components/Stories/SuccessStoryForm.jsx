'use client'

import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const SuccessStoryForm = ({ successStory, setRefreshKey, onClose }) => {
    const [isOpen, setIsOpen] = useState(!!successStory);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: successStory?.title || '',
        youtube_link: successStory?.youtube_link || '',
        description: successStory?.description || '',
        position: successStory?.position || '',
        is_active: successStory?.is_active ?? true,
        thumbnail: null
    });
    const [previewUrl, setPreviewUrl] = useState(successStory?.thumbnail_url || null);

    useEffect(() => {
        if (successStory) {
            setFormData({
                title: successStory.title || '',
                youtube_link: successStory.youtube_link || '',
                description: successStory.description || '',
                position: successStory.position || '',
                is_active: successStory.is_active ?? true,
                thumbnail: null
            });
            setPreviewUrl(successStory.thumbnail_url || null);
        }
    }, [successStory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'thumbnail' && formData[key]) {
                form.append('thumbnail', formData[key]);
            } else if (key !== 'thumbnail' && formData[key] !== null) {
                form.append(key, formData[key]);
            }
        });

        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const url = successStory
                ? `${process.env.NEXT_PUBLIC_API_URL}/success-story/${successStory.id}/`
                : `${process.env.NEXT_PUBLIC_API_URL}/success-story/`;

            const response = await fetch(url, {
                method: successStory ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Success story ${successStory ? 'updated' : 'created'} successfully`);
                setRefreshKey(old => old + 1);
                setIsOpen(false);
                if (onClose) onClose();
            } else {
                throw new Error(data.message || `Failed to ${successStory ? 'update' : 'create'} success story`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file' && files[0]) {
            setFormData(prev => ({
                ...prev,
                thumbnail: files[0]
            }));
            setPreviewUrl(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <>
            {!successStory && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                >
                    Add Success Story
                </button>
            )}

            <Dialog 
                open={isOpen} 
                onClose={handleClose}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-md rounded bg-white p-6 w-full">
                        <div className="flex justify-between items-center mb-4">
                            <DialogTitle className="text-lg font-medium">
                                {successStory ? 'Edit' : 'Add'} Success Story
                            </DialogTitle>
                            <button 
                                onClick={handleClose}
                                className="hover:bg-gray-100 p-1 rounded-full transition duration-200"
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
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">YouTube Link</label>
                                <input
                                    type="url"
                                    name="youtube_link"
                                    value={formData.youtube_link}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                                <input
                                    type="file"
                                    name="thumbnail"
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
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Position</label>
                                <input
                                    type="number"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    min="0"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Active</label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            >
                                {loading ? 
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {successStory ? 'Updating...' : 'Creating...'}
                                    </span>
                                    : 
                                    `${successStory ? 'Update' : 'Create'} Success Story`
                                }
                            </button>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default SuccessStoryForm;