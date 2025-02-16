'use client'

import PageHead from '@/components/Pagehead/PageHead';
import React, { use, useEffect } from 'react'
import { useHomeData } from '@/hooks/useHomeData';
import { notFound, useRouter } from 'next/navigation';

const CustomPage = ({ params }) => {
    const slug = use(params).slug;
    const router = useRouter();
    const { data: customPages, loading, error } = useHomeData('customPages');

    useEffect(() => {
        // Check if data is loaded and page doesn't exist
        if (!loading && customPages) {
            const currentPage = customPages.find(page => page.slug === slug);
            if (!currentPage) {
                notFound();
            }
        }
    }, [loading, customPages, slug, router]);

    // Handle loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Get current page after loading check
    const currentPage = customPages?.find(page => page.slug === slug);

    // Handle 404 case (will redirect via useEffect)
    if (!currentPage) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <PageHead title={currentPage.title} />
            <div className="max-w-7xl mx-auto px-4 mt-10">
                <div className="prose max-w-none text-gray-700 leading-relaxed" 
                     dangerouslySetInnerHTML={{ __html: currentPage.content }} 
                />
            </div>
        </div>
    );
}

export default CustomPage;