'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { use } from 'react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import {
    UserCircleIcon,
    CurrencyDollarIcon,
    UsersIcon,
    DocumentTextIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { ProfileTab } from '@/components/MLMMember/Tab/ProfileTab';
import EarningsTab from '@/components/MLMMember/Tab/EarnningTab';

const MLMMemberDetails = ({params}) => {
    const memberId  =  use(params).id;
    const [loading, setLoading] = useState(true);
    const [memberData, setMemberData] = useState(null);

    useEffect(() => {
        fetchMemberDetails();
    }, [memberId]);

    const fetchMemberDetails = async () => {
        try {
            const token = Cookies.get('token');
            console.log('memberId: data', memberId);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mlm-members/${memberId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setMemberData(data);
            } else {
                toast.error('Error fetching member details');
                console.log('Error: data', data);

            }
        } catch (error) {
            console.log('Error:', error);
            toast.error('Error fetching member details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!memberData) {
        return (
            <div className="p-6">
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-700">Member not found</p>
                </div>
            </div>
        );
    }

    const tabs = [
        {
            name: 'Profile',
            icon: UserCircleIcon,
            content: <ProfileTab member={memberData} />
        },
        {
            name: 'Earnings',
            icon: CurrencyDollarIcon,
            content: <EarningsTab member={memberData} />
        },
        // {
        //     name: 'Team',
        //     icon: UsersIcon,
        //     content: <TeamTab member={memberData} />
        // },
        // {
        //     name: 'KYC',
        //     icon: DocumentTextIcon,
        //     content: <KYCTab member={memberData} />
        // },
        // {
        //     name: 'Analytics',
        //     icon: ChartBarIcon,
        //     content: <AnalyticsTab member={memberData} />
        // }
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Member Details</h1>
                    <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm
                            ${memberData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                            {memberData.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <p className="text-gray-600">Member ID: {memberData.member_id}</p>
            </div>

            {/* Tabs */}
            <TabGroup>
                <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.name}
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                ${selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                                }`
                            }
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <tab.icon className="w-5 h-5" />
                                <span>{tab.name}</span>
                            </div>
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-6">
                    {tabs.map((tab, idx) => (
                        <TabPanel
                            key={idx}
                            className="rounded-xl bg-white p-6 shadow"
                        >
                            {tab.content}
                        </TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </div>
    );
};




export default MLMMemberDetails;