'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { PencilIcon, TrashIcon, LinkIcon, GlobeAltIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import CustomPageForm from './CustomPageForm';

const CustomPageList = () => {
    const [pages, setPages] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editingPage, setEditingPage] = useState(null);

    useEffect(() => {
        fetchPages();
    }, [refreshKey]);

    const fetchPages = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/custom-pages/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setPages(data);
        } catch (error) {
            console.error('Error fetching pages:', error);
            toast.error('Error fetching pages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/custom-pages/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Page deleted successfully');
                setRefreshKey(old => old + 1);
            } else {
                toast.error('Error deleting page');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error deleting page');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/custom-pages/${id}/toggle-status/`,
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
                <h1 className="text-2xl font-bold">Custom Pages</h1>
                <CustomPageForm setRefreshKey={setRefreshKey} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map(page => (
                    <div 
                        key={page.id} 
                        className="bg-white rounded-lg shadow p-6 relative"
                    >
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                                onClick={() => setEditingPage(page)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(page.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">{page.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">/{page.slug}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {page.show_in_header && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    Header
                                </span>
                            )}
                            {page.show_in_footer && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                    Footer
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                                <ListBulletIcon className="h-4 w-4 mr-1" />
                                Order: {page.order}
                            </span>
                            <a 
                                href={`/page/${page.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <GlobeAltIcon className="h-4 w-4 mr-1" />
                                View Page
                            </a>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                page.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {page.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                                onClick={() => handleToggleStatus(page.id)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Toggle Status
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingPage && (
                <CustomPageForm
                    page={editingPage}
                    setRefreshKey={setRefreshKey}
                    onClose={() => setEditingPage(null)}
                />
            )}
        </div>
    );
};

export default CustomPageList;