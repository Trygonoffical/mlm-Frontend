// MenuList.js
'use client'

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ArrowUpIcon, ArrowDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import MenuForm from './MenuForm';

function MenuList() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchMenuItems();
    }, [refreshKey]);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/`);
            if (!response.ok) throw new Error('Failed to fetch menu items');
            const data = await response.json();
            setMenuItems(data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load menu items');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}/`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete menu item');
            
            toast.success('Menu item deleted successfully');
            setRefreshKey(old => old + 1);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to delete menu item');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}/toggle_status/`, {
                method: 'POST'
            });

            if (!response.ok) throw new Error('Failed to update status');
            
            toast.success('Status updated successfully');
            setRefreshKey(old => old + 1);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update status');
        }
    };

    const handleMoveItem = async (id, newPosition) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}/update_position/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ position: newPosition })
            });

            if (!response.ok) throw new Error('Failed to update position');
            
            setRefreshKey(old => old + 1);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update position');
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
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Menu Items</h1>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Add Menu Item
                </button>
            </div>

            {/* Menu Items List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {menuItems.map((item, index) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span>{item.position}</span>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => handleMoveItem(
                                                    item.id,
                                                    index > 0 ? menuItems[index - 1].position : item.position
                                                )}
                                                disabled={index === 0}
                                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                            >
                                                <ArrowUpIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleMoveItem(
                                                    item.id,
                                                    index < menuItems.length - 1 ? menuItems[index + 1].position : item.position
                                                )}
                                                disabled={index === menuItems.length - 1}
                                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                            >
                                                <ArrowDownIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-medium text-gray-900">
                                        {item.category_name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleToggleStatus(item.id)}
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            item.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingItem(item);
                                                setShowForm(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {showForm && (
                <MenuForm
                    menuItem={editingItem}
                    onClose={() => {
                        setShowForm(false);
                        setEditingItem(null);
                    }}
                    onSave={() => {
                        setRefreshKey(old => old + 1);
                        setShowForm(false);
                        setEditingItem(null);
                    }}
                />
            )}
        </div>
    );
}

export default MenuList;