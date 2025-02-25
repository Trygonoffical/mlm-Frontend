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

  const { blogs } = useSelector((state) => state.home);

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

// 'use client'

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useSelector } from 'react-redux';
// import { Calendar, Clock, ChevronRight } from 'lucide-react';
// import PageHead from '@/components/Pagehead/PageHead';

// const BlogGuestList = () => {
//   const { blogs } = useSelector((state) => state.home);
//   const loading = !blogs || !blogs.data;

//   // Function to format date
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   // Function to get reading time
//   const getReadingTime = (content) => {
//     const text = content.replace(/<[^>]*>/g, '');
//     const wordCount = text.split(/\s+/).length;
//     const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
//     return `${readingTime} min read`;
//   };

//   // Function to strip HTML and truncate text
//   const truncateText = (html, maxLength) => {
//     const text = html.replace(/<[^>]*>/g, '');
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength).trim() + '...';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex justify-center items-center">
//         <div className="relative w-24 h-24">
//           <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
//           <div className="absolute top-0 left-0 w-full h-full border-4 border-t-green-600 rounded-full animate-spin"></div>
//         </div>
//       </div>
//     );
//   }

//   // Featured blog (first blog)
//   const featuredBlog = blogs.data[0];

//   return (
//     <>
//       <PageHead title="Our Blog" description="Read the latest articles and updates" />
      
//       <div className="bg-gradient-to-b from-green-50 to-white py-12 md:py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-2xl mx-auto text-center mb-16">
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
//             <p className="text-xl text-gray-600">Insights, news, and updates from our team</p>
//           </div>

//           {featuredBlog && (
//             <div className="mb-16">
//               <Link href={`/blogs/${featuredBlog.slug}`}>
//                 <div className="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
//                   <div className="md:flex">
//                     <div className="md:w-1/2 relative h-64 md:h-auto">
//                       {featuredBlog.feature_image_url ? (
//                         <Image
//                           src={featuredBlog.feature_image_url}
//                           alt={featuredBlog.title}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform duration-500"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
//                           <span className="text-white text-2xl font-semibold">Featured Post</span>
//                         </div>
//                       )}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
//                     </div>
//                     <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
//                       <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
//                         <div className="flex items-center">
//                           <Calendar className="h-4 w-4 mr-1" />
//                           <span>{formatDate(featuredBlog.created_at)}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <Clock className="h-4 w-4 mr-1" />
//                           <span>{getReadingTime(featuredBlog.content)}</span>
//                         </div>
//                       </div>
//                       <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//                         {featuredBlog.title}
//                       </h2>
//                       <p className="text-gray-600 mb-6">
//                         {truncateText(featuredBlog.content, 180)}
//                       </p>
//                       <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
//                         Read Article <ChevronRight className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {blogs.data.slice(1).map((blog) => (
//               <Link key={blog.id} href={`/blogs/${blog.slug}`}>
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//                   <div className="relative h-48 overflow-hidden">
//                     {blog.feature_image_url ? (
//                       <Image
//                         src={blog.feature_image_url}
//                         alt={blog.title}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-green-500">
//                         <span className="text-white text-xl font-semibold">Blog Post</span>
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-6 flex-grow flex flex-col">
//                     <div className="flex items-center text-sm text-gray-500 mb-3">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       <span>{formatDate(blog.created_at)}</span>
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
//                       {blog.title}
//                     </h3>
//                     <p className="text-gray-600 mb-4 line-clamp-3">
//                       {truncateText(blog.content, 120)}
//                     </p>
//                     <div className="mt-auto flex items-center text-green-600 font-medium group-hover:text-green-700">
//                       Read More <ChevronRight className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BlogGuestList;