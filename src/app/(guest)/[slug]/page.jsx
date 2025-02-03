'use client'
import PageHead from '@/components/Pagehead/PageHead';
import React, { use, useEffect, useState } from 'react'
import { useHomeData } from '@/hooks/useHomeData';

const page = ({params}) => {
    const slug = use(params).slug;

    // const [pages, setPages] = useState([]);
    // const [loading, setLoading] = useState(true);

    const customPages = useHomeData('customPages');

    if (customPages.loading) {
        return <div>Loading...</div>;
    }

    // Find the specific page with matching slug
    const currentPage = customPages.data.find(page => page.slug === slug);


    console.log('in Custom Page -- ' , currentPage)
    
    // If page not found, you might want to handle it
    if (!currentPage) {
        router.push('/404');
        return null;
    }
  return (
    <>
        <div className="min-h-screen bg-gray-50 pb-12">
            <PageHead title={currentPage.title} />
                <div className="max-w-7xl mx-auto px-4 mt-10">
                    <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentPage.content }} />
                </div>
        </div>
    </>
  )
}

export default page