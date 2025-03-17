// 'use client'

// import React, { use, useEffect, useState } from 'react';
// import { Star, ChevronDown, ShoppingCart, Truck, Shield } from 'lucide-react';
// import ProductCard from '@/components/Products/ProductCard';
// import { useDispatch } from 'react-redux';
// import { addItemToCart } from '@/redux/slices/cartSlice';
// import SuccessAndReviews from '@/components/Stories/homestories';
// import FeatureProducts from '@/components/Products/FeatureProducts';
// import { notFound, useRouter } from 'next/navigation';
// const ProductDetail = ({params}) => {
//     const slug = use(params).slug;
//     const [product, setProduct] = useState([]);
//     const [faqs, setFaqs] = useState([]);
//     const [producAds, setProductAds] = useState([]);
//     const [thumbnails, setThumbnails] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [featuredProducts, setFeaturedProducts] = useState([]);
//     const [totlePrice , setTotalPrice] = useState(0)
//     const router = useRouter();
//     const fetchAdvertisements = async () => {
//       try {
//           const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisements/?position=PRODUCT_PAGE`, {
//           });
//           const data = await response.json();
//           console.log('Products ads' , data[0])
//           setProductAds(data[0]);
//       } catch (error) {
//           console.error('Error fetching advertisements:', error);
//       } finally {
//           setLoading(false);
//       }
//     }

//     const fetchProduct = async () => {
//           try {
//               const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/?slug=${slug}`);
//               const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/?featured=true`);
//               const data = await res.json();
//               if(!res.ok) return notFound();

//               const data2 = await res2.json();
//               console.log('cat data - ',data )
//               console.log('featuredProducts data - ',data2 )
//               setFeaturedProducts(data2)
//               console.log('cat data - ',data[0] )
//               setProduct(data[0]);
//               setFaqs(data[0]?.faq);
//               setMainImage(data[0]?.images[0].image)
//               setThumbnails(extractThumbnails(data))
//           } catch (error) {
//               console.error('Error fetching categories:', error);
//           }
//     };
  
//     const updatePrice = (product)=>{
//       const sellingPrice = parseFloat(product.selling_price);
//       const gstPercentage = parseFloat(product.gst_percentage);
//       const gstAmount = (sellingPrice * gstPercentage) / 100;
//       const totalPrice =  sellingPrice + gstAmount;
//       setTotalPrice(totalPrice);
//   }
//   useEffect(()=>{
//     updatePrice(product)
//   },[product])
//     useEffect(() => {
//         fetchAdvertisements()
//         fetchProduct();
//     }, [])
  
//     const extractThumbnails = (products) => {
//         return products.flatMap(product => 
//             product.images.map(image => image.image) // Extract image URLs
//         );
//     }

//     const dispatch = useDispatch()

//     const handleAddToCart = () => {
//       if (!product || quantity <= 0) return;
  
//       if (quantity > product.stock) {
//         toast.error('Quantity exceeds available stock');
//         return;
//       }
  
//       const cartItem = {
//         id: product.id,
//         name: product.name,
//         slug: product.slug,
//         image: product.images[0].image,
//         regular_price: parseFloat(product.regular_price),
//         selling_price: parseFloat(product.selling_price),
//         gst_percentage: parseFloat(product.gst_percentage),
//         bp_value: product.bp_value,
//         stock: product.stock,
//         qnt: quantity,
//         selectedAttributes: {},
//         // Calculate GST amount and total price
//         gst_amount: parseFloat(
//           ((parseFloat(product.selling_price) * quantity * product.gst_percentage) / 100).toFixed(2)
//         ),
//         total_price: parseFloat(
//           (parseFloat(product.selling_price) * quantity * (1 + product.gst_percentage / 100)).toFixed(2)
//         ),
//       };
  
//       dispatch(addItemToCart(cartItem));
//       // toast.success('Added to cart successfully');
//     }


