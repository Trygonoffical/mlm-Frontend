'use client'
import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const BlogDetails = ({ params }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // const { slug } = params;
  const slug = use(params).slug;


  const { blogs } = useSelector((state) => state.home);

  useEffect(() => {  
    // if (slug) {
    //   fetchBlogDetails();
    // }
   const singleBLog =  blogs.data.filter(ad => ad.slug === slug);
   console.log('singleBLog - ', singleBLog)

   if(singleBLog){
    setBlog(singleBLog[0])
    setLoading(false);
   }else{
    
   }

    console.log('deatil slug - ', slug)
    console.log('singleBLog - ', singleBLog)
    console.log('blogs - ', blogs)
  }, [slug , blogs]);

  // const fetchBlogDetails = async () => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}/`);
  //     if (!response.ok) {
  //       throw new Error('Blog not found');
  //     }
  //     const data = await response.json();
  //     setBlog(data);
  //   } catch (error) {
  //     console.error('Error fetching blog details:', error);
  //     router.push('/blog');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 my-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>
        <Link
          href={'/blogs'}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link
         href={'/blogs'}
        className="mb-8 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to Blogs
      </Link>

      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        {blog.title}
      </h1>

      <div className="text-gray-500 mb-8">
        Published on {new Date(blog.created_at).toLocaleDateString()}
      </div>

      {blog.feature_image_url && (
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={blog.feature_image_url}
            alt={blog.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Share this article
        </h3>
        <div className="flex space-x-4">
          <button 
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
            className="text-blue-400 hover:text-blue-600"
          >
            Share on Twitter
          </button>
          <button 
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
            className="text-blue-600 hover:text-blue-800"
          >
            Share on Facebook
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogDetails;