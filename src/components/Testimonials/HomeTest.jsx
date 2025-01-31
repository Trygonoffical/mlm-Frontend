'use client'

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TestimonialSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sliderRef, setSliderRef] = useState(null);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/`);
            if (!response.ok) throw new Error('Failed to fetch testimonials');
            const data = await response.json();
            setTestimonials(data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
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
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        adaptiveHeight: true,
        arrows: false,
        customPaging: (i) => (
            <div className="h-1 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-300 w-4" />
        ),
    };

    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!testimonials.length) {
        return null;
    }

    return (
        <div className="relative w-full min-h-[500px] overflow-hidden">
            {/* Background with gradient overlay */}
            <div 
                className="absolute inset-0"
                style={{
                    backgroundImage: `url('/Images/about.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800/95 via-slate-700/95 to-green-800/95"></div>
                
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url("/Images/about.png")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 py-16 relative">
                <Slider ref={setSliderRef} {...settings}>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="outline-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                {/* Image Section */}
                                <div className="relative aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden">
                                    {testimonial.image ? (
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                            quality={100}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <span className="text-gray-400">No Image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="text-white space-y-4">
                                    <h2 className="text-4xl font-bold">
                                        {testimonial.name}
                                    </h2>
                                    <p className="text-xl text-gray-200">
                                        {testimonial.designation}
                                    </p>
                                    <div className="relative">
                                        <div className="absolute -left-8 -top-4 text-6xl text-green-400 opacity-50"></div>
                                        <p className="text-lg leading-relaxed relative z-10 pl-4">
                                            {testimonial.content}
                                        </p>
                                        <div className="absolute -right-4 bottom-0 text-6xl text-green-400 opacity-50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>

                {/* Custom Navigation Arrows */}
                <button
                    onClick={() => sliderRef?.slickPrev()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300 z-10"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={() => sliderRef?.slickNext()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300 z-10"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default TestimonialSection;