//     const [mainImage, setMainImage] = useState(null)
//     const [quantity, setQuantity] = useState(1)
//     const [selectedFaq, setSelectedFaq] = useState(null)


//     // const faqs = [
//     //   { id: 1, question: "What is Herbal Power for AESTHETICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
//     //   { id: 2, question: "What is Herbal Power for ECONOMICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
//     //   { id: 3, question: "What is Herbal Power for ECONOMICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
//     //   { id: 4, question: "What is Herbal Power for ECONOMICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
//     //   { id: 5, question: "What is Herbal Power for ECONOMICS?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
//     // ]

//     const toggleFaq = (id) => {
//       setSelectedFaq(selectedFaq === id ? null : id);
//     }

//     const handleBuyNow = () => {
//       handleAddToCart();
//       // Navigate to cart/checkout page
//       router.push('/checkout');
//     }

//     return (
//       <div className="container mx-auto px-4 py-8">
//         {/* Product Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
//           {/* Image Gallery */}
//           <div className="space-y-4">
//             <div className="aspect-square">
//               <img
//                 src={mainImage}
//                 alt="Product"
//                 className="w-full h-full object-cover rounded-lg"
//               />
//             </div>
//             <div className="grid grid-cols-5 gap-2">
//               {thumbnails && thumbnails.map((thumb, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setMainImage(thumb)}
//                   className={`aspect-square rounded-lg overflow-hidden border-2 ${
//                     mainImage === thumb ? 'border-green-500' : 'border-transparent'
//                   }`}
//                 >
//                   <img
//                     src={thumb}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{product.name}</h1>
            
//             {/* Rating */}
//             <div className="flex items-center gap-1">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//               ))}
//             </div>
//             {/* Desciption */}
//             <div className="space-y-2">
//               <div className="flex items-baseline gap-2">
//               <span dangerouslySetInnerHTML={{ __html: product.description }} />
//               </div>
              
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-baseline gap-2">
//               {/* <span dangerouslySetInnerHTML={{ __html: product.description }} /> */}
//               {producAds && (
//                     <img src={producAds.image} 
//                       className='w-auto h-20'
//                       />
//               )}
//               </div>
//             </div>

//             {/* Price */}
//             <div className="space-y-2">
//               <div className="flex items-baseline gap-2">
//               {parseFloat(product.regular_price) > parseFloat(product.sellingPrice) ? (
//                           <>
//                            <span className="text-2xl font-bold">₹{product.selling_price}</span>
//                            <span className="text-gray-500 line-through">₹{product.regular_price}</span>
//                           </>

//                         ):(
//                           <span className="text-2xl font-bold">₹{totlePrice.toFixed(2)}</span>
//                         )
//                         }
//                 {/* <span className="text-2xl font-bold">₹{total}</span> */}
//                 {/* <span className="text-gray-500 line-through">₹{product.regular_price}</span> */}
//               </div>
//               {/* <span className="text-green-600">50% OFF</span> */}
//               {product.regular_price > product.selling_price && (
//               <span className="text-green-600">
//                 {Math.round(((product.regular_price - product.selling_price) / product.regular_price) * 100)}% OFF
//               </span>
//             )}
//             </div>

//             {/* Benefits */}
//             <div className="flex items-center gap-4 text-sm text-gray-600">
//               <div className="flex items-center gap-1">
//                 <Truck className="w-4 h-4" />
//                 <span>Free Shipping</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Shield className="w-4 h-4" />
//                 <span>Secure Payment</span>
//               </div>
//             </div>

