"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const BestSelling = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  const products = [
    { id: 1, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
    { id: 2, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
    { id: 3, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
    { id: 4, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
    { id: 5, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(window.innerWidth < 640 ? 2 : 4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + slidesToShow;
      return nextIndex >= products.length ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex - 1 < 0 ? products.length - slidesToShow : prevIndex - 1;
    });
  };

  // Only show navigation if there are more items than visible slides
  const showNavigation = products.length > slidesToShow;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Best Selling</h2>
      
      <div className="relative">
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-1/2 sm:w-1/4 px-3"
                style={{ flex: `0 0 ${100 / slidesToShow}%` }}
              >
                <div className="bg-gray-50 rounded-lg p-4 cursor-pointer group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-square mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                      />
                    ))}
                  </div>
                  
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through">₹{product.oldPrice}</span>
                    <span className="font-bold text-lg">₹{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Only shown when needed */}
        {showNavigation && (
          <>
            <button
              onClick={prevSlide}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BestSelling;