// 'use client'

// import { ShoppingCart, Star } from 'lucide-react';
// import Link from 'next/link';
// import { useDispatch } from 'react-redux';
// import { addItemToCart } from '@/redux/slices/cartSlice';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';

// const ProductCard = ({ product , styleval }) => {
//     const [totlePrice , setTotalPrice] = useState(0)
//     const dispatch = useDispatch();

//     const handleAddToCart = () => {
//         // Calculate prices as numbers to ensure proper calculations
//         const sellingPrice = parseFloat(product.selling_price);
//         const gstPercentage = parseFloat(product.gst_percentage);
//         const gstAmount = (sellingPrice * gstPercentage) / 100;
//         const totalPrice = parseFloat(sellingPrice + gstAmount);

//         const cartItem = {
//             id: product.id,
//             name: product.name,
//             slug: product.slug,
//             image: product.images[0].image, // Feature image
//             regular_price: parseFloat(product.regular_price),
//             selling_price: sellingPrice,
//             gst_percentage: gstPercentage,
//             gst_amount: gstAmount,
//             total_price: totalPrice,
//             bp_value: product.bp_value,
//             qnt: 1,
//             stock: product.stock,
//             selectedAttributes: {}, // For future use if needed
            
//         };

//         dispatch(addItemToCart(cartItem));
//     };
//     const updatePrice = (product)=>{
//         const sellingPrice = parseFloat(product.selling_price);
//         const gstPercentage = parseFloat(product.gst_percentage);
//         const gstAmount = (sellingPrice * gstPercentage) / 100;
//         const totalPrice =  sellingPrice + gstAmount;
//         setTotalPrice(totalPrice);
//         console.log('total price - ' , parseFloat(gstAmount).toFixed(2))
//         console.log('total totalPrice - ' , totalPrice)
//         console.log('total gst_percentage - ' , gstPercentage)
//         console.log('total sellingPrice - ' , typeof(sellingPrice))
//         console.log('total gstAmount - ' , typeof(gstAmount))
//     }
//     useEffect(()=>{
//         updatePrice (product)
//     }, [product]);
    
//     return (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow my-2" style={styleval}>
//             <div className="aspect-square relative">
//                 <Link href={`/product/${product.slug}`}>
//                     <Image
//                         src={product.images[0].image}
//                         alt={product.name}
//                         width={300}
//                         height={300}
//                         className="w-full h-full object-cover"
//                     />
//                 </Link>
//                      {product.is_featured && (
//                        <span className="absolute top-2 right-2 bg-yellow-400 text-xs text-black px-2 py-1 rounded">
//                       Featured
//                       </span>
//                    )}
//             </div>

//             <div className="p-4">

//                 <div className="flex  justify-between">
//                     <div className="flex mb-2">
//                         {[...Array(5)].map((_, i) => (
//                             <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                         ))}
//                     </div>
                    
//                     {/* <div className="flex flex-col items-end ml-2">
//                         {product.category_details.map(cat => (
//                             <span key={cat.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
//                                 {cat.name}
//                             </span>
//                         ))}
//                     </div> */}
//                 </div>

//                 <Link href={`/product/${product.slug}`}>
//                     <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
//                 </Link>
                
//                 <div className="space-y-2">
//                     {/* Price Display */}
//                     <div className="flex items-center gap-2">
//                         {parseFloat(product.regular_price) > parseFloat(product.selling_price) ? (
//                             <>
//                                 <span className="text-gray-400 line-through">₹{parseFloat(product.regular_price) + (parseFloat(product.regular_price) * (parseFloat(product.gst_percentage)/100))}</span> 
//                                 <span className="font-bold text-lg">₹{parseFloat(product.selling_price) + + (parseFloat(product.selling_price) * (parseFloat(product.gst_percentage)/100))}</span>
//                             </>
//                         ):(
//                             <span className="font-bold text-lg">₹{totlePrice.toFixed(2)}</span>
//                         )}
//                         {/* <span className="text-gray-400 line-through">₹{product.regular_price}</span>
//                         <span className="font-bold text-lg">₹{product.selling_price}</span> */}
//                     </div>
                
//                     {/* GST and BP Info */}
//                     {/* <div className="text-xs text-gray-500 space-y-1">
//                         <div>GST: {product.gst_percentage}%</div>
//                         {product.bp_value > 0 && (
//                             <div className="text-blue-600 font-medium">
//                                 BP Points: {product.bp_value}
//                             </div>
//                         )}
//                     </div> */}
                
//                     {/* Stock Info */}
//                     <div className="text-sm">
//                         {product.stock > 0 ? (
//                             <span className="text-green-600">In Stock</span>
//                         ) : (
//                             <span className="text-red-600">Out of Stock</span>
//                         )}
//                     </div>
//                 </div>
                
//                 <button
//                     onClick={handleAddToCart}
//                     disabled={product.stock === 0}
//                     className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
//                              transition-colors flex items-center justify-center gap-2 mt-4
//                              disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                     <ShoppingCart className="w-5 h-5" />
//                     {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//                 </button>

//             </div>
//         </div>
//     );
// };

// export default ProductCard;


'use client'

