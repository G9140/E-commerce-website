import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { toast } from '../components/ui/Toaster';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (increment: number) => {
    const newQuantity = quantity + increment;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        stock: product.stock,
      });
    }

    toast.success(`${quantity} ${product.title}${quantity > 1 ? 's' : ''} added to cart!`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Mock additional images (in a real app, this would come from the product data)
  const productImages = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={productImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    } transition-colors duration-200`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-4xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {product.stock > 0 ? (
                        <span className="text-green-600">
                          {product.stock} in stock
                        </span>
                      ) : (
                        <span className="text-red-600">Out of stock</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-gray-900 font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    (Max: {product.stock})
                  </span>
                </div>

                {/* Add to Cart Button */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || !user}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>
                      {!user
                        ? 'Login to Add to Cart'
                        : product.stock <= 0
                        ? 'Out of Stock'
                        : 'Add to Cart'}
                    </span>
                  </button>

                  {!user && (
                    <p className="text-sm text-gray-500 text-center">
                      <button
                        onClick={() => navigate('/login')}
                        className="text-blue-600 hover:underline"
                      >
                        Login
                      </button>{' '}
                      or{' '}
                      <button
                        onClick={() => navigate('/signup')}
                        className="text-blue-600 hover:underline"
                      >
                        create an account
                      </button>{' '}
                      to purchase this item
                    </p>
                  )}
                </div>
              </div>

              {/* Product Features */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Features
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    High-quality materials and construction
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Backed by manufacturer warranty
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Fast and reliable shipping
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    30-day return policy
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;