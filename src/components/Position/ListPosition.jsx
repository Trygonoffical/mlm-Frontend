'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from 'lucide-react';
import PositionForm from './Position';
import EdfitPositionForm from './editPosition';
import { getTokens } from '@/utils/cookies';

const PositionList = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const { token } = getTokens();


    useEffect(() => {
        fetchPositions();
    }, [refreshKey]);

    const fetchPositions = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/positions/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch positions');
                console.log('err-', response)
            }
            
            const data = await response.json();
            setPositions(data);
        } catch (error) {
            console.error('Error fetching positions:', error);
            toast.error('Error fetching positions');
        } finally {
            setLoading(false);
        }
    };
    const deletePostions = async (id) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/positions/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to DELETE positions');
                console.log('err-', response)
            }
            setRefreshKey(old => old + 1);
        } catch (error) {
            console.error('Error DELETE positions:', error);
            toast.error('Error DELETE positions');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/positions/${id}/toggle_status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                setRefreshKey(old => old + 1);
                toast.success('Status updated successfully');
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error updating position status');
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
                <h1 className="text-2xl font-semibold">MLM Positions</h1>
                <PositionForm setRefreshKey={setRefreshKey} />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    BP Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Discount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Commission
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monthly Quota
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {positions && positions.map((position) => (
                                <tr key={position.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {position.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Level: {position.level_order}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {position.bp_required_min} - {position.bp_required_max} BP
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {position.discount_percentage}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {position.commission_percentage}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ₹{position.monthly_quota}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            position.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                            {position.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-3">
                                            {/* <Link
                                                href={`/auth/dashboard/positions/edit/${position.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </Link> */}
                                            <EdfitPositionForm data={position}  setRefreshKey={setRefreshKey} />

                                            {/* Toggle Status Button */}
                                            {/* Toggle Status Button */}
                                                <button
                                                    onClick={() => handleToggleStatus(position.id)}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                    title={position.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    {position.is_active ? (
                                                        <svg 
                                                            className="h-5 w-5" 
                                                            fill="none" 
                                                            viewBox="0 0 24 24" 
                                                            stroke="currentColor"
                                                        >
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth={2} 
                                                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg 
                                                            className="h-5 w-5" 
                                                            fill="none" 
                                                            viewBox="0 0 24 24" 
                                                            stroke="currentColor"
                                                        >
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth={2} 
                                                                d="M5 13l4 4L19 7" 
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this position?')) {
                                                        deletePostions(position.id);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete Position"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PositionList;