'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { 
    PencilIcon, 
    TrashIcon, 
    ArrowUpIcon,
    ArrowDownIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import HomeSectionForm from './HomeSectionForm';
import { getTokens } from '@/utils/cookies';

const HomeSectionList = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { token } = getTokens()
    const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/home-sections`;

    useEffect(() => {
        fetchSections();
    }, [refreshKey]);

    const fetchSections = async () => {
        try {
            
            const response = await fetch(API_BASE_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || 'Failed to fetch section');
            
            
            setSections(data);
        } catch (error) {
            console.log('Error:', error);
            toast.error('Failed to load sections');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this section?')) return;

        try {
            
            const response = await fetch(`${API_BASE_URL}/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete section');
            
            toast.success('Section deleted successfully');
            setRefreshKey(old => old + 1);
        } catch (error) {
            console.log('Error:', error);
            toast.error('Failed to delete section');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            
            const response = await fetch(`${API_BASE_URL}/${id}/toggle_status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to update status');
            
            toast.success('Status updated successfully');
            setRefreshKey(old => old + 1);
        } catch (error) {
            console.log('Error:', error);
            toast.error('Failed to update status');
        }
    };

    const handleUpdateOrder = async (section, newOrder) => {
        try {
            
            const response = await fetch(`${API_BASE_URL}/${section.id}/update_display_order/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ display_order: newOrder })
            });

            if (!response.ok) throw new Error('Failed to update order');
            
            setRefreshKey(old => old + 1);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update order');
        }
    };

    const handleMoveUp = (index) => {
        if (index > 0) {
            const currentSection = sections[index];
            const prevSection = sections[index - 1];
            handleUpdateOrder(currentSection, prevSection.display_order);
            handleUpdateOrder(prevSection, currentSection.display_order);
        }
    };

    const handleMoveDown = (index) => {
        if (index < sections.length - 1) {
            const currentSection = sections[index];
            const nextSection = sections[index + 1];
            handleUpdateOrder(currentSection, nextSection.display_order);
            handleUpdateOrder(nextSection, currentSection.display_order);
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
                <h1 className="text-2xl font-bold">Home Sections</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                             flex items-center space-x-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Section</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, index) => (
                    <div 
                        key={section.id} 
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                    >
                        <div className="relative">
                            {section.image_url && (
                                <div className="aspect-w-16 aspect-h-9 mb-4">
                                    <Image
                                        src={section.image_url}
                                        alt={section.title}
                                        width={400}
                                        height={225}
                                        className="rounded-lg object-cover"
                                    />
                                </div>
                            )}
                            
                            <div className="absolute top-2 right-2 flex space-x-1">
                                <button
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                    className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 
                                             disabled:opacity-50 disabled:hover:bg-white"
                                >
                                    <ArrowUpIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === sections.length - 1}
                                    className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100
                                             disabled:opacity-50 disabled:hover:bg-white"
                                >
                                    <ArrowDownIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-semibold">{section.title}</h2>
                                    <p className="text-sm text-gray-600">{section.section_type_display}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingSection(section);
                                            setShowForm(true);
                                        }}
                                        className="p-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(section.id)}
                                        className="p-1 text-red-600 hover:text-red-800"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {section.subtitle && (
                                <p className="text-sm text-gray-600">{section.subtitle}</p>
                            )}

                            <div className="mt-4 flex justify-between items-center">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    section.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {section.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                    onClick={() => handleToggleStatus(section.id)}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Toggle Status
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <HomeSectionForm
                    section={editingSection}
                    onClose={() => {
                        setShowForm(false);
                        setEditingSection(null);
                    }}
                    onSave={() => {
                        setRefreshKey(old => old + 1);
                        setShowForm(false);
                        setEditingSection(null);
                    }}
                />
            )}
        </div>
    );
};

export default HomeSectionList;