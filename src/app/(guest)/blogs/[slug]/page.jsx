import BlogDetails from "@/components/Blogs/guest/BlogDetails";

//   // app/blog/[slug]/page.js
//   export default function BlogDetailPage({ params }) {
//     console.log('params - ' , params)
//     const slug = use(params).slug;
//     console.log('params - ' , params)

//     return <BlogDetails params={params} />
//   }

import React, { use } from 'react'

const BlogDetailspage = ({ params }) => {
    console.log('params - ' , params)
     const slug = use(params).slug;
     console.log('slug - ' , slug)
  return (
    <>
         <BlogDetails params={params} />
    </>
  )
}

export default BlogDetailspage