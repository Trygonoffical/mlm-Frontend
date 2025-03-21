


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
import { getTokens } from '@/utils/cookies';

const columnHelper = createColumnHelper();
const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0); // Add refresh trigger
    const router = useRouter();
    const {token} = getTokens()
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