import { ShoppingCart, Star , ChevronLeft, ChevronRight} from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cartSlice';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ProductCard = ({ product, styleval }) => {
    const [totlePrice, setTotalPrice] = useState(0)
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        const sellingPrice = parseFloat(product.selling_price);
        const gstPercentage = parseFloat(product.gst_percentage);
        const gstAmount = (sellingPrice * gstPercentage) / 100;
        const totalPrice = parseFloat(sellingPrice + gstAmount);

        const cartItem = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0].image,
            regular_price: parseFloat(product.regular_price),
            selling_price: sellingPrice,
            gst_percentage: gstPercentage,
            gst_amount: gstAmount,
            total_price: totalPrice,
            bp_value: product.bp_value,
            qnt: 1,
            stock: product.stock,
            selectedAttributes: {},
        };

        dispatch(addItemToCart(cartItem));
    };

    const updatePrice = (product) => {
        const sellingPrice = parseFloat(product.selling_price);
        const gstPercentage = parseFloat(product.gst_percentage);
        const gstAmount = (sellingPrice * gstPercentage) / 100;
        const totalPrice = sellingPrice + gstAmount;
        setTotalPrice(totalPrice);
    }

    useEffect(() => {
        updatePrice(product)
        console.log('product Images -', product.images)
    }, [product]);

    const handleMouseEnter = () => {
        // Change to next image if multiple images exist
        if (product.images.length > 1) {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % product.images.length
            );
        }
    };

    const handleMouseLeave = () => {
        // Reset to first image
        setCurrentImageIndex(0);
    };



    return (
        <div 
            className={`
                bg-white rounded-2xl overflow-hidden shadow-lg 
                transform transition-all duration-300 ease-in-out
                hover:scale-[1.02] hover:shadow-2xl 
                group relative my-5
                border border-gray-100 
                ${isHovered ? 'scale-[1.02]' : ''}
            `}
            style={styleval}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container with Zoom Effect */}
            <div className="aspect-square relative overflow-hidden"
             onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}
            >
                 <Link href={`/product/${product.slug}`}>
                    <Image
                        src={product.images[currentImageIndex].image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                </Link>

                {product.is_featured && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-xs text-black px-2 py-1 rounded-full 
                        transform transition-transform duration-300 
                        group-hover:rotate-6">
                        Featured
                    </span>
                )}
            </div>

            <div className="p-4 relative">
                {/* Rating with Staggered Animation */}
                <div className="flex justify-between mb-2">
                    <div className="flex space-x-1">
                        
                    {[...Array(5)].map((_, i) => {
                        const randomFillCount = Math.floor(Math.random() * 2) + 4; // Randomly 4 or 5
                        return (
                            <Star 
                                key={i} 
                                className={`
                                    w-4 h-4 
                                    ${i < randomFillCount ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                    transition-all duration-300 
                                    group-hover:scale-110
                                    delay-${i * 50}
                                `} 
                            />
                        );
                    })}
                    </div>
                </div>

                <Link href={`/product/${product.slug}`}>
                    <h3 className={`
                        font-semibold mb-2 line-clamp-2 
                        transition-colors duration-300
                        group-hover:text-green-600
                    `}>
                        {product.name}
                    </h3>
                </Link>
                
                <div className="space-y-2">
                    {/* Price Display with Hover Effect */}
                    <div className="flex items-center gap-2">
                        {parseFloat(product.regular_price) > parseFloat(product.selling_price) ? (
                            <>
                                <span className="text-gray-400 line-through opacity-70">
                                    ₹{(parseFloat(product.regular_price) + (parseFloat(product.regular_price) * (parseFloat(product.gst_percentage)/100))).toFixed(0)}
                                </span> 
                                <span className="font-bold text-lg text-green-600">
                                    ₹{(parseFloat(product.selling_price) + (parseFloat(product.selling_price) * (parseFloat(product.gst_percentage)/100))).toFixed(0)}
                                </span>
                            </>
                        ):(
                            <span className="font-bold text-lg text-green-600">
                                ₹{totlePrice.toFixed(0)}
                            </span>
                        )}
                    </div>
                
                    {/* Stock Info with Animated State */}
                    <div className="text-sm">
                        {product.stock > 0 ? (
                            <span className={`
                                text-green-600 
                                animate-pulse
                                transition-colors duration-300
                                group-hover:text-green-700
                            `}>
                                In Stock
                            </span>
                        ) : (
                            <span className="text-red-600 animate-pulse">
                                Out of Stock
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Add to Cart Button with Hover and Disabled States */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`
                        w-full bg-green-600 text-white py-2 px-4 rounded-md 
                        transition-all duration-300 ease-in-out
                        flex items-center justify-center gap-2 mt-4
                        
                        ${product.stock > 0 
                            ? 'hover:bg-green-700 hover:shadow-lg hover:scale-[1.02]' 
                            : 'bg-gray-400 cursor-not-allowed'}
                        
                        active:scale-95
                        group-hover:translate-y-[-5px]
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    <ShoppingCart className={`
                        w-5 h-5 
                        transition-transform duration-300
                        group-hover:rotate-12
                    `} />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;