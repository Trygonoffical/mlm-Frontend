"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import ProductCard from './ProductCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Product.module.css"
import Slider from 'react-slick';

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
    aria-label="Previous slide"
  >
    <ChevronLeft className="w-6 h-6 text-gray-600" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
    aria-label="Next slide"
  >
    <ChevronRight className="w-6 h-6 text-gray-600" />
  </button>
);


const FeatureProducts = ({products , title}) => {
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [slidesToShow, setSlidesToShow] = useState(4);
  const [fetproducts, setFetProducts] = useState([]);
  const [loading, setLoading] = useState(true);



  // useEffect(() => {
  //   // fetchproducts();
  //   const handleResize = () => {
  //     setSlidesToShow(window.innerWidth < 640 ? 2 : 4);
  //   };

  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // const nextSlide = () => {
  //   setCurrentIndex((prevIndex) => {
  //     const nextIndex = prevIndex + slidesToShow;
  //     return nextIndex >= products.length ? 0 : prevIndex + 1;
  //   });
  // };

  // const prevSlide = () => {
  //   setCurrentIndex((prevIndex) => {
  //     return prevIndex - 1 < 0 ? products.length - slidesToShow : prevIndex - 1;
  //   });
  // };

  // Only show navigation if there are more items than visible slides
  // const showNavigation = products.length > slidesToShow;


  useEffect(() => {
    setFetProducts(products);
    setLoading(false)
  }, [products]);

  const settings = {
    dots: false,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      
      <div className="relative">

        {/* Add a wrapper div with specific width */}
        <div className="w-full">
          <Slider {...settings} className="best-selling-slider">
            {fetproducts && fetproducts.map((pro) => (
              <div key={pro.id} className="px-2">
                <div className="outline-none">
                  <ProductCard product={pro} />
                </div>
              </div>
            ))}
          </Slider>
        </div>


        {/* <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            }}
          >
            {products && products.map((product) => (
              <ProductCard product={product} key={product.id} styleval={{ flex: `0 0 ${100 / slidesToShow}%` }} />
            ))}
          </div>
        </div> */}

        {/* Navigation Buttons - Only shown when needed */}
        {/* {showNavigation && (
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
        )} */}
      </div>
    </div>
  );
};

export default FeatureProducts;