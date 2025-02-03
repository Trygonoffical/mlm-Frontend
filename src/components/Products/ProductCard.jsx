'use client'

import { ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/redux/slices/cartSlice';
import Image from 'next/image';

const ProductCard = ({ product , style}) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        // Calculate prices as numbers to ensure proper calculations
        const sellingPrice = parseFloat(product.selling_price);
        const gstPercentage = parseFloat(product.gst_percentage);
        const gstAmount = (sellingPrice * gstPercentage) / 100;
        const totalPrice = sellingPrice + gstAmount;

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
            selectedAttributes: {} // For future use if needed
        };

        dispatch(addItemToCart(cartItem));
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" style={style}>
            <div className="aspect-square relative">
                <Link href={`/product/${product.slug}`}>
                    <Image
                        src={product.images[0].image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                    />
                </Link>
            </div>
            <div className="p-4">
                <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                </Link>

                <div className="space-y-2">
                    {/* Price Display */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through">₹{product.regular_price}</span>
                        <span className="font-bold text-lg">₹{product.selling_price}</span>
                    </div>

                    {/* GST and BP Info */}
                    <div className="text-xs text-gray-500 space-y-1">
                        <div>GST: {product.gst_percentage}%</div>
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

export default ProductCard;