'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // Add this

 const EditCategory = ({ data }) => { // 'data' should be the category ID to edit
    const router = useRouter(); // Initialize router
    const [category, setCategory] = useState(null); // Single category state
    const [parentCategories, setParentCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        parent: '',
        is_active: true
    });

    // Fetch specific category to edit
    useEffect(() => {
        if (data) { // Only fetch if we're in edit mode
            const fetchCategory = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/categories/${data}/`
                    );
                    const categoryData = await response.json();
                    setCategory(categoryData);
                    // Pre-fill form with existing data
                    setFormData({
                        name: categoryData.name,
                        description: categoryData.description,
                        image: null, // Keep as null to avoid File object issues
                        parent: categoryData.parent?.id || '',
                        is_active: categoryData.is_active
                    });
                } catch (error) {
                    toast.error('Error loading category');
                }
            };
            fetchCategory();
        }
    }, [data]);

    // Unified submit handler for create/update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                form.append(key, key === 'image' ? formData[key] : formData[key]);
            }
        });

        try {
            const token = Cookies.get('token');
            const url = data 
                ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${data}/` // Edit URL
                : `${process.env.NEXT_PUBLIC_API_URL}/categories/`; // Create URL

            const method = data ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form,
            });

            if (response.ok) {
                toast.success(`Category ${data ? 'updated' : 'created'} successfully`);
                router.push('/categories'); // Redirect to main page
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    // ... (keep parent categories fetch logic from your original code)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                {data ? 'Edit Category' : 'Create New Category'}
            </h1>

            {/* Add conditional image preview */}
            {data && category?.image && (
                <div className="mb-4">
                    <p className="mb-2">Current Image:</p>
                    <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-32 h-32 object-cover"
                    />
                </div>
            )}

            {/* Form fields (same as before) */}
        </div>
    );
};


export default EditCategory;