//             {/* Quantity and Add to Cart */}
//             <div className="space-y-4">
//             <div className="flex items-center gap-4">
//               <span>Qty:</span>
//               <input
//                 type="number"
//                 min="1"
//                 max={product.stock}
//                 value={quantity}
//                 onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
//                 className="w-20 px-3 py-2 border rounded-lg"
//               />
//               {product.stock > 0 && (
//                 <span className="text-sm text-gray-500">
//                   Available: {product.stock > 0 ? 'Available ': 'Out of Stock'}
//                 </span>
//               )}
//             </div>
//             {product.stock > 0 ? (
//             <>
//               <button
//                 onClick={handleAddToCart}
//                 className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
//                         transition-colors flex items-center justify-center gap-2"
//               >
//                 <ShoppingCart className="w-5 h-5" />
//                 ADD TO CART
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 className="w-full bg-[#8B6D4D] text-white py-3 rounded-lg hover:opacity-90 
//                         transition-opacity"
//               >
//                 BUY NOW
//               </button>
//             </>
//           ) : (
//             <div className="text-red-600 font-medium text-center py-2">
//               Out of Stock
//             </div>
//           )}
//             </div>

//             {/* Description & Specifications Tabs */}
//             <div className="space-y-4 border-t pt-6">
//               {product.features && product.features.map(item =>(

//               <div className="border rounded-lg" key={item.id}>
//                 <button
//                   onClick={() => toggleFaq(item.title)}
//                   className="flex justify-between items-center w-full p-4"
//                 >
//                   <span className="font-semibold">{item.title}</span>
//                   <ChevronDown className={`w-5 h-5 transition-transform ${
//                     selectedFaq === item.title ? 'rotate-180' : ''
//                   }`} />
//                 </button>
//                 {selectedFaq === item.title && (
//                   <div className="p-4 border-t prose max-w-none">
//                     {/* {item.content} */}
//                     <div  dangerouslySetInnerHTML={{ __html: item.content }} />
//                   </div>
//                 )}
//               </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Featured Products */}
//         {/* <div className="mb-16">
//           <h2 className="text-2xl font-bold mb-6">Feature Products</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {featuredProducts.map((product) => (
//               <FeatureProducts key={product.id} products={featuredProducts} title='Feature Products' />
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </div> */}

//         <FeatureProducts key={product.id} products={featuredProducts} title='Feature Products' />
//         {/* Success Stories */}
//         {/* <div className="mb-16">
//           <h2 className="text-2xl font-bold mb-6">Success Stories</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
//             ))}
//           </div>
//         </div> */}
//         <SuccessAndReviews />

//         {/* FAQs */}
//         <div className="bg-[#8B6D4D] text-white p-8 rounded-lg">
//           <h2 className="text-2xl font-bold mb-6">FAQ'S</h2>
//           <div className="space-y-4">
//             {faqs.map((faq) => (
//               <div key={faq.id} className="border-b border-white/20 last:border-0">
//                 <button
//                   onClick={() => toggleFaq(faq.id)}
//                   className="flex justify-between items-center w-full py-4"
//                 >
//                   <span className="font-semibold">{faq.title}</span>
//                   <ChevronDown className={`w-5 h-5 transition-transform ${
//                     selectedFaq === faq.id ? 'rotate-180' : ''
//                   }`} />
//                 </button>
//                 {selectedFaq === faq.id && (
//                   <div className="pb-4">
//                     {/* {faq.content} */}
//                     <span dangerouslySetInnerHTML={{ __html: faq.content }} />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
// };

// export default ProductDetail;


'use client'

import React, { use, useEffect, useState } from 'react';
import { Star, ChevronDown, ShoppingCart, Truck, Shield } from 'lucide-react';
import ProductCard from '@/components/Products/ProductCard';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cartSlice';
import SuccessAndReviews from '@/components/Stories/homestories';
import FeatureProducts from '@/components/Products/FeatureProducts';
import { notFound, useRouter } from 'next/navigation';
import RichContentRenderer from '@/components/Editor/RichContentRenderer';

