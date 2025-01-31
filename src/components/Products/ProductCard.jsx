
import { ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';

const ProductCard = ({product }) => {
    console.log('pp info' , product)
  return (
    <>  
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
            <Link href={`/product/${product.slug}`} >
            <img
                src={product.images[0].image}
                alt={product.name}
                className="w-full h-full object-cover"
            />
            </Link>
            </div>
            <div className="p-4">
            <div className="flex mb-2">
                {[...Array(product.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <Link href={`/product/${product.slug}`} >
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
            </Link>
            
            <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-400 line-through">₹{product.regular_price}</span>
                <span className="font-bold text-lg">₹{product.selling_price}</span>
            </div>
            <button
                onClick={() => console.log('id - ' .product )}
                // onClick={() => addToCart(product)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
            </button>
            </div>
        </div>
    </>
  )
}

export default ProductCard