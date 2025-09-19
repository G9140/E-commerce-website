import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Shield, Package, CheckCircle } from 'lucide-react';
import { toast } from '../components/ui/Toaster';

// Mock order data - in a real app, this would come from your backend
const mockOrders = [
  {
    id: '1001',
    date: '2024-01-15',
    status: 'delivered',
    total: 149.97,
    items: [
      { title: 'Wireless Bluetooth Headphones', quantity: 1, price: 199.99 },
      { title: 'Organic Cotton T-Shirt', quantity: 2, price: 29.99 },
    ],
  },
  {
    id: '1002',
    date: '2024-01-10',
    status: 'shipped',
    total: 299.99,
    items: [
      { title: 'Smart Fitness Watch', quantity: 1, price: 299.99 },
    ],
  },
  {
    id: '1003',
    date: '2024-01-05',
    status: 'processing',
    total: 269.98,
    items: [
      { title: 'Leather Laptop Bag', quantity: 1, price: 149.99 },
      { title: 'Running Shoes', quantity: 1, price: 119.99 },
    ],
  },
];

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [orders] = useState(mockOrders);

  // Show success message if redirected from checkout
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Package className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h2>
                <div className="flex items-center justify-center space-x-2">
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Member Since</p>
                    <p className="text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 mb-3">
                  Edit Profile
                </button>
                <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-gray-600">
                    Your order history will appear here once you make your first purchase.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-t border-gray-100 first:border-t-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div className="flex space-x-3">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                            View Details
                          </button>
                          {order.status === 'delivered' && (
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200">
                              Leave Review
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200">
                              Cancel Order
                            </button>
                          )}
                        </div>
                        {(order.status === 'delivered' || order.status === 'shipped') && (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;