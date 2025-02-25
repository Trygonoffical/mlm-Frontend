// 'use client'
// import React, { useState, useEffect, use } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useSelector } from 'react-redux';
// import Link from 'next/link';

// const BlogDetails = ({ params }) => {
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   // const { slug } = params;
//   const slug = use(params).slug;


//   const { blogs } = useSelector((state) => state.home);

//   useEffect(() => {  
//     // if (slug) {
//     //   fetchBlogDetails();
//     // }
//    const singleBLog =  blogs.data.filter(ad => ad.slug === slug);
//    console.log('singleBLog - ', singleBLog)

//    if(singleBLog){
//     setBlog(singleBLog[0])
//     setLoading(false);
//    }else{
    
//    }

//     console.log('deatil slug - ', slug)
//     console.log('singleBLog - ', singleBLog)
//     console.log('blogs - ', blogs)
//   }, [slug , blogs]);

//   // const fetchBlogDetails = async () => {
//   //   try {
//   //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}/`);
//   //     if (!response.ok) {
//   //       throw new Error('Blog not found');
//   //     }
//   //     const data = await response.json();
//   //     setBlog(data);
//   //   } catch (error) {
//   //     console.error('Error fetching blog details:', error);
//   //     router.push('/blog');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!blog) {
//     return (
//       <div className="max-w-3xl mx-auto px-4 py-12 my-12 text-center">
//         <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>
//         <Link
//           href={'/blogs'}
//           className="mt-4 text-blue-600 hover:text-blue-800"
//         >
//           ← Back to Blogs
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <article className="max-w-4xl mx-auto px-4 py-12">
//       <Link
//          href={'/blogs'}
//         className="mb-8 text-blue-600 hover:text-blue-800 flex items-center"
//       >
//         ← Back to Blogs
//       </Link>

//       <h1 className="text-4xl font-bold text-gray-900 mb-6">
//         {blog.title}
//       </h1>

//       <div className="text-gray-500 mb-8">
//         Published on {new Date(blog.created_at).toLocaleDateString()}
//       </div>

//       {blog.feature_image_url && (
//         <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
//           <Image
//             src={blog.feature_image_url}
//             alt={blog.title}
//             layout="fill"
//             objectFit="cover"
//             className="rounded-lg"
//           />
//         </div>
//       )}

//       <div 
//         className="prose prose-lg max-w-none"
//         dangerouslySetInnerHTML={{ __html: blog.content }}
//       />

//       <div className="mt-12 pt-8 border-t border-gray-200">
//         <h3 className="text-2xl font-bold text-gray-900 mb-4">
//           Share this article
//         </h3>
//         <div className="flex space-x-4">
//           <button 
//             onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
//             className="text-blue-400 hover:text-blue-600"
//           >
//             Share on Twitter
//           </button>
//           <button 
//             onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
//             className="text-blue-600 hover:text-blue-800"
//           >
//             Share on Facebook
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// };

// export default BlogDetails;


'use client'

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Calendar, Clock, Share2, ArrowLeft, Facebook, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import PageHead from '@/components/Pagehead/PageHead';

const BlogDetails = ({ params }) => {
  const [copied, setCopied] = useState(false);
  const slug = use(params).slug;
  const { blogs } = useSelector((state) => state.home);
  const loading = !blogs || !blogs.data;

  // Find the current blog
  const blog = !loading ? blogs.data.find(blog => blog.slug === slug) : null;
  
  // Get related blogs (3 other blogs)
  const relatedBlogs = !loading && blog 
    ? blogs.data.filter(item => item.id !== blog.id).slice(0, 3) 
    : [];

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to get reading time
  const getReadingTime = (content) => {
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
    return `${readingTime} min read`;
  };

  // Function to share
  const handleShare = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = blog?.title || 'Blog post';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog post not found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link 
          href="/blogs" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all blogs
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* <PageHead 
        title={blog.title} 
        description={blog.content.replace(/<[^>]*>/g, '').substring(0, 160)} 
      /> */}
      
      <article className="bg-white">
        {/* Hero section */}
        <div className="relative">
          {blog.feature_image_url ? (
            <div className="h-[40vh] md:h-[60vh] relative">
              <Image
                src={blog.feature_image_url}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
            </div>
          ) : (
            <div className="h-[40vh] md:h-[60vh] bg-gradient-to-r from-green-800 to-blue-800"></div>
          )}
          
          {/* Floating header card */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="bg-white rounded-t-2xl shadow-lg p-8 transform translate-y-16">
                <Link href="/blogs" className="inline-flex items-center text-green-600 hover:text-green-800 mb-4 font-medium">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to all articles
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center text-gray-600 gap-4 md:gap-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{getReadingTime(blog.content)} read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          {/* Share buttons (floating on desktop) */}
          <div className="hidden md:block fixed left-8 top-1/2 transform -translate-y-1/2 space-y-4">
            <button 
              onClick={() => handleShare('twitter')}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </button>
            <button 
              onClick={() => handleShare('facebook')}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </button>
            <button 
              onClick={() => handleShare('linkedin')}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </button>
            <button 
              onClick={() => handleShare('copy')}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              aria-label="Copy link"
            >
              {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className='whitespace-normal break-words w-full max-w-full' dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
          
          {/* Mobile share buttons */}
          <div className="mt-12 md:hidden">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleShare('twitter')}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleShare('linkedin')}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleShare('copy')}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="Copy link"
              >
                {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </article>
      
      {/* Related articles */}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link key={relatedBlog.id} href={`/blogs/${relatedBlog.slug}`}>
                  <div className="bg-white rounded-xl shadow overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      {relatedBlog.feature_image_url ? (
                        <Image
                          src={relatedBlog.feature_image_url}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
                          <span className="text-white text-xl font-semibold">Blog Post</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(relatedBlog.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default BlogDetails;