'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import BlogForm from './BlogForm';
import { getTokens } from '@/utils/cookies';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBlog, setEditingBlog] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        is_active: '',  // Change from empty string to null
        show_in_slider: ''  // Change from empty string to null
    });
    const {token } = getTokens()
     useEffect(() => {
        fetchBlogs();
    }, [filters]);

    const fetchBlogs = async () => {
        try {
            // Only add parameters that have values
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.is_active !== '') params.is_active = filters.is_active;
            if (filters.show_in_slider !== '') params.show_in_slider = filters.show_in_slider;

            const queryParams = new URLSearchParams(params).toString();
            console.log('Query params being sent:', queryParams); // Debug log
            // const queryParams = new URLSearchParams({
            //     search: filters.search,
            //     is_active: filters.isActive,
            //     show_in_slider: filters.showInSlider
            // }).toString();
       
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/blogs/${queryParams ? `?${queryParams}` : ''}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                         'Accept': 'application/json'
                    }
                }
            );
            // Add error handling for non-200 responses
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error fetching blogs');
            }
    
            const data = await response.json();
            console.log('Received data:', data); // Debug log
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error('Error fetching blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
          
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                toast.success('Blog deleted successfully');
                fetchBlogs();
            } else {
                toast.error('Error deleting blog');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error deleting blog');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
         
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}/toggle_status/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                fetchBlogs();
                toast.success('Status updated successfully');
            } else {
                toast.error('Error updating status');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error updating status');
        }
    };

    const handleToggleSlider = async (id) => {
        try {
         
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}/toggle_slider/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                fetchBlogs();
                toast.success('Slider status updated successfully');
            } else {
                toast.error('Error updating slider status');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error updating slider status');
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
                <h1 className="text-2xl font-bold">Blogs</h1>
                <BlogForm onSuccess={fetchBlogs} />
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="border rounded-lg px-4 py-2"
                />
                <select
                    value={filters.is_active}
                    onChange={(e) => setFilters({ 
                        ...filters, 
                        is_active: e.target.value 
                    })}
                    className="border rounded-lg px-4 py-2"
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <select
                    value={filters.show_in_slider}
                    onChange={(e) => setFilters({ 
                        ...filters, 
                        show_in_slider: e.target.value
                    })}
                    className="border rounded-lg px-4 py-2"
                >
                    <option value="">All Slider Status</option>
                    <option value="true">Show in Slider</option>
                    <option value="false">Hide from Slider</option>
                </select>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {blog.feature_image_url && (
                            <div className="relative h-48">
                                <Image
                                    src={blog.feature_image_url}
                                    alt={blog.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        )}
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                            <p className="text-gray-600 text-sm mb-4">
                                {blog.content.substring(0, 150)}...
                            </p>
                            
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    blog.is_active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {blog.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    blog.show_in_slider
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {blog.show_in_slider ? 'In Slider' : 'Not in Slider'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="space-x-2">
                                    <button
                                        onClick={() => setEditingBlog(blog)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(blog.id)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        <EyeIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleToggleSlider(blog.id)}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Toggle Slider
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingBlog && (
                <BlogForm
                    blog={editingBlog}
                    onSuccess={() => {
                        fetchBlogs();
                        setEditingBlog(null);
                    }}
                    onClose={() => setEditingBlog(null)}
                />
            )}
        </div>
    );
};

export default BlogList;