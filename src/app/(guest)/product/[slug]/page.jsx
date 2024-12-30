'use client'

import React, { useState } from 'react';
import { Star, ChevronDown, ShoppingCart, Truck, Shield } from 'lucide-react';

const ProductDetail = () => {
  const [mainImage, setMainImage] = useState('/Products/p4.jpeg');
  const [quantity, setQuantity] = useState(1);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const thumbnails = [
    '/Products/p4.jpeg',
    '/Products/p3.jpeg',
    '/Products/p2.jpeg',
    '/Products/p1.jpeg',
    '/Products/p1.jpeg'
  ];

  const featuredProducts = [
    { id: 1, name: 'Test Product', rating: 5, image: '/Products/p4.jpeg' },
    { id: 2, name: 'Test Product', rating: 5, image: '/Products/p4.jpeg' },
    { id: 3, name: 'Test Product', rating: 5, image: '/Products/p4.jpeg' },
    { id: 4, name: 'Test Product', rating: 5, image: '/Products/p4.jpeg' }
  ];

  const faqs = [
    { id: 1, question: "What is Herbal Power for AESTHETICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { id: 2, question: "What is Herbal Power for ECONOMICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { id: 3, question: "What is Herbal Power for ECONOMICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { id: 4, question: "What is Herbal Power for ECONOMICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { id: 5, question: "What is Herbal Power for ECONOMICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
  ];

  const toggleFaq = (id) => {
    setSelectedFaq(selectedFaq === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square">
            <img
              src={mainImage}
              alt="Product"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {thumbnails.map((thumb, index) => (
              <button
                key={index}
                onClick={() => setMainImage(thumb)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  mainImage === thumb ? 'border-green-500' : 'border-transparent'
                }`}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Test Product</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">₹1000</span>
              <span className="text-gray-500 line-through">₹2000</span>
            </div>
            <span className="text-green-600">50% OFF</span>
          </div>

          {/* Benefits */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span>Qty:</span>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-20 px-3 py-2 border rounded-lg"
              />
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
              ADD TO CART
            </button>
            <button className="w-full bg-[#8B6D4D] text-white py-3 rounded-lg hover:opacity-90 transition-opacity">
              BUY NOW
            </button>
          </div>

          {/* Description & Specifications Tabs */}
          <div className="space-y-4 border-t pt-6">
            <div className="border rounded-lg">
              <button
                onClick={() => toggleFaq('description')}
                className="flex justify-between items-center w-full p-4"
              >
                <span className="font-semibold">Description</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${
                  selectedFaq === 'description' ? 'rotate-180' : ''
                }`} />
              </button>
              {selectedFaq === 'description' && (
                <div className="p-4 border-t">
                  Product description goes here...
                </div>
              )}
            </div>
            <div className="border rounded-lg">
              <button
                onClick={() => toggleFaq('specifications')}
                className="flex justify-between items-center w-full p-4"
              >
                <span className="font-semibold">Specifications</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${
                  selectedFaq === 'specifications' ? 'rotate-180' : ''
                }`} />
              </button>
              {selectedFaq === 'specifications' && (
                <div className="p-4 border-t">
                  Product specifications go here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Feature Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="space-y-2">
              <div className="aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex items-center gap-1">
                {[...Array(product.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h3 className="font-semibold">{product.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Success Stories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-[#8B6D4D] text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">FAQ'S</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-white/20 last:border-0">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="flex justify-between items-center w-full py-4"
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${
                  selectedFaq === faq.id ? 'rotate-180' : ''
                }`} />
              </button>
              {selectedFaq === faq.id && (
                <div className="pb-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;