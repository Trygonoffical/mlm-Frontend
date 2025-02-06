"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import ProductCard from './ProductCard';

const FeatureProducts = ({products , title}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
//   const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


// const fetchproducts = async () => {
//   try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/?bestseller=true`);
//       const data = await response.json();
//       console.log('products - ' , data)
//       setProducts(data);
//   } catch (error) {
//       console.error('Error fetching advertisements:', error);
//   } finally {
//       setLoading(false);
//   }  
// };
  useEffect(() => {
    // fetchproducts();
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
      <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      
      <div className="relative">
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            }}
          >
            {products && products.map((product) => (
              // <div
              //   key={product.id}
              //   className="flex-none w-1/2 sm:w-1/4 px-3"
              //   style={{ flex: `0 0 ${100 / slidesToShow}%` }}
              // >
              //   <div className="bg-gray-50 rounded-lg p-4 cursor-pointer group hover:shadow-lg transition-shadow duration-300">
              //     <div className="relative aspect-square mb-4">
              //       <img
              //         src={product.images[0].image}
              //         alt={product.name}
              //         className="w-full h-full object-contain"
              //       />
              //     </div>
                  
              //     {/* Rating Stars */}
              //     <div className="flex mb-2">
              //       {[...Array(5)].map((_, i) => (
              //         <Star 
              //           key={i}
              //           className="w-4 h-4 fill-yellow-400 text-yellow-400" 
              //         />
              //       ))}
              //     </div>
                  
              //     <h3 className="font-semibold mb-2">{product.name}</h3>
                  
              //     <div className="flex items-center gap-2">
              //       <span className="text-gray-400 line-through">₹{product.regular_price}</span>
              //       <span className="font-bold text-lg">₹{product.selling_price}</span>
              //     </div>
              //   </div>
              // </div>
              <ProductCard product={product} key={product.id} styleval={{ flex: `0 0 ${100 / slidesToShow}%` }} />
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

export default FeatureProducts;