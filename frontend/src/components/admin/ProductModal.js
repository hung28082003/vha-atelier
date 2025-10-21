import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createProduct, updateProduct } from '../../store/slices/adminSlice';
import { useDispatch } from 'react-redux';

const ProductModal = ({ isOpen, onClose, product = null, categories = [] }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      brand: '',
      sizes: [],
      colors: [],
      isActive: true,
      isFeatured: false,
      isOnSale: false,
      salePrice: '',
      tags: ''
    }
  });

  useEffect(() => {
    if (product) {
      setValue('name', product.name || '');
      setValue('description', product.description || '');
      setValue('price', product.price || '');
      setValue('stock', product.stock || '');
      setValue('category', product.category?._id || '');
      setValue('brand', product.brand || '');
      setValue('sizes', product.sizes || []);
      setValue('colors', product.colors || []);
      setValue('isActive', product.isActive !== false);
      setValue('isFeatured', product.isFeatured || false);
      setValue('isOnSale', product.isOnSale || false);
      setValue('salePrice', product.salePrice || '');
      setValue('tags', product.tags?.join(', ') || '');
      setSelectedImages(product.images || []);
    } else {
      reset();
      setSelectedImages([]);
    }
  }, [product, setValue, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const productData = {
        ...data,
        images: selectedImages,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null
      };

      if (product) {
        await dispatch(updateProduct({ productId: product._id, productData })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // TODO: Implement image upload to Cloudinary
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      alt: file.name
    }));
    setSelectedImages([...selectedImages, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm *
                </label>
                <input
                  {...register('name', { required: 'Tên sản phẩm là bắt buộc' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả sản phẩm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VNĐ) *
                  </label>
                  <input
                    {...register('price', { 
                      required: 'Giá là bắt buộc',
                      min: { value: 0, message: 'Giá phải lớn hơn 0' }
                    })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng *
                  </label>
                  <input
                    {...register('stock', { 
                      required: 'Số lượng là bắt buộc',
                      min: { value: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' }
                    })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    {...register('category', { required: 'Danh mục là bắt buộc' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    {Array.isArray(categories) && categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thương hiệu
                  </label>
                  <input
                    {...register('brand')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập thương hiệu"
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết sản phẩm</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích thước (phân cách bằng dấu phẩy)
                </label>
                <input
                  {...register('sizes')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="S, M, L, XL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc (phân cách bằng dấu phẩy)
                </label>
                <input
                  {...register('colors')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Đỏ, Xanh, Trắng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  {...register('tags')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="thời trang, cao cấp, mùa hè"
                />
              </div>

              {/* Sale Settings */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    {...register('isOnSale')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Đang giảm giá
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá giảm (VNĐ)
                  </label>
                  <input
                    {...register('salePrice')}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Status Settings */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Sản phẩm hoạt động
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('isFeatured')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Sản phẩm nổi bật
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh sản phẩm</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-gray-600">Nhấp để tải lên hình ảnh</span>
              </label>
            </div>

            {/* Selected Images */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang lưu...' : (product ? 'Cập nhật' : 'Tạo sản phẩm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;


