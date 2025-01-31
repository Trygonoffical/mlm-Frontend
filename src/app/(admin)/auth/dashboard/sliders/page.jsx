'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Image from 'next/image';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    createColumnHelper,
  } from '@tanstack/react-table';
import { Input } from "@/components/ui/input"

const columnHelper = createColumnHelper();

const HomeSliderManager = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    desktop_image: null,
    mobile_image: null,
    link: '',
    order: '',
    is_active: true
  });

  const fetchSliders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home-sliders/`);
      const data = await response.json();
      console.log('slidrs - ', data)
      setSliders(data);
    } catch (error) {
      toast.error('Error fetching sliders');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Debug cookie access
    console.log('All cookies:', document.cookie);
    console.log('Token from js-cookie:', Cookies.get('token'));
    console.log('All cookies from js-cookie:', Cookies.get());

    const token = Cookies.get('token');
    if (!token) {
        // Try alternate methods to get the token
        const allCookies = document.cookie.split(';');
        const tokenCookie = allCookies.find(cookie => cookie.trim().startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            console.log('Found token through alternate method:', token);
        }
    }
    
    const form = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        form.append(key, formData[key]);
      }
    });

    try {
        const token = Cookies.get('token');
        console.log('Cookies - ' , Cookies)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home-sliders/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
              },
            body: form,
        });

      if (response.ok) {
        toast.success('Slider created successfully');
        fetchSliders();
        setFormData({
          title: '',
          desktop_image: null,
          mobile_image: null,
          link: '',
          order: '',
          is_active: true
        });
      } else {
        toast.error('Error creating slider');
        console.log('error - ', error)
      }
    } catch (error) {
      toast.error('Error creating slider');
      console.log('error - ', error)
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;

    try {
        const token = Cookies.get('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home-sliders/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
          },
      });

      if (response.ok) {
        toast.success('Slider deleted successfully');
        fetchSliders();
      } else {
        toast.error('Error deleting slider');
        console.log('error-', error)
      }
    } catch (error) {
      toast.error('Error deleting slider');
      console.log('error-', error)
    }
  };

  useEffect(() => {
    fetchSliders();
    console.log('Cookies - ' , Cookies)
  }, []);


//   Table 
const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('order', {
      header: 'Order',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('is_active', {
      header: 'Status',
      cell: info => info.getValue() ? 'Active' : 'Inactive',
    }),
    columnHelper.accessor('desktop_image', {
      header: 'Images',
      cell: info => (
        <div className='flex gap-2'>
          <Image 
            src={info.getValue()} 
            alt="Desktop"
            width={100} 
            height={30}
          />
          {info.row.original.mobile_image && (
            <Image 
              src={info.row.original.mobile_image} 
              alt="Mobile"
              width={100} 
              height={30}
            />
          )}
        </div>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: info => (
        <button 
          onClick={() => handleDelete(info.getValue())}
          className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: sliders,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

// end Table

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Home Sliders</h1>

      {/* Add New Slider Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Slider</h2>
        <form onSubmit={handleSubmit} className="space-y-4" >
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Desktop Image</label>
            <input
              type="file"
              onChange={(e) => setFormData({...formData, desktop_image: e.target.files[0]})}
              className="w-full p-2 border rounded"
              accept="image/*"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Mobile Image (Optional)</label>
            <input
              type="file"
              onChange={(e) => setFormData({...formData, mobile_image: e.target.files[0]})}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block mb-1">Link URL</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="mr-2"
            />
            <label>Active</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Creating...' : 'Create Slider'}
          </button>
        </form>
      </div>

      {/* Sliders Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-2 text-left">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomeSliderManager;