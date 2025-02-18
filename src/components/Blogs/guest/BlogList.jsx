'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import PageHead from '@/components/Pagehead/PageHead';

const BlogGuestList = () => {
//   const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

//   useEffect(() => {
//     fetchBlogs();
//   }, []);


  const { blogs } = useSelector((state) => state.home);


//   const fetchBlogs = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/`);
//       const data = await response.json();
//       setBlogs(data);
//     } catch (error) {
//       console.error('Error fetching blogs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

  return (
    <>
    <PageHead title='Our Blogs' />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Blog</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.data.map((blog) => (
          <Link 
            key={blog.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
            // onClick={() => router.push(`/blogs/${blog.slug}`)}
            href={`/blogs/${blog.slug}`}
          >
            {blog.feature_image_url && (
              <div className="relative h-48 w-full">
                <Image
                  src={blog.feature_image_url}
                  alt={blog.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
                <div 
                // href={`/blogs/${blog.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                //   onClick={(e) => {
                //     e.stopPropagation();
                //     router.push(`/blog/${blog.slug}`);
                //   }}
                >
                  Read More →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>

  );
};

export default BlogGuestList;