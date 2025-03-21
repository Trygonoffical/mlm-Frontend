'use client'
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import RichContentRenderer from '../Editor/RichContentRenderer';
export default function HomeSticky() {

    // const products = [
    //     { id: 1, name: 'Collagen Herbal Blend Powder1', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
    //     { id: 2, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
    //     { id: 3, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
    //     { id: 4, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
    //     { id: 5, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
    //   ];

      const [homeSections, setHomeSections] = useState([]);
      
        const fetchData = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home-sections/`);
            const data = await response.json();
            console.log('home-sections - ', data)
            setHomeSections(data);
          } catch (error) {
            console.log('Error fetching Data - ', error)
          }
        };
      
 useEffect(() => {
  fetchData();
    }, []);
  return (
    <>
      {
        homeSections && homeSections.map(homeSection => (
          <div key={homeSection.id} className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
              <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                <div className="lg:pr-4">
                  <div className="lg:max-w-lg">
                    <p className="text-base/7 font-semibold text-indigo-600">{homeSection.subtitle} </p>
                    <h1 className="my-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {homeSection.title}
                    </h1>
                    {/* <div dangerouslySetInnerHTML={{ __html: homeSection.description }} /> */}
                    <RichContentRenderer 
                        content={homeSection.description} 
                        className="text-gray-700  whitespace-normal break-words w-full max-w-full leading-relaxed"
                      />
                    
                  </div>
                </div>
              </div>
              <div className="md:-ml-12 md:-mt-20 md:pl-12 md:pr-12 md:pb-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                <img
                  alt="slideImage"
                  src={homeSection.image}
                  className="w-[48rem]  rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                <div className="lg:pr-4">
                  <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
                  {homeSection.products && homeSection.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                  </div>
                </div>
              </div>
            </div>
    
            {/* background  */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <svg
                aria-hidden="true"
                className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
              >
                <defs>
                  <pattern
                    x="50%"
                    y={-1}
                    id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                    width={200}
                    height={200}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M100 200V.5M.5 .5H200" fill="none" />
                  </pattern>
                </defs>
                <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                  <path
                    d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                    strokeWidth={0}
                  />
                </svg>
                <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
              </svg>
            </div>
        
        </div>
        ))
      }
    </>
   
  )
}
