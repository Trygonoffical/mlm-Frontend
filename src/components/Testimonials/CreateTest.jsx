'use client'

import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const TestimonialForm = ({ testimonial, setRefreshKey, onClose }) => {
    const [isOpen, setIsOpen] = useState(!!testimonial);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: testimonial?.name || '',
        designation: testimonial?.designation || '',
        content: testimonial?.content || '',
        rating: testimonial?.rating || 5,
        is_active: testimonial?.is_active ?? true,
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(testimonial?.image_url || null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && formData[key]) {
                form.append('image', formData[key]);
            } else if (key !== 'image') {
                form.append(key, formData[key]);
            }
        });

        try {
            const token = Cookies.get('token');
            const url = testimonial
                ? `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${testimonial.id}/`
                : `${process.env.NEXT_PUBLIC_API_URL}/testimonials/`;

            const response = await fetch(url, {
                method: testimonial ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            if (response.ok) {
                toast.success(`Testimonial ${testimonial ? 'updated' : 'created'} successfully`);
                setRefreshKey(old => old + 1);
                setIsOpen(false);
                if (onClose) onClose();
            } else {
                const data = await response.json();
                toast.error(data.message || `Error ${testimonial ? 'updating' : 'creating'} testimonial`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(`Error ${testimonial ? 'updating' : 'creating'} testimonial`);
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
            // Create preview URL for image
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
            {!testimonial && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Testimonial
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
                                {testimonial ? 'Edit' : 'Add'} Testimonial
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
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                    required
                                    minLength={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                    required
                                    minLength={10}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rating</label>
                                <select
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                >
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <option key={num} value={num}>
                                            {num} Star{num !== 1 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
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

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (onClose) onClose();
                                    }}
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 
                                        `${testimonial ? 'Updating...' : 'Creating...'}` : 
                                        `${testimonial ? 'Update' : 'Create'} Testimonial`
                                    }
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default TestimonialForm;