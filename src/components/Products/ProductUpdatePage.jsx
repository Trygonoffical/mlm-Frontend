'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/DataTable/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { PencilIcon, TrashIcon, EyeIcon, TagIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { getTokens } from '@/utils/cookies';

const columnHelper = createColumnHelper();

const ProductUpdatePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    const router = useRouter();
    const { token } = getTokens();

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => (
                <div className="font-medium text-blue-600 hover:underline cursor-pointer" 
                     onClick={() => router.push(`/auth/dashboard/product/edit/${info.row.original.slug}/`)}>
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('selling_price', {
            header: 'Price',
            cell: info => (
                <div className="flex flex-col">
                    <span className="font-semibold">₹{Number(info.getValue()).toFixed(2)}</span>
                    {info.row.original.regular_price !== info.row.original.selling_price && (
                        <span className="text-xs text-gray-500 line-through">₹{Number(info.row.original.regular_price).toFixed(2)}</span>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor('stock', {
            header: 'Stock',
            cell: info => {
                const stock = info.getValue();
                return (
                    <span className={`font-semibold ${stock > 10 ? 'text-green-600' : stock > 0 ? 'text-orange-500' : 'text-red-600'}`}>
                        {stock}
                    </span>
                );
            },
        }),
        columnHelper.accessor('bp_value', {
            header: 'BP Value',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('category_details', {
            header: 'Category',
            cell: info => {
                const categories = info.getValue();
                if (!categories || categories.length === 0) return 'No Category';
                
                return (
                    <div className="flex flex-wrap gap-1">
                        {categories.map(cat => (
                            <span key={cat.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {cat.name}
                            </span>
                        ))}
                    </div>
                );
            }
        }),
        columnHelper.accessor('images', {
            header: 'Image',
            cell: info => {
                const images = info.getValue();
                const featureImage = images && images.length > 0 ? 
                    images.find(img => img.is_feature) || images[0] : null;
                
                return featureImage ? (
                    <div className="w-16 h-16 relative border rounded overflow-hidden">
                        <Image 
                            src={featureImage.image} 
                            alt="Product" 
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-xs text-gray-500">No Image</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('is_active', {
            header: 'Status',
            cell: info => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {info.getValue() ? 'Active' : 'Inactive'}
                </span>
            ),
        }),
        columnHelper.accessor('display_flags', {
            header: 'Display',
            cell: info => {
                const product = info.row.original;
                const flags = [];
                
                if (product.is_featured) flags.push("Featured");
                if (product.is_bestseller) flags.push("Bestseller");
                if (product.is_new_arrival) flags.push("New Arrival");
                if (product.is_trending) flags.push("Trending");
                
                return (
                    <div className="flex flex-wrap gap-1">
                        {flags.map(flag => (
                            <span key={flag} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                {flag}
                            </span>
                        ))}
                        {flags.length === 0 && <span className="text-gray-400 text-xs">None</span>}
                    </div>
                );
            },
        }),
        columnHelper.accessor('actions', {
            header: 'Actions',
            cell: info => {
                const product = info.row.original;
                return (
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => router.push(`/auth/dashboard/product/edit/${product.slug}/`)} 
                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                            title="Edit product"
                        > 
                            <PencilIcon className='w-4 h-4' />
                        </button>
                        <button 
                            onClick={() => handleDelete(product.slug)}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                            title="Delete product"
                        >
                            <TrashIcon className='w-4 h-4' />
                        </button>
                        <button 
                            onClick={() => window.open(`/product/${product.slug}/`, '_blank')}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="View product"
                        >
                            <EyeIcon className='w-4 h-4' />
                        </button>
                    </div>
                );
            },
        }),
    ];

    // Delete product
    const handleDelete = async (slug) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Product deleted successfully');
                setRefreshKey(prev => prev + 1);
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || 'Error deleting product');
                console.error('Error response:', response.status, errorData);
            }
        } catch (error) {
            toast.error('Error deleting product');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_API_URL}/products/`;
            
            // Add query parameters for filtering
            const params = new URLSearchParams();
            
            if (filterStatus === 'active') {
                params.append('is_active', 'true');
            } else if (filterStatus === 'inactive') {
                params.append('is_active', 'false');
            }
            
            if (searchTerm) {
                params.append('search', searchTerm);
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const res = await fetch(url);
            
            if (!res.ok) {
                throw new Error(`Error fetching products: ${res.status}`);
            }
            
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshKey, filterStatus, searchTerm]);

    // Filter products client-side if search doesn't work from backend
    const filteredProducts = searchTerm && !searchTerm.includes('?') 
        ? products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            product.category_details.some(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        : products;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Products</h1>
                <Link href='/auth/dashboard/product/create' className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add New Product
                </Link>
            </div>
            
            {/* Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1 rounded-full ${filterStatus === 'all' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setFilterStatus('active')}
                        className={`px-3 py-1 rounded-full ${filterStatus === 'active' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                        Active
                    </button>
                    <button 
                        onClick={() => setFilterStatus('inactive')}
                        className={`px-3 py-1 rounded-full ${filterStatus === 'inactive' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                        Inactive
                    </button>
                </div>
                
                <div className="w-full md:w-64">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-lg"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <TagIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-xl font-semibold">{products.length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Active Products</p>
                        <p className="text-xl font-semibold">{products.filter(p => p.is_active).length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Out of Stock</p>
                        <p className="text-xl font-semibold">{products.filter(p => p.stock <= 0).length}</p>
                    </div>
                </div>
            </div>
            
            {/* Data Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                filteredProducts.length > 0 ? (
                    <DataTable 
                        columns={columns} 
                        data={filteredProducts} 
                        pagination={true}
                    />
                ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Try different search terms or filters.' : 'Get started by creating a new product.'}
                        </p>
                        <div className="mt-6">
                            <Link href="/auth/dashboard/product/create" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Product
                            </Link>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default ProductUpdatePage;