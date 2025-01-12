'use client'

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Name',
      designation: 'Desgination',
      image: '/Images/te.jpeg',
      content: 'On the sports field, Kristina Tomic pursues ultimate strength and technique. In this world full of challenges and passion, TIENS products have become her trusted choice.'
    },
    {
      id: 2,
      name: 'Vikas',
      designation: 'Desgination',
      image: '/Images/te.jpeg',
      content: 'On the sports field, Kristina Tomic pursues ultimate strength and technique. In this world full of challenges and passion, TIENS products have become her trusted choice.'
    },
    {
      id: 3,
      name: 'rahul',
      designation: 'Desgination',
      image: '/Images/te.jpeg',
      content: 'On the sports field, Kristina Tomic pursues ultimate strength and technique. In this world full of challenges and passion, TIENS products have become her trusted choice.'
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === testimonials.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === testimonials.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? testimonials.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="relative w-full min-h-[500px] overflow-hidden">
      {/* Background with enhanced gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/images/about.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Stronger gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/95 via-slate-700/95 to-green-800/95"></div>
        
        {/* Wave-like overlay pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("/images/about.png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <div className="relative aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={testimonials[currentSlide].image}
              alt={testimonials[currentSlide].name}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>

          {/* Text Content */}
          <div className="text-white space-y-4">
            <h2 className="text-4xl font-bold transition-all duration-300">
              {testimonials[currentSlide].name}
            </h2>
            <p className="text-xl text-gray-200 transition-all duration-300">
              {testimonials[currentSlide].designation}
            </p>
            <p className="text-lg leading-relaxed transition-all duration-300">
              {testimonials[currentSlide].content}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slider Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-green-400' 
                  : 'w-4 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;