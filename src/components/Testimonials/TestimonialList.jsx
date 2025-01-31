'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import TestimonialForm from './CreateTest';

const TestimonialList = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editingTestimonial, setEditingTestimonial] = useState(null);

    useEffect(() => {
        fetchTestimonials();
    }, [refreshKey]);

    const fetchTestimonials = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTestimonials(data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            toast.error('Error fetching testimonials');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Testimonial deleted successfully');
                setRefreshKey(old => old + 1);
            } else {
                toast.error('Error deleting testimonial');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error deleting testimonial');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}/toggle_status/`,
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
                <h1 className="text-2xl font-bold">Testimonials</h1>
                <TestimonialForm setRefreshKey={setRefreshKey} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map(testimonial => (
                    <div 
                        key={testimonial.id} 
                        className="bg-white rounded-lg shadow p-6 relative"
                    >
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                                onClick={() => setEditingTestimonial(testimonial)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(testimonial.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {testimonial.image_url && (
                            <div className="mb-4">
                                <Image
                                    src={testimonial.image_url}
                                    alt={testimonial.name}
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                            </div>
                        )}

                        <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{testimonial.designation}</p>
                        
                        <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`h-5 w-5 ${
                                        i < testimonial.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>

                        <p className="text-gray-700 mb-4">{testimonial.content}</p>

                        <div className="flex items-center justify-between mt-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                testimonial.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {testimonial.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                                onClick={() => handleToggleStatus(testimonial.id)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Toggle Status
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingTestimonial && (
                <TestimonialForm
                    testimonial={editingTestimonial}
                    setRefreshKey={setRefreshKey}
                    onClose={() => setEditingTestimonial(null)}
                />
            )}
        </div>
    );
};

export default TestimonialList;