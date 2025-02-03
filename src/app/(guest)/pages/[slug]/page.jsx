'use client'
import PageHead from '@/components/Pagehead/PageHead';
import React, { useEffect, useState } from 'react'

const page = ({params}) => {
    const slug = use(params).slug;
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/custom-pages/${slug}`);
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 404) {
                    router.push('/404'); // Redirect to 404 page
                    return;
                }
                throw new Error('Failed to fetch page');
            }
            setPages(data);
        } catch (error) {
            console.log('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('in page')
        fetchPages();
    }, []);
  return (
    <>
        <div className="min-h-screen bg-gray-50 pb-12">
            <PageHead title={pages.title} />
                <div className="max-w-7xl mx-auto px-4 mt-10">
                    <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: pages.content }} />
                </div>
        </div>
    </>
  )
}

export default page