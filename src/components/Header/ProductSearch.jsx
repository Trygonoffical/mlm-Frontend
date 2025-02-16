'use client'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { fetchHomeData } from '@/redux/slices/homeSlice';
import Link from 'next/link';

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const dispatch = useDispatch();

  // Get categories and products from Redux store
  const { data: categories } = useSelector((state) => state.home.categories);
  const { data: products } = useSelector((state) => state.home.products);

  // Filter products based on search term and selected category
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-12" ref={searchRef}>
      {/* Categories Dropdown */}
      <div className="relative">
        <select 
          className="h-full py-2 px-6 bg-[#8B6D4D] text-white text-sm font-medium rounded-l-md outline-none appearance-none cursor-pointer min-w-[160px]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '16px',
            borderRadius: '39px 0px 0px 39px',
          }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input and Results */}
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search for Products......"
          className="w-full min-w-[412px] px-4 py-3 border-y border-r-0 border-l border-gray-300 focus:outline-none text-gray-600"
        />

        {/* Search Results Dropdown */}
        {showResults && searchTerm && (
          <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-96 overflow-y-auto">
            {filteredProducts?.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => {
                    // Handle product selection
                    setShowResults(false);
                    // Add navigation logic here
                  }}
                >
                <Link href={`/product/${product.slug}`}>
                    <div className="flex items-center space-x-4">
                        {product.images && (
                        <img 
                            src={product.images[0].image} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                        />
                        )}
                        <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        {/* <p className="text-sm text-gray-500">{product.price}</p> */}
                        </div>
                    </div>
                </Link>
                  
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500">No products found</div>
            )}
          </div>
        )}
      </div>

      {/* Search Button */}
      <button 
        className="px-4 bg-[#6B8E5F] hover:bg-[#5c7a51] transition-colors flex items-center justify-center"
        style={{
          borderRadius: '0px 39px 39px 0px',
        }}
        onClick={() => {
          // Handle search submission
          dispatch(fetchHomeData('products', {
            search: searchTerm,
            category: selectedCategory
          }));
        }}
      >
        <MagnifyingGlassIcon className="text-white w-6 h-6" />
      </button>
    </div>
  );
};

export default ProductSearch;