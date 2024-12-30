import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
export default function HomeSticky() {

    const products = [
        { id: 1, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
        { id: 2, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
        { id: 3, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
        { id: 4, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
        { id: 5, name: 'Collagen Herbal Blend Powder', price: 1000, oldPrice: 2000, rating: 5, image: '/Products/p4.jpeg' },
      ];

      

  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base/7 font-semibold text-indigo-600">For Diabetes Patient </p>
              <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Diabetes
              </h1>
              <p className="mt-6 text-xl/8 text-gray-700">
                Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam
                eget aliquam. Quisque id at vitae feugiat egestas.
              </p>
            </div>
          </div>
        </div>
        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            alt=""
            src="/Products/p1.jpeg"
            className="w-[48rem]  rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none mt-5 px-3"
                // style={{ flex: `0 0 ${100 / slidesToShow}%` }}
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
  )
}
