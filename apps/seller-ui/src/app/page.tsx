"use client";
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import useSeller from '../hooks/useSeller';
import { Camera, Upload, Save, Edit3, MapPin, Globe, Calendar, Users, Package, Star, Clock, Plus, Trash2, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalFollowers: number;
}

const TABS = ["Products", "Offers", "Reviews"];

const SellerProfile = () => {
  const { seller, isLoading: sellerLoading } = useSeller();
  const queryClient = useQueryClient();
  
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'avatar' | 'banner' | null>(null);
  const [activeTab, setActiveTab] = useState("Products");
  
  // Form state
  const [formData, setFormData] = useState({
    shopName: '',
    bio: '',
    category: '',
    address: '',
    openingHours: '',
    website: '',
    phoneNumber: '',
    country: ''
  });

  // Initialize form data when seller data loads
  useEffect(() => {
    if (seller?.shop) {
      setFormData({
        shopName: seller.shop.name || '',
        bio: seller.shop.bio || '',
        category: seller.shop.category || '',
        address: seller.shop.address || '',
        openingHours: seller.shop.opening_hours || '',
        website: seller.shop.website || '',
        phoneNumber: seller.phone_number || '',
        country: seller.country || ''
      });
    }
  }, [seller]);

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['seller-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await axiosInstance.get('/seller/api/get-stats',{withCredentials:true});
      return response.data;
    },
    enabled: !!seller?.id
  });

  // Fetch seller products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const res = await axiosInstance.get(`/seller/api/get-seller-products/${seller?.id}?page=1&limit=20`);
      console.log('Products API response:', res.data);
      return res.data.products;
    },
    enabled: !!seller?.id,
    staleTime: 1000 * 60 * 5,
  });

  // Update shop mutation
  const updateShopMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.put('/seller/api/update-shop', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller'] });
      setIsEditing(false);
    }
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File, type: 'avatar' | 'banner' }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await axiosInstance.post('/seller/api/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller'] });
      setIsUploading(false);
      setUploadType(null);
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await axiosInstance.delete(`/api/products/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateShopMutation.mutate(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadType(type);
      uploadImageMutation.mutate({ file, type });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="animate-pulse">
          <div className="h-[250px] bg-gray-800"></div>
          <div className="w-[85%] lg:w-[70%] mx-auto -mt-20">
            <div className="h-32 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Banner Section */}
      <div className="relative w-full h-[250px] overflow-hidden">
        <Image
          src={seller?.shop?.coverBanner?.startsWith('http') ? seller.shop.coverBanner : (seller?.shop?.coverBanner || "https://res.cloudinary.com/duqrxy27h/image/upload/v1761315199/shop_banner_default_ttu4en.png")}
          alt="Seller Cover"
          className="w-full h-full object-cover"
          width={1200}
          height={250}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Upload Banner Button */}
        <div className="absolute top-4 left-4">
          <label className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Upload Banner
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'banner')}
              disabled={isUploading}
            />
          </label>
        </div>
        
        {/* Dashboard Navigation Button */}
        <div className="absolute top-4 right-4">
          <Link
            href="/dashboard"
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative -mt-20 z-10">
        <div className="w-[85%] lg:w-[70%] mx-auto flex flex-col lg:flex-row gap-6">
          {/* Main Info Card */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex-1 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative w-[100px] h-[100px] rounded-full border-4 border-gray-700 overflow-hidden shadow-lg">
                <Image
                  src={
                    seller?.shop?.avatar?.startsWith('http') ? seller.shop.avatar : (seller?.shop?.avatar || "https://res.cloudinary.com/duqrxy27h/image/upload/v1761315207/seller_default_zvuzfg.png")
                  }
                  alt="seller avatar"
                  width={100}
                  height={100}
                  className="object-cover"
                />
                
                {/* Upload Avatar Button */}
                <label className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full cursor-pointer transition-colors shadow-lg border-2 border-gray-700 z-10">
                  <Camera className="h-3 w-3" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                    disabled={isUploading}
                  />
                </label>
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-2xl font-semibold text-white">
                      {seller?.shop?.name || 'Your Shop'}
                    </h1>
                    <p className="text-gray-300 text-sm mt-1">
                      {seller?.shop?.bio || "No bio available."}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-blue-400 gap-1">
                    <Star fill="#60a5fa" size={18}/>{" "}
                    <span>{seller?.shop?.rating || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-300 gap-1">
                    <Users size={18}/> <span>{stats?.totalFollowers || 0} Followers</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 text-gray-300">
                  <Clock size={18}/>
                  <span>{seller?.shop?.opening_hours || "Mon -- Sat: 9AM - 6 PM"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin size={18}/>{" "}
                  <span>{seller?.shop?.address || "No address provided"}</span>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="mt-6 p-6 bg-gray-800 rounded-lg border border-gray-600">
                <h3 className="text-xl font-semibold text-white mb-4">Edit Shop Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Shop Name</label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="antiques">Antiques</option>
                      <option value="handicrafts">Handicrafts</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="textiles">Textiles</option>
                      <option value="pottery">Pottery</option>
                      <option value="art">Art</option>
                      <option value="furniture">Furniture</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Opening Hours</label>
                    <input
                      type="text"
                      name="openingHours"
                      value={formData.openingHours}
                      onChange={handleInputChange}
                      placeholder="e.g., 9 AM - 6 PM"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell customers about your shop..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateShopMutation.isPending}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {updateShopMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Upload Status */}
            {isUploading && (
              <div className="mt-4 p-4 bg-blue-900 bg-opacity-50 border border-blue-500 rounded-lg">
                <div className="flex items-center gap-2 text-blue-300">
                  <Upload className="h-4 w-4 animate-spin" />
                  Uploading {uploadType}...
                </div>
              </div>
            )}
          </div>

          {/* Shop Details Card */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full lg:w-[30%] border border-gray-700">
            <h2 className="text-xl font-semibold text-white">Shop Details</h2>

            <div className="flex items-center gap-3 mt-3 text-gray-300">
              <Calendar size={18}/>
              <span>
                Joined At: {new Date(seller?.createdAt || '').toLocaleDateString()}
              </span>
            </div>

            {seller?.shop?.website && (
              <div className="flex items-center gap-3 mt-3 text-gray-300">
                <Globe size={18}/>
                <Link
                  href={seller?.shop?.website}
                  className="hover:underline text-blue-400"
                >
                  {seller?.shop?.website}
                </Link>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-gray-300 text-lg font-medium mb-3">
                Quick Stats:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="font-medium">Products:</span>
                  <span>{stats?.totalProducts || 0}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="font-medium">Orders:</span>
                  <span>{stats?.totalOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="font-medium">Revenue:</span>
                  <span>₹{stats?.totalRevenue || 0}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="font-medium">Followers:</span>
                  <span>{stats?.totalFollowers || 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/dashboard/create-product"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-[85%] lg:w-[70%] mx-auto mt-8">
        <div className="flex border-b border-gray-600 bg-gray-900 rounded-t-lg">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-6 text-lg font-semibold rounded-t-lg ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400 bg-gray-800"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              } transition`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 rounded-b-lg shadow-sm border border-gray-700 border-t-0">
          {activeTab === "Products" && (
            <div className="p-6">
              {productsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[250px] bg-gray-700 animate-pulse rounded-lg"
                    >
                    </div>
                  ))}
                </div>
              )}
              {!productsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products?.map((product: any) => (
                    <div key={product.id} className="group bg-gray-800 rounded-lg border border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                      {/* Product Image */}
                      <div className="h-48 w-full relative overflow-hidden bg-gray-700">
                        <Image
                          src={product?.images?.[0]?.url?.[0] || "/product_fallback.jpg"}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {product.short_description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-green-400">
                            ₹{product.sale_price}
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/create-product?id=${product.id}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProductMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!productsLoading && products?.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No products available yet!</p>
                  <Link
                    href="/dashboard/create-product"
                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Add Your First Product
                  </Link>
                </div>
              )}
            </div>
          )}
          {activeTab === "Offers" && (
            <div className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No offers available yet!</p>
              </div>
            </div>
          )}
          {activeTab === "Reviews" && (
            <div className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No reviews available yet!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;