const ProductDetail = ({params}) => {
    const slug = use(params).slug;
    const [product, setProduct] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [producAds, setProductAds] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [totlePrice , setTotalPrice] = useState(0)
    const router = useRouter();
    
    const fetchAdvertisements = async () => {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/advertisements/?position=PRODUCT_PAGE`, {
          });
          const data = await response.json();
          console.log('Products ads' , data[0])
          setProductAds(data[0]);
      } catch (error) {
          console.error('Error fetching advertisements:', error);
      } finally {
          setLoading(false);
      }
    }

    const fetchProduct = async () => {
          try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/?slug=${slug}`);
              
              // Check if response is OK first
              if (!res.ok) {
                  console.log('Error fetching product:', res.status);
                   notFound();
              }
              
              const data = await res.json();
              
              // Check if the product was found (empty array means no product)
              if (!data || data.length === 0) {
                  console.log('Product not found');
                   notFound();
              }
              
              const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/?featured=true`);
              const data2 = await res2.json();
              
              console.log('cat data - ',data )
              console.log('featuredProducts data - ',data2 )
              setFeaturedProducts(data2)
              console.log('cat data - ',data[0] )
              setProduct(data[0]);
              setFaqs(data[0]?.faq || []);
              
              // Set main image only if images exist
              if (data[0]?.images && data[0].images.length > 0) {
                  setMainImage(data[0].images[0].image);
              }
              
              setThumbnails(extractThumbnails(data));
          } catch (error) {
              console.error('Error fetching product:', error);
          }
    };
  
    const updatePrice = (product) => {
        if (!product || !product.selling_price) return;
        
        const sellingPrice = parseFloat(product.selling_price);
        const gstPercentage = parseFloat(product.gst_percentage || 0);
        const gstAmount = (sellingPrice * gstPercentage) / 100;
        const totalPrice = sellingPrice + gstAmount;
        setTotalPrice(totalPrice);
    }
    
    useEffect(() => {
        updatePrice(product)
    }, [product])
    
    useEffect(() => {
        fetchAdvertisements()
        fetchProduct();
    }, [])
  
    const extractThumbnails = (products) => {
        if (!products || !Array.isArray(products) || products.length === 0) return [];
        
        return products.flatMap(product => 
            product.images?.map(image => image.image) || []
        );
    }

    const dispatch = useDispatch()

    const handleAddToCart = () => {
      if (!product || !product.id || quantity <= 0) return;
  
      if (quantity > product.stock) {
        // toast.error('Quantity exceeds available stock');
        return;
      }
  
      const cartItem = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0]?.image || '',
        regular_price: parseFloat(product.regular_price || 0),
        selling_price: parseFloat(product.selling_price || 0),
        gst_percentage: parseFloat(product.gst_percentage || 0),
        bp_value: product.bp_value || 0,
        stock: product.stock || 0,
        qnt: quantity,
        selectedAttributes: {},
        // Calculate GST amount and total price
        gst_amount: parseFloat(
          ((parseFloat(product.selling_price || 0) * quantity * (product.gst_percentage || 0)) / 100).toFixed(2)
        ),
        total_price: parseFloat(
          (parseFloat(product.selling_price || 0) * quantity * (1 + (product.gst_percentage || 0) / 100)).toFixed(2)
        ),
      };
  
      dispatch(addItemToCart(cartItem));
      // toast.success('Added to cart successfully');
    }


    const [mainImage, setMainImage] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedFaq, setSelectedFaq] = useState(null)

    const toggleFaq = (id) => {
      setSelectedFaq(selectedFaq === id ? null : id);
    }

    const handleBuyNow = () => {
      handleAddToCart();
      // Navigate to cart/checkout page
      router.push('/checkout');
    }

    // Early return if no product (will be caught by fetchProduct and redirect to 404)
    if (!product || !product.id) {
      return null;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square">
              <img
                src={mainImage}
                alt={product.name || "Product"}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {thumbnails && thumbnails.map((thumb, index) => (
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
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            {/* Desciption */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
              {/* <span dangerouslySetInnerHTML={{ __html: product.description }} /> */}
              <RichContentRenderer 
                  content={product.description} 
                  className="text-gray-700 leading-relaxed"
                />
              </div>
              
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
              {/* <span dangerouslySetInnerHTML={{ __html: product.description }} /> */}
              {producAds && (
                    <img src={producAds.image} 
                      className='w-auto h-20'
                      alt="Product Advertisement"
                      />
              )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
              {parseFloat(product.regular_price || 0) > parseFloat(product.sellingPrice || 0) ? (
                          <>
                           <span className="text-2xl font-bold">₹{parseFloat(product.selling_price) + + (parseFloat(product.selling_price) * (parseFloat(product.gst_percentage)/100))}</span>
                           <span className="text-gray-500 line-through">₹{parseFloat(product.regular_price) + (parseFloat(product.regular_price) * (parseFloat(product.gst_percentage)/100))}</span>

                           
                          </>
                        //   <>
                        //     <span className="text-gray-400 line-through">₹{parseFloat(product.regular_price) + (parseFloat(product.regular_price) * (parseFloat(product.gst_percentage)/100))}</span> 
                        //     <span className="font-bold text-lg">₹{parseFloat(product.selling_price) + + (parseFloat(product.selling_price) * (parseFloat(product.gst_percentage)/100))}</span>
                        // </>

                        ):(
                          <span className="text-2xl font-bold">₹{totlePrice.toFixed(2)}</span>
                        )
                        }
                {/* <span className="text-2xl font-bold">₹{total}</span> */}
                {/* <span className="text-gray-500 line-through">₹{product.regular_price}</span> */}
              </div>
              {/* <span className="text-green-600">50% OFF</span> */}
              {product.regular_price > product.selling_price && (
              <span className="text-green-600">
                {Math.round(((product.regular_price - product.selling_price) / product.regular_price) * 100)}% OFF
              </span>
            )}
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
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 border rounded-lg"
              />
              {product.stock > 0 && (
                <span className="text-sm text-gray-500">
                  Available: {product.stock > 0 ? 'Available ': 'Out of Stock'}
                </span>
              )}
            </div>
            {product.stock > 0 ? (
            <>
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
                        transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#8B6D4D] text-white py-3 rounded-lg hover:opacity-90 
                        transition-opacity"
              >
                BUY NOW
              </button>
            </>
          ) : (
            <div className="text-red-600 font-medium text-center py-2">
              Out of Stock
            </div>
          )}
            </div>

            {/* Description & Specifications Tabs */}
            <div className="space-y-4 border-t pt-6">
              {product.features && product.features.map(item =>(

              <div className="border rounded-lg" key={item.id}>
                <button
                  onClick={() => toggleFaq(item.title)}
                  className="flex justify-between items-center w-full p-4"
                >
                  <span className="font-semibold">{item.title}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${
                    selectedFaq === item.title ? 'rotate-180' : ''
                  }`} />
                </button>
                {selectedFaq === item.title && (
                  <div className="p-4 border-t prose max-w-none">
                    {/* {item.content} */}
                    {/* <div  dangerouslySetInnerHTML={{ __html: item.content }} /> */}
                    <RichContentRenderer 
                      content={item.content} 
                      className="text-gray-700 leading-relaxed"
                    />
                  </div>
                )}
              </div>
              ))}
            </div>
          </div>
        </div>

        <FeatureProducts key={product.id} products={featuredProducts} title='Feature Products' />
        <SuccessAndReviews />

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <div className="bg-[#8B6D4D] text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">FAQ'S</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border-b border-white/20 last:border-0">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex justify-between items-center w-full py-4"
                  >
                    <span className="font-semibold">{faq.title}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      selectedFaq === faq.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {selectedFaq === faq.id && (
                    <div className="pb-4">
                      {/* <span dangerouslySetInnerHTML={{ __html: faq.content }} /> */}
                      <RichContentRenderer 
                      content={faq.content} 
                      className="text-gray-700 leading-relaxed"
                    />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

export default ProductDetail;