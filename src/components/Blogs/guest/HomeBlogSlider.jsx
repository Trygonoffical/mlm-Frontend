'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';

const HomeBlogSlider = () => {
  const { blogs } = useSelector((state) => state.home);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const sliderRef = useRef(null);
  const autoplayRef = useRef(null);

  // Filter to show only blogs with show_in_slider = true
  const sliderBlogs = blogs?.data?.filter(blog => blog.show_in_slider) || [];
  
  // Load animation handling
  useEffect(() => {
    if (sliderBlogs.length > 0) {
      setLoaded(true);
    }
  }, [sliderBlogs]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to strip HTML and truncate text
  const truncateText = (html, maxLength) => {
    const text = html.replace(/<[^>]*>/g, '');
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Autoplay handling
  useEffect(() => {
    if (sliderBlogs.length <= 1) return;
    
    const play = () => {
      autoplayRef.current = setTimeout(() => {
        nextSlide();
      }, 5000); // 5 seconds per slide
    };
    
    play();
    
    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [currentIndex, sliderBlogs.length]);

  // Navigation functions
  const nextSlide = () => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
    setCurrentIndex((prevIndex) => 
      prevIndex === sliderBlogs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sliderBlogs.length - 1 : prevIndex - 1
    );
  };

  // If no blogs with show_in_slider, don't render component
  if (!sliderBlogs || sliderBlogs.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-gray-100 overflow-hidden py-16">
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest from Our Blog</h2>
          <p className="mt-4 text-xl text-gray-600">Stay updated with our newest articles and insights</p>
        </div>

        <div 
          ref={sliderRef}
          className={`relative transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          aria-live="polite"
        >
          {/* Slider Content */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${sliderBlogs.length * 100}%` 
              }}
            >
              {sliderBlogs.map((blog, index) => (
                <div 
                  key={blog.id} 
                  className="w-full flex flex-col md:flex-row"
                  style={{ width: `${100 / sliderBlogs.length}%` }}
                  aria-hidden={currentIndex !== index}
                >
                  <div className="md:w-1/2 relative h-64 md:h-auto min-h-[350px]">
                    {blog.feature_image_url ? (
                      <Image
                        src={blog.feature_image_url}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
                        <span className="text-white text-2xl font-semibold">Featured Post</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {truncateText(blog.content, 150)}
                    </p>
                    
                    <Link 
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            {sliderBlogs.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10 transition-all duration-200"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10 transition-all duration-200"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          
          {/* Dots Navigation */}
          {sliderBlogs.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {sliderBlogs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (autoplayRef.current) {
                      clearTimeout(autoplayRef.current);
                    }
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? 'bg-green-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentIndex === index ? 'true' : 'false'}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            href="/blogs" 
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-lg"
          >
            View All Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSlider;