
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/DataTable/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';
import EditCat from '@/components/Categories/EditCat';
import Link from 'next/link';

const columnHelper = createColumnHelper();

const ProductUpdatePage = () => {
    const [products, setProducts] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0); // Add refresh trigger
    const router = useRouter();

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('selling_price', {
            header: 'Price',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('gst_percentage', {
            header: 'GST %',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('category_details', {
            header: 'Category',
            cell: info => {
                const categories = info.getValue();
                if (!categories || categories.length === 0) return 'No Category';
                
                return categories.map(cat => cat.name).join(', ');
            }
        }),
        columnHelper.accessor('images', {
            header: 'Feature Image',
            cell: info => {
                const images = info.getValue();
                const featureImage = images && images.length > 0 ? 
                    images.find(img => img.is_feature) || images[0] : null;
                
                return featureImage ? (
                    <Image 
                        src={featureImage.image} 
                        alt="Product" 
                        width={50} 
                        height={50}
                        className="rounded object-cover"
                    />
                ) : 'No Image';
            },
        }),
        columnHelper.accessor('is_active', {
            header: 'Status',
            cell: info => info.getValue() ? 'Active' : 'Inactive',
        }),
        columnHelper.accessor('slug', {
            header: 'Actions',
            cell: info => (
                <>
                <button onClick={()=> router.push(`/auth/dashboard/product/edit/${info.getValue()}/`)} className="bg-green-600 text-white px-2 py-2 mr-2 rounded hover:bg-green-700" > 
                    <PencilIcon className='w-4 h-4' />
                </button>
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
    const handleDelete = async (slug) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const token = Cookies.get('token');
            console.log('token - ' , token)
            console.log('id - - - - ' , slug)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    
                },
            });

            if (response.ok) {
                toast.success('Product deleted successfully');
                setRefreshKey(prev => prev + 1);
                // fetchCategories();
            } else {
                toast.error('Error deleting Product');
                console.log('error - ', response)
            }
        } catch (error) {
            toast.error('Error deleting Product');
            console.log('error - ', error)

        }
    };
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshKey]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Products</h1>
                <a href='/auth/dashboard/product/create' className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"  >
                    New Products
                </a>
            </div>
            <DataTable columns={columns} data={products} />
        </div>
    );
};

export default ProductUpdatePage;