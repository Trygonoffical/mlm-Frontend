'use client'

import { ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cartSlice';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ProductMlmCard = ({ product , styleval}) => {
    const [totlePrice , setTotalPrice] = useState(0)
    const dispatch = useDispatch();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { userInfo } = useSelector((state) => state.auth);
    const [mlmDiscountPercentage , setMlmDiscountPercentage] = useState(0)
    const handleAddToCart = () => {
        // Calculate prices as numbers to ensure proper calculations
        const sellingPrice = parseFloat(product.selling_price);
        const gstPercentage = parseFloat(product.gst_percentage);
        const gstAmount = (sellingPrice * gstPercentage) / 100;
        const totalPrice = parseFloat(sellingPrice + gstAmount);
        // const discountedSubTotal = 0 ;

        const cartItem = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0].image, // Feature image
            regular_price: parseFloat(product.regular_price),
            selling_price: sellingPrice,
            gst_percentage: gstPercentage,
            gst_amount: gstAmount,
            total_price: totalPrice,
            bp_value: product.bp_value,
            qnt: 1,
            stock: product.stock,
            selectedAttributes: {}, // For future use if needed
            mlmDiscountPercentage: mlmDiscountPercentage || 0,
            // mlmDiscountPercentage: userInfo?.user_data?.position?.discount_percentage || 0,
            // discountedSubTotal : discountedSubTotal
        };

        dispatch(addItemToCart(cartItem));
    };
    const updatePrice = (product)=>{
        const sellingPrice = parseFloat(product.selling_price);
        const gstPercentage = parseFloat(product.gst_percentage);
        const gstAmount = (sellingPrice * gstPercentage) / 100;
        const totalPrice =  sellingPrice + gstAmount;
        setTotalPrice(totalPrice);
        console.log('total price - ' , parseFloat(gstAmount).toFixed(2))
        console.log('total totalPrice - ' , totalPrice)
        console.log('total gst_percentage - ' , gstPercentage)
        console.log('total sellingPrice - ' , typeof(sellingPrice))
        console.log('total gstAmount - ' , typeof(gstAmount))
    }
    useEffect(()=>{
        updatePrice (product)
        if(userInfo){
            // console.log()
            console.log('userInfo -- mlm cart' , userInfo)
            console.log('mlm cart discount_percentage - ',  userInfo?.user_data?.position?.discount_percentage)
            setMlmDiscountPercentage(userInfo?.user_data?.position?.discount_percentage)
        }
        
    }, [product , userInfo]);
    
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex my-2" style={styleval}>
            <div className="aspect-square relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >
                <Link href={`/product/${product.slug}`}>
                    <Image
                        // src={product.images[0].image}
                        src={product.images[currentImageIndex].image}

                        alt={product.name}
                        width={250}
                        height={250}
                        className="object-cover"
                    />
                </Link>
                     {product.is_featured && (
                       <span className="absolute top-2 right-2 bg-yellow-400 text-xs text-black px-2 py-1 rounded">
                      Featured
                      </span>
                   )}
            </div>

            <div className="p-4">

                <div className="flex  justify-between">
                    
                    
                    {/* <div className="flex flex-col items-end ml-2">
                        {product.category_details.map(cat => (
                            <span key={cat.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {cat.name}
                            </span>
                        ))}
                    </div> */}
                </div>

                <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                </Link>
                <div className="flex mb-2">
                    {/* {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))} */}
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
                
                <div className="space-y-2">
                    {/* Price Display */}
                    <div className="flex items-center gap-2">
                        {parseFloat(product.regular_price) > parseFloat(product.selling_price) ? (
                            // <>
                            //     <span className="text-gray-400 line-through">₹{product.regular_price}</span> 
                            //     <span className="font-bold text-lg">₹{product.selling_price}</span>
                            // </>
                            <>
                            <span className="text-gray-400 line-through">₹{parseFloat(parseFloat(product.regular_price) + (parseFloat(product.regular_price) * (parseFloat(product.gst_percentage)/100))).toFixed(0)}</span> 
                            <span className="font-bold text-lg">₹{parseFloat(parseFloat(product.selling_price) + (parseFloat(product.selling_price) * (parseFloat(product.gst_percentage)/100))).toFixed(0)}</span>
                        </>
                        ):(
                            <span className="font-bold text-lg">₹{totlePrice.toFixed(0)}</span>
                        )}
                        {/* <span className="text-gray-400 line-through">₹{product.regular_price}</span>
                        <span className="font-bold text-lg">₹{product.selling_price}</span> */}
                    </div>
                
                    {/* GST and BP Info */}
                    <div className="text-xs text-gray-500 space-y-1">
                        {/* <div>GST: {product.gst_percentage}%</div> */}
                        {product.bp_value > 0 && (
                            <div className="text-blue-600 font-medium">
                                BP Points: {product.bp_value}
                            </div>
                        )}
                    </div>
                
                    {/* Stock Info */}
                    <div className="text-sm">
                        {product.stock > 0 ? (
                            <span className="text-green-600">In Stock</span>
                        ) : (
                            <span className="text-red-600">Out of Stock</span>
                        )}
                    </div>
                </div>
                
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
                             transition-colors flex items-center justify-center gap-2 mt-4
                             disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

            </div>
        </div>
    );
};

export default ProductMlmCard;