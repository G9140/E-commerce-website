import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from '../components/ui/Toaster';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      toast.info('Item removed from cart');
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string, title: string) => {
    removeFromCart(id);
    toast.info(`${title} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.info('Cart cleared');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-8" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center">
                <div className="flex-shrink-0 mb-4 sm:mb-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 sm:ml-6 text-center sm:text-left mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xl font-bold text-gray-900">
                    ${item.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.stock} available
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-gray-900 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id, item.title)}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                    title="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">
                Total ({items.reduce((sum, item) => sum + item.quantity, 0)} items):
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-300 transition-colors duration-200"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;