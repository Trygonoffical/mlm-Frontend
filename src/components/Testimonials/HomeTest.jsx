// 'use client'

// import React, { useState, useEffect } from 'react';
// import Slider from 'react-slick';
// import Image from 'next/image';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';


// const TestimonialSection = () => {
//     const [testimonials, setTestimonials] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [sliderRef, setSliderRef] = useState(null);

//     const fetchTestimonials = async () => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/?is_active=true`);
//             if (!response.ok) throw new Error('Failed to fetch testimonials');
//             const data = await response.json();
//             setTestimonials(data);
//             // Filter to only show active testimonials
//         // const activeTestimonials = data.filter(testimonial => testimonial.is_active);
//         // setTestimonials(activeTestimonials);
//         } catch (error) {
//             console.error('Error fetching testimonials:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchTestimonials();
//     }, []);

//     const settings = {
//         dots: true,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         autoplay: true,
//         autoplaySpeed: 5000,
//         pauseOnHover: true,
//         adaptiveHeight: true,
//         arrows: false,
//         customPaging: (i) => (
//             <div className="h-1 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-300 w-4" />
//         ),
//     };

//     if (loading) {
//         return (
//             <div className="min-h-[500px] flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//             </div>
//         );
//     }

//     if (!testimonials.length) {
//         return null;
//     }

//     return (
//         <div className="relative w-full min-h-[500px] overflow-hidden">
//             {/* Background with gradient overlay */}
//             <div 
//                 className="absolute inset-0"
//                 style={{
//                     backgroundImage: `url('/Images/about.png')`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                 }}
//             >
//                 <div className="absolute inset-0 bg-gradient-to-r from-slate-800/95 via-slate-700/95 to-green-800/95"></div>
                
//                 <div 
//                     className="absolute inset-0 opacity-20"
//                     style={{
//                         backgroundImage: `url("/Images/about.png")`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                     }}
//                 ></div>
//             </div>

//             {/* Content Container */}
//             <div className="container mx-auto px-4 py-16 relative">
//                 <Slider ref={setSliderRef} {...settings}>
//                     {testimonials.map((testimonial, index) => (
//                         <div key={index} className="outline-none">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//                                 {/* Image Section */}
//                                 <div className="relative aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden">
//                                     {testimonial.image ? (
//                                         <Image
//                                             src={testimonial.image}
//                                             alt={testimonial.name}
//                                             fill
//                                             className="object-cover"
//                                             quality={100}
//                                         />
//                                     ) : (
//                                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                                             <span className="text-gray-400">No Image</span>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Text Content */}
//                                 <div className="text-white space-y-4">
//                                     <h2 className="text-4xl font-bold">
//                                         {testimonial.name}
//                                     </h2>
//                                     <p className="text-xl text-gray-200">
//                                         {testimonial.designation}
//                                     </p>
//                                     <div className="relative">
//                                         <div className="absolute -left-8 -top-4 text-6xl text-green-400 opacity-50"></div>
//                                         <p className="text-lg leading-relaxed relative z-10 whitespace-normal break-words w-full max-w-full">
//                                             {testimonial.content}
//                                         </p>
//                                         <div className="absolute -right-4 bottom-0 text-6xl text-green-400 opacity-50"></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </Slider>

//                 {/* Custom Navigation Arrows */}
//                 <button
//                     onClick={() => sliderRef?.slickPrev()}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300 z-10"
//                     aria-label="Previous slide"
//                 >
//                     <ChevronLeft className="w-6 h-6" />
//                 </button>
//                 <button
//                     onClick={() => sliderRef?.slickNext()}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300 z-10"
//                     aria-label="Next slide"
//                 >
//                     <ChevronRight className="w-6 h-6" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default TestimonialSection;


'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from 'react-hot-toast';

// Custom arrow components for better control
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="absolute left-[-20px] z-10 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hidden md:block"
      style={{ ...style }}
      onClick={onClick}
    >
      <ChevronLeft className="w-5 h-5 text-gray-600" />
    </button>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="absolute right-[-20px] z-10 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hidden md:block"
      style={{ ...style }}
      onClick={onClick}
    >
      <ChevronRight className="w-5 h-5 text-gray-600" />
    </button>
  );
};

const TestimonialCard = ({ name, designation, image, content, rating }) => (
  <div className="px-4 py-6">
    <div className="bg-white rounded-xl p-6 shadow-lg h-full relative group hover:shadow-xl transition-shadow duration-300">
      {/* Decorative Elements */}
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-orange-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-blue-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
      
      {/* Quote Icon */}
      <div className="absolute -top-4 left-6">
        <div className="bg-orange-500 p-2 rounded-lg shadow-lg">
          <Quote className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="relative space-y-4">
        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        
        {/* Content */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4">
          {content}
        </p>
        
        {/* Author Info */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                {name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{name}</h4>
            <p className="text-sm text-gray-500">{designation}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true);
  
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/?is_active=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      console.log('Fetched testimonials:', data);
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Error fetching testimonials');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false
        }
      }
    ]
  };
  
  if (loading) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-1 bg-gray-200 rounded w-24 mb-12"></div>
            <div className="flex flex-wrap gap-4 justify-center">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full md:w-72 h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-8" />
          <p className="text-gray-600">No testimonials available at the moment.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto" />
        </div>
        
        {/* Testimonial Slider */}
        <div className="testimonial-slider relative px-6">
          <Slider {...settings}>
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard 
                key={idx} 
                name={testimonial.name}
                designation={testimonial.designation}
                image={testimonial.image_url}
                content={testimonial.content}
                rating={testimonial.rating || 5}
              />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;