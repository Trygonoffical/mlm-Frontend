"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HomeCats = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(5);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
        const data = await res.json();
        console.log('cats -- ', data)
        setCategories(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

  // const categories = [
  //   { id: 1, link:'#', name: 'Nutrition', productCount: '120+ Product', image: '/Products/Cats/1.webp' },
  //   { id: 2, link:'#', name: 'Beauty', productCount: '120+ Product', image: '/Products/Cats/2.webp' },
  //   { id: 3, link:'#', name: 'Home & Living 1', productCount: '120+ Product', image: '/Products/Cats/3.webp' },
  //   { id: 4, link:'#', name: 'Personal Care', productCount: '120+ Product', image: '/Products/Cats/4.webp' },
  //   { id: 5, link:'#', name: 'Category 1', productCount: '120+ Product', image: '/Products/Cats/1.webp' },
  //   { id: 6, link:'#', name: 'Category 2', productCount: '120+ Product', image: '/Products/Cats/2.webp' },
  // ];

  // Update slides to show based on window width
  useEffect(() => {
    fetchCategories();
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesToShow(2);  // Mobile: 2 slides
      } else {
        setSlidesToShow(5);  // Desktop: 5 slides
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + slidesToShow;
      return nextIndex >= categories.length ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex - 1 < 0 ? categories.length - slidesToShow : prevIndex - 1;
    });
  };

  // Only show navigation if there are more items than visible slides
  const showNavigation = categories.length > slidesToShow;

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
          }}
        >
          {categories.map((category) => (
            
            <Link
              href={`/categories/${category.slug}`} key={category.id}
              className="flex-none w-1/2 sm:w-1/5 px-2"
              style={{ flex: `0 0 ${100 / slidesToShow}%` }}>
              <div className="text-center cursor-pointer group">
                {/* <div className="relative rounded-full overflow-hidden mb-4 aspect-square bg-gradient-to-br from-slate-700 to-green-800 text-center flex justify-center align-middle items-center h-[150px] w-[150px] mx-auto"> */}
                  <Image
                    src={category.image}
                    alt={category.name}
                    className=" mx-auto"
                    width={150}
                    height={150}
                  />
                {/* </div> */}
                <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.products?.length || 0}</p>
              </div>
            </Link>
            
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Only shown when needed */}
      {showNavigation && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </>
      )}
    </div>
  );
};

export default HomeCats;