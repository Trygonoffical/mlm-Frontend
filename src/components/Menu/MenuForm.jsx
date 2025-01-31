'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog , DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';


const MenuForm = ({ menuItem = null, onClose, onSave }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category: '',
        position: 0,
        is_active: true
    });

    useEffect(() => {
        fetchCategories();
        if (menuItem) {
            setFormData({
                category: menuItem.category,
                position: menuItem.position,
                is_active: menuItem.is_active
            });
        }
    }, [menuItem]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = Cookies.get('token');
            
            const url = menuItem 
                ? `${process.env.NEXT_PUBLIC_API_URL}/menu/${menuItem.id}/`
                : `${process.env.NEXT_PUBLIC_API_URL}/menu/`;

            const response = await fetch(url, {
                method: menuItem ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to save menu item');
            }

            toast.success(`Menu item ${menuItem ? 'updated' : 'created'} successfully`);
            if (onSave) onSave();
            if (onClose) onClose();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        } finally {
            setSaving(false);
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
        <Dialog 
            as="div" 
            className="fixed inset-0 z-10 overflow-y-auto" 
            onClose={onClose}
            open={true}
        >
            <div className="min-h-screen px-4 text-center">
                {/* <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" /> */}

                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <DialogTitle className="text-lg font-medium">
                            {menuItem ? 'Edit Menu Item' : 'Add Menu Item'}
                        </DialogTitle>
                        <button onClick={onClose}>
                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    category: e.target.value 
                                }))}
                                required
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Position</label>
                            <input
                                type="number"
                                name="position"
                                value={formData.position}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    position: parseInt(e.target.value) || 0
                                }))}
                                min="0"
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    is_active: e.target.checked
                                }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Active Status
                            </label>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    menuItem ? 'Update' : 'Create'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
};

export default MenuForm;