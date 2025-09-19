import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  created_at: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    stock: 50,
    rating: 4.5,
    reviews: 128,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes.',
    price: 29.99,
    category: 'Clothing',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    stock: 100,
    rating: 4.3,
    reviews: 89,
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone connectivity.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg',
    stock: 30,
    rating: 4.7,
    reviews: 203,
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    title: 'Leather Laptop Bag',
    description: 'Professional leather laptop bag with multiple compartments and ergonomic design.',
    price: 149.99,
    category: 'Accessories',
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg',
    stock: 25,
    rating: 4.4,
    reviews: 67,
    created_at: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    title: 'Coffee Maker Pro',
    description: 'Professional-grade coffee maker with programmable settings and thermal carafe.',
    price: 179.99,
    category: 'Home & Kitchen',
    image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg',
    stock: 40,
    rating: 4.6,
    reviews: 156,
    created_at: '2024-01-05T00:00:00Z',
  },
  {
    id: '6',
    title: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper.',
    price: 119.99,
    category: 'Sports',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    stock: 75,
    rating: 4.2,
    reviews: 94,
    created_at: '2024-01-06T00:00:00Z',
  },
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };

  const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newProduct: Product = {
        ...productData,
        id: (products.length + 1).toString(),
        created_at: new Date().toISOString(),
      };

      setProducts(currentProducts => [...currentProducts, newProduct]);
      return true;
    } catch (err) {
      setError('Failed to add product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    loading,
    error,
    getProductById,
    getProductsByCategory,
    searchProducts,
    addProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};