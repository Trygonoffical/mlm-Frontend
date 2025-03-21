

'use client'

import React, { useState, useEffect } from 'react';
import { Star, Search, Filter, X, ShoppingCart, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getTokens } from '@/utils/cookies';
import { toast } from 'react-hot-toast';
import ProductMlmCard from '@/components/Products/ProductMlmCard';

const ShopPage = () => {
  // All useState hooks at the top
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]); 
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  
  // New state for document verification
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  const [documentStatus, setDocumentStatus] = useState(null);

  const { token } = getTokens();

  // Fetch document verification status
  const checkDocumentVerification = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kyc-documents/`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch document status');
      }

      const documents = await response.json();
      
      // Check if there are any verified documents
      const verifiedDocuments = documents.filter(
        doc => doc.status === 'VERIFIED'
      );

      setIsDocumentVerified(verifiedDocuments.length > 0);
      setDocumentStatus(documents);
    } catch (error) {
      console.error('Error checking document verification:', error);
      toast.error('Unable to verify documents');
    }
  };

  // Fetch products data
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`);
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);

      // Extract unique categories from the products
      const uniqueCategories = new Set(['All']);
      data.forEach(product => {
        product.category_details.forEach(category => {
          uniqueCategories.add(category.name);
        });
      });
      setCategories(Array.from(uniqueCategories));
    } catch (error) {
      console.error('Error fetching Products:', error);
    }
  };

  // Check document status on component mount
  useEffect(() => {
    checkDocumentVerification();
    fetchProducts();
  }, []);

  // Filter and search function
  const filterProducts = () => {
    let result = [...products];

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product =>
        product.category_details.some(cat => cat.name === selectedCategory)
      );
    }

    // Apply price range filter using selling_price
    result = result.filter(product => {
      const price = parseFloat(product.selling_price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => parseFloat(a.selling_price) - parseFloat(b.selling_price));
        break;
      case 'price-high-low':
        result.sort((a, b) => parseFloat(b.selling_price) - parseFloat(a.selling_price));
        break;
      case 'name-a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  // Effect to run filtering when any filter changes
  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  // Handle price range change
  const handlePriceRangeChange = (e, type) => {
    const value = parseInt(e.target.value);
    if (type === 'min') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    filterProducts();
  };

  // Render document verification warning
  const renderDocumentVerificationWarning = () => {
    if (isDocumentVerified) return null;

    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
          <div>
            <p className="text-yellow-700 font-semibold">
              Document Verification Required
            </p>
            <p className="text-yellow-600 text-sm">
              You need to verify your documents to make purchases.
            </p>
          </div>
          <Link 
            href="/mu/dashboard/kyc"
            className="ml-auto bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
          >
            Verify Documents
          </Link>
        </div>
      </div>
    );
  };

  // Render products or verification message
  const renderProductContent = () => {
    if (!isDocumentVerified) {
      return (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Documents Not Verified
          </h2>
          <p className="text-gray-600 mb-6">
            Please complete your KYC document verification to access products.
          </p>
          <Link 
            href="/mu/dashboard/kyc"
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition inline-block"
          >
            Verify Documents Now
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="flex-1">
          <div className="block">
            {filteredProducts.map((product) => (
              <ProductMlmCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-5">
      <div className="max-w-7xl mx-auto px-4 mt-10">
        {/* Document Verification Warning */}
        {renderDocumentVerificationWarning()}

        {/* Header with search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Our Products</h1>
          
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

          {/* Sort dropdown and mobile filter button */}
          <div className="flex gap-4 items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="default">Sort By</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
            </select>

            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="md:hidden bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 'min')}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 'max')}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="form-radio text-green-600"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid or Verification Message */}
          {renderProductContent()}
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
              
              {/* Mobile Filters Content */}
              <div className="space-y-6">
                {/* Price Range Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(e, 'min')}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(e, 'max')}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="form-radio text-green-600"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;