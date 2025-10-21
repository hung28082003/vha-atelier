import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CubeIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { 
  getDashboardStats,
  getUsers,
  getProducts,
  getOrders,
  getSystemSettings,
  updateUser,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus
} from '../store/slices/adminSlice';
import ProductModal from '../components/admin/ProductModal';
import UserModal from '../components/admin/UserModal';
import OrderModal from '../components/admin/OrderModal';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { 
    dashboardStats, 
    users, 
    products, 
    orders, 
    systemSettings,
    loading 
  } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal states
  const [productModal, setProductModal] = useState({ isOpen: false, product: null });
  const [userModal, setUserModal] = useState({ isOpen: false, user: null });
  const [orderModal, setOrderModal] = useState({ isOpen: false, order: null });
  const [categories, setCategories] = useState([]);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      toast.error('Bạn không có quyền truy cập trang này');
    }
  }, [user, navigate]);

  // Load data when component mounts
  useEffect(() => {
    if (user && user.role === 'admin') {
      dispatch(getDashboardStats());
      dispatch(getSystemSettings());
    }
  }, [dispatch, user]);

  // Load data when tab changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      switch (activeTab) {
        case 'users':
          dispatch(getUsers({ page: 1, limit: 10 }));
          break;
        case 'products':
          dispatch(getProducts({ page: 1, limit: 10 }));
          break;
        case 'orders':
          dispatch(getOrders({ page: 1, limit: 10 }));
          break;
        default:
          break;
      }
    }
  }, [dispatch, user, activeTab]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
    navigate('/');
  };

  // Product handlers
  const handleCreateProduct = () => {
    setProductModal({ isOpen: true, product: null });
  };

  const handleEditProduct = (product) => {
    setProductModal({ isOpen: true, product });
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success('Xóa sản phẩm thành công!');
      } catch (error) {
        toast.error('Lỗi khi xóa sản phẩm');
      }
    }
  };

  // User handlers
  const handleEditUser = (user) => {
    setUserModal({ isOpen: true, user });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success('Xóa người dùng thành công!');
      } catch (error) {
        toast.error('Lỗi khi xóa người dùng');
      }
    }
  };

  // Order handlers
  const handleViewOrder = (order) => {
    setOrderModal({ isOpen: true, order });
  };

  const adminTabs = [
    {
      id: 'dashboard',
      name: 'Tổng quan',
      icon: ChartBarIcon,
      description: 'Thống kê và báo cáo tổng quan'
    },
    {
      id: 'users',
      name: 'Quản lý người dùng',
      icon: UserGroupIcon,
      description: 'Quản lý tài khoản người dùng'
    },
    {
      id: 'products',
      name: 'Quản lý sản phẩm',
      icon: CubeIcon,
      description: 'Thêm, sửa, xóa sản phẩm'
    },
    {
      id: 'orders',
      name: 'Quản lý đơn hàng',
      icon: ShoppingBagIcon,
      description: 'Xử lý và theo dõi đơn hàng'
    },
    {
      id: 'chatbot',
      name: 'Quản lý Chatbot',
      icon: ChatBubbleLeftRightIcon,
      description: 'Cấu hình AI chatbot'
    },
    {
      id: 'settings',
      name: 'Cài đặt hệ thống',
      icon: CogIcon,
      description: 'Cấu hình hệ thống'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab dashboardStats={dashboardStats} loading={loading.dashboard} />;
      case 'users':
        return (
          <UsersTab 
            users={users} 
            loading={loading.users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'products':
        return (
          <ProductsTab 
            products={products} 
            loading={loading.products}
            onCreateProduct={handleCreateProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'orders':
        return (
          <OrdersTab 
            orders={orders} 
            loading={loading.orders}
            onViewOrder={handleViewOrder}
          />
        );
      case 'chatbot':
        return <ChatbotTab />;
      case 'settings':
        return <SettingsTab systemSettings={systemSettings} loading={loading.settings} />;
      default:
        return <DashboardTab dashboardStats={dashboardStats} loading={loading.dashboard} />;
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-2">
                {adminTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{tab.name}</div>
                        <div className="text-sm opacity-75">{tab.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {renderTabContent()}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={productModal.isOpen}
        onClose={() => setProductModal({ isOpen: false, product: null })}
        product={productModal.product}
        categories={categories}
      />

      <UserModal
        isOpen={userModal.isOpen}
        onClose={() => setUserModal({ isOpen: false, user: null })}
        user={userModal.user}
      />

      <OrderModal
        isOpen={orderModal.isOpen}
        onClose={() => setOrderModal({ isOpen: false, order: null })}
        order={orderModal.order}
      />
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ dashboardStats, loading }) => {

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: dashboardStats.totalUsers.toLocaleString(),
      icon: UserGroupIcon,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Tổng sản phẩm',
      value: dashboardStats.totalProducts.toLocaleString(),
      icon: CubeIcon,
      color: 'green',
      change: '+5%'
    },
    {
      title: 'Tổng đơn hàng',
      value: dashboardStats.totalOrders.toLocaleString(),
      icon: ShoppingBagIcon,
      color: 'purple',
      change: '+8%'
    },
    {
      title: 'Doanh thu',
      value: `${dashboardStats.totalRevenue.toLocaleString()}đ`,
      icon: ChartBarIcon,
      color: 'orange',
      change: '+15%'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan hệ thống</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change} so với tháng trước</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Orders */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardStats.recentOrders?.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.totalAmount?.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status === 'pending' ? 'Chờ xử lý' :
                           order.status === 'shipped' ? 'Đang giao' : 'Đã giao'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Users Tab Component
const UsersTab = ({ users, loading, onEditUser, onDeleteUser }) => {

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Thêm người dùng
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-16 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <PencilIcon className="h-4 w-4 inline mr-1" />
                      Sửa
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4 inline mr-1" />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Products Tab Component
const ProductsTab = ({ products, loading, onCreateProduct, onEditProduct, onDeleteProduct }) => {

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
        <button 
          onClick={onCreateProduct}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-16 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price?.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <PencilIcon className="h-4 w-4 inline mr-1" />
                      Sửa
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4 inline mr-1" />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Orders Tab Component
const OrdersTab = ({ orders, loading, onViewOrder }) => {

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quản lý đơn hàng</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-16 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.totalAmount?.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status === 'pending' ? 'Chờ xử lý' :
                       order.status === 'shipped' ? 'Đang giao' : 'Đã giao'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <EyeIcon className="h-4 w-4 inline mr-1" />
                      Xem
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <PencilIcon className="h-4 w-4 inline mr-1" />
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Chatbot Tab Component
const ChatbotTab = () => {
  const [chatbotConfig, setChatbotConfig] = useState({
    isEnabled: true,
    welcomeMessage: 'Xin chào! Tôi có thể giúp gì cho bạn?',
    responseDelay: 1000
  });

  const handleConfigChange = (key, value) => {
    setChatbotConfig({ ...chatbotConfig, [key]: value });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quản lý Chatbot</h2>
      
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cấu hình cơ bản</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Bật Chatbot</div>
                <div className="text-sm text-gray-500">Kích hoạt AI chatbot trên website</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={chatbotConfig.isEnabled}
                  onChange={(e) => handleConfigChange('isEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tin nhắn chào mừng
              </label>
              <textarea
                value={chatbotConfig.welcomeMessage}
                onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ trễ phản hồi (ms)
              </label>
              <input
                type="number"
                value={chatbotConfig.responseDelay}
                onChange={(e) => handleConfigChange('responseDelay', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Lưu cấu hình
            </button>
            <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
              Đặt lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ systemSettings, loading }) => {
  const [settings, setSettings] = useState(systemSettings);

  useEffect(() => {
    setSettings(systemSettings);
  }, [systemSettings]);

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt hệ thống</h2>
      
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin website</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên website
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả website
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt chung</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Chế độ bảo trì</div>
                <div className="text-sm text-gray-500">Tạm thời đóng website để bảo trì</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Cho phép đăng ký</div>
                <div className="text-sm text-gray-500">Cho phép người dùng đăng ký tài khoản mới</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Lưu cài đặt
          </button>
          <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
