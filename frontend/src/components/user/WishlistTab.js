import React, { useState, useEffect } from 'react';
import { HeartIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const WishlistTab = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist);
    }
    setLoading(false);
  }, [user]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      // TODO: Implement remove from wishlist API
      setWishlist(wishlist.filter(item => item._id !== productId));
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      toast.error('Lỗi khi xóa khỏi danh sách yêu thích');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      dispatch(addToCart({
        product: product._id,
        quantity: 1,
        size: product.sizes?.[0]?.size || 'M',
        color: product.colors?.[0]?.name || 'Default'
      }));
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error) {
      toast.error('Lỗi khi thêm vào giỏ hàng');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Danh sách yêu thích trống</h3>
        <p className="mt-1 text-sm text-gray-500">
          Bạn chưa có sản phẩm nào trong danh sách yêu thích.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Danh sách yêu thích ({wishlist.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-1 aspect-h-1 bg-gray-200">
              <img
                src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price?.toLocaleString()}đ
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice.toLocaleString()}đ
                    </span>
                  )}
                </div>
                {product.isOnSale && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    Sale
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="text-sm">Xóa</span>
                </button>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span className="text-sm">Thêm vào giỏ</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WishlistTab;
