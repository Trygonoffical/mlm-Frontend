'use client'

import React, { useState, useEffect, use } from 'react';
import { Star, Search, Filter, X, ShoppingCart } from 'lucide-react';
import PageHead from '@/components/Pagehead/PageHead';
import ProductCard from '@/components/Products/ProductCard';

const CategoryPage = ({params}) => {
    const [categoriesList, setCategoriesList] = useState([]);

    const slug = use(params).slug;



    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/?slug=${slug}`);
            const data = await res.json();
            console.log('cat data - ',data[0] )
            console.log('cat products - ',data[0].products )
            setCategoriesList(data[0]);
            setProducts(data[0].products)
            setFilteredProducts(data[0].products)
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);


  const [products , setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [cart, setCart] = useState([]);



  // Filter and search function
  const filterProducts = () => {
    let result = [...products];

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  };

  // Effect to run filtering when any filter changes
  useEffect(() => {
    filterProducts();
  }, [searchTerm]);

  // Add to cart functionality
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };



  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    filterProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
    <PageHead title={categoriesList.name} />
      <div className="max-w-7xl mx-auto px-4 mt-10">
        {/* Header with search */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {/* <h1 className="text-3xl font-bold">Products</h1> */}
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </form>

          
        </div>

        <div className="flex gap-8">
          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                // <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                //   <div className="aspect-square relative">
                //     <img
                //       src={product.images[0].image}
                //       alt={product.name}
                //       className="w-full h-full object-cover"
                //     />
                //   </div>
                //   <div className="p-4">
                //     <div className="flex mb-2">
                //       {[...Array(product.rating)].map((_, i) => (
                //         <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                //       ))}
                //     </div>
                //     <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                //     <div className="flex items-center gap-2 mb-3">
                //       <span className="text-gray-400 line-through">₹{product.regular_price}</span>
                //       <span className="font-bold text-lg">₹{product.selling_price}</span>
                //     </div>
                //     <button
                //       onClick={() => addToCart(product)}
                //       className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                //     >
                //       <ShoppingCart className="w-5 h-5" />
                //       Add to Cart
                //     </button>
                //   </div>
                // </div>
                <ProductCard key={product.id} product={product}  />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="absolute right-0 top-0 h-full w-80 bg-white p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;