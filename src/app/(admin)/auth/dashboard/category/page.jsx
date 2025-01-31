// 'use client'
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import Cookies from 'js-cookie';
// import Image from 'next/image';
// import { createColumnHelper } from '@tanstack/react-table';
// import DataTable from '@/components/DataTable/DataTable';

// const columnHelper = createColumnHelper();

// const CategoryManager = () => {
//     const [categories, setCategories] = useState([]);
//     const [parentCategories, setParentCategories] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         image: null,
//         parent: '',
//         is_active: true
//     });

//     // Table columns configuration
//     const columns = [
//         columnHelper.accessor('name', {
//             header: 'Name',
//             cell: info => info.getValue(),
//         }),
//         columnHelper.accessor('slug', {
//             header: 'Slug',
//             cell: info => info.getValue(),
//         }),
//         columnHelper.accessor('parent_name', {
//             header: 'Parent Category',
//             cell: info => info.getValue() || 'None',
//         }),
//         columnHelper.accessor('image', {
//             header: 'Image',
//             cell: info => info.getValue() ? (
//                 <Image 
//                     src={info.getValue()} 
//                     alt="Category" 
//                     width={50} 
//                     height={50}
//                     className="rounded"
//                 />
//             ) : 'No Image',
//         }),
//         columnHelper.accessor('is_active', {
//             header: 'Status',
//             cell: info => info.getValue() ? 'Active' : 'Inactive',
//         }),
//         columnHelper.accessor('id', {
//             header: 'Actions',
//             cell: info => (
//                 <button 
//                     onClick={() => handleDelete(info.getValue())}
//                     className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
//                 >
//                     Delete
//                 </button>
//             ),
//         }),
//     ];

//     // Fetch categories
//     const fetchCategories = async () => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
//             const data = await response.json();
//             setCategories(data);
//             // Filter parent categories for dropdown
//             setParentCategories(data.filter(cat => !cat.parent));
//         } catch (error) {
//             toast.error('Error fetching categories');
//         }
//     };

//     // Create category
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         // Debug cookie access
//         console.log('All cookies:', document.cookie);
//         console.log('Token from js-cookie:', Cookies.get('token'));
//         console.log('All cookies from js-cookie:', Cookies.get());
    
//         const token = Cookies.get('token');
//         if (!token) {
//             // Try alternate methods to get the token
//             const allCookies = document.cookie.split(';');
//             const tokenCookie = allCookies.find(cookie => cookie.trim().startsWith('token='));
//             if (tokenCookie) {
//                 const token = tokenCookie.split('=')[1];
//                 console.log('Found token through alternate method:', token);
//             }
//         }

//         const form = new FormData();
//         Object.keys(formData).forEach(key => {
//             if (formData[key] !== null && formData[key] !== '') {
//                 form.append(key, formData[key]);
//             }
//         });

//         try {
//             const token = Cookies.get('token');
//             console.log('token - ' , token)
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: form,
//             });

//             if (response.ok) {
//                 toast.success('Category created successfully');
//                 fetchCategories();
//                 setFormData({
//                     name: '',
//                     description: '',
//                     image: null,
//                     parent: '',
//                     is_active: true
//                 });
//             } else {
//                 toast.error('Error creating category');
//                 console.log('error-' . error)
//             }
//         } catch (error) {
//             toast.error('Error creating category');
//             console.log('error-' . error)
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete category
//     const handleDelete = async (id) => {
//         if (!confirm('Are you sure you want to delete this category?')) return;

//         try {
//             const token = Cookies.get('token');
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}/`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//             });

//             if (response.ok) {
//                 toast.success('Category deleted successfully');
//                 fetchCategories();
//             } else {
//                 toast.error('Error deleting category');
//             }
//         } catch (error) {
//             toast.error('Error deleting category');
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

//             {/* Add Category Form */}
//             <div className="bg-white rounded-lg shadow p-6 mb-6">
//                 <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block mb-1">Name</label>
//                         <input
//                             type="text"
//                             value={formData.name}
//                             onChange={(e) => setFormData({...formData, name: e.target.value})}
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block mb-1">Description</label>
//                         <textarea
//                             value={formData.description}
//                             onChange={(e) => setFormData({...formData, description: e.target.value})}
//                             className="w-full p-2 border rounded"
//                             rows={3}
//                         />
//                     </div>

//                     <div>
//                         <label className="block mb-1">Parent Category</label>
//                         <select
//                             value={formData.parent}
//                             onChange={(e) => setFormData({...formData, parent: e.target.value})}
//                             className="w-full p-2 border rounded"
//                         >
//                             <option value="">None</option>
//                             {parentCategories.map(cat => (
//                                 <option key={cat.id} value={cat.id}>{cat.name}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block mb-1">Image</label>
//                         <input
//                             type="file"
//                             onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
//                             className="w-full p-2 border rounded"
//                             accept="image/*"
//                         />
//                     </div>

//                     <div className="flex items-center">
//                         <input
//                             type="checkbox"
//                             checked={formData.is_active}
//                             onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
//                             className="mr-2"
//                         />
//                         <label>Active</label>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className={`w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 ${loading ? 'opacity-50' : ''}`}
//                     >
//                         {loading ? 'Creating...' : 'Create Category'}
//                     </button>
//                 </form>
//             </div>

//             {/* Categories Table */}
//             <DataTable 
//                 columns={columns} 
//                 data={categories} 
//                 searchPlaceholder="Search categories..."
//             />
//         </div>
//     );
// };

// export default CategoryManager;



'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/DataTable/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';
import CreateCat from '@/components/Categories/CreateCat';
import EditCat from '@/components/Categories/EditCat';
const columnHelper = createColumnHelper();
const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0); // Add refresh trigger
    const router = useRouter();

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('slug', {
            header: 'Slug',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('parent_name', {
            header: 'Parent Category',
            cell: info => info.getValue() || 'None',
        }),
        columnHelper.accessor('image', {
            header: 'Image',
            cell: info => info.getValue() ? (
                <Image 
                    src={info.getValue()} 
                    alt="Category" 
                    width={50} 
                    height={50}
                    className="rounded"
                />
            ) : 'No Image',
        }),
        columnHelper.accessor('is_active', {
            header: 'Status',
            cell: info => info.getValue() ? 'Active' : 'Inactive',
        }),
        columnHelper.accessor('id', {
            header: 'Actions',
            cell: info => (
                <>
                <EditCat id={info.row.original} />
                 <button 
                    onClick={() => handleDelete(info.getValue())}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    <TrashIcon className='w-4 h-4' />
                </button>
                
                </>
               
            ),
        }),
    ];

    // Delete category
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                toast.success('Category deleted successfully');
                setRefreshKey(prev => prev + 1);
                // fetchCategories();
            } else {
                toast.error('Error deleting category');
                console.log('error - ', response)
            }
        } catch (error) {
            toast.error('Error deleting category');
            console.log('error - ', error)

        }
    };
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [refreshKey]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <CreateCat cats={categories} setRefreshKey={setRefreshKey} />
            </div>
            <DataTable columns={columns} data={categories} />
        </div>
    );
};

export default CategoriesPage;