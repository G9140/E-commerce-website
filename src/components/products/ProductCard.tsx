import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Product } from '../../contexts/ProductContext';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { toast } from '../ui/Toaster';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });

    toast.success(`${product.title} added to cart!`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
            <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-6 w-6" />
          </div>
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {product.title}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews})
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              <span className="text-sm text-gray-500">
                {product.stock} in stock
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || !user}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              title={!user ? 'Login to add to cart' : 'Add to cart'}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;