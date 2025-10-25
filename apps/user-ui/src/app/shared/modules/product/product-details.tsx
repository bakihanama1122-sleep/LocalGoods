"use client";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageSquareText,
  Package,
  Shield,
  Star,
  Plus,
  Minus,
  Truck,
  Clock,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "react-inner-image-zoom/lib/styles.min.css";
import Ratings from "../../components/ratings";
import Link from "next/link";
import { useStore } from "apps/user-ui/src/store";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useDeviceTracking from "apps/user-ui/src/hooks/DeviceTracking";
import useUser from "apps/user-ui/src/hooks/useUser";
import ProductCard from "../../components/cards/product-card";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import InnerImageZoom from "react-inner-image-zoom";
import { isProtected } from "apps/user-ui/src/utils/protected";
import { useRouter } from "next/navigation";

const ProductDetails = ({ productDetails }: { productDetails: any }) => {
  const [currentImage, setCurrentImage] = useState(
    productDetails?.images[0]?.url[0]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isSelected, setIsSelected] = useState(
    productDetails?.colors?.[0] || ""
  );

  const [isSizeSelected, setIsSizeSelected] = useState(
    productDetails?.colors?.[0] || ""
  );

  const [quantity, setQuantity] = useState(1);
  const [priceRange, setPriceRange] = useState([
    productDetails?.sale_price,
    30000,
  ]);

  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const addToCart = useStore((state: any) => state.addToCart);
  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item.id === productDetails.id);
  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some(
    (item: any) => item.id === productDetails.id
  );

  const { user, isLoading } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
    const [isConvoLoading,setIsLoading] = useState(false);
  
const router = useRouter();
  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImage(productDetails?.images[currentIndex - 1]);
    }
  };
  const nextImage = () => {
    if (currentIndex < productDetails?.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImage(productDetails?.images[currentIndex + 1]);
    }
  };

  const discountPercentage = Math.round(
    ((productDetails.regular_price - productDetails.sale_price) /
      productDetails.regular_price) *
      100
  );

  const fetchFilteredProducts = async () => {
    try {
      const query = new URLSearchParams();
      query.set("priceRange", priceRange.join(","));
      query.set("page", "1");
      query.set("limit", "5");

      const res = await axiosInstance.get(
        `/product/api/get-filtered-products?${query.toString()}`
      );
      setRecommendedProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [priceRange]);

  const handleChat = async()=>{
    if(isConvoLoading){
      return;
    }

    setIsLoading(true);

    try {
        const res = await axiosInstance.post("/chatting/api/create-user-conversationGroup",{sellerId:productDetails?.Shop?.sellerId},
          isProtected
        );
        router.push(`/inbox/conversationId=${res.data.conversation.id}`);
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href={"/"} className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={`/shop/${productDetails?.Shop?.id}`} className="hover:text-gray-900 transition-colors">
              {productDetails?.Shop?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{productDetails?.title}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white rounded-lg border border-gray-200 overflow-hidden">
              <InnerImageZoom
                src={currentImage || '/placeholder-image.jpg'}
                zoomSrc={currentImage || '/placeholder-image.jpg'}
                zoomType="hover"
                zoomPreload
                moveType="drag"
                className="w-full h-full object-contain"
                fullscreenOnMobile={true}
              />
            </div>
            
            {/* Thumbnail Images */}
            {productDetails?.images && productDetails.images.length > 1 && (
              <div className="relative">
                {productDetails.images.length > 4 && (
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    onClick={prevImage}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}
                <div className="flex gap-2 overflow-x-auto px-8">
                  {productDetails.images.map((img: any, index: number) => (
                    img?.url && (
                      <button
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden transition-all ${
                          currentIndex === index
                            ? "border-gray-500 ring-2 ring-gray-300"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setCurrentIndex(index);
                          setCurrentImage(img?.url?.[0] || img?.url);
                        }}
                      >
                        <Image
                          src={img?.url?.[0] || img?.url || '/placeholder-image.jpg'}
                          alt={`Thumbnail ${index}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                      </button>
                    )
                  ))}
                </div>
                {productDetails.images.length > 4 && (
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    onClick={nextImage}
                    disabled={currentIndex === productDetails.images.length - 1}
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{productDetails?.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Ratings rating={productDetails?.rating || 0} />
                  <span className="text-sm text-gray-600">(0 Reviews)</span>
                </div>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    isWishlisted
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                  onClick={() =>
                    isWishlisted
                      ? removeFromWishlist(productDetails.id, user, location, deviceInfo)
                      : addToWishlist(
                          {
                            ...productDetails,
                            quantity,
                            selectedOptions: {
                              color: isSelected,
                              size: isSizeSelected,
                            },
                          },
                          user,
                          location,
                          deviceInfo
                        )
                  }
                >
                  <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
              {productDetails?.brand && (
                <p className="text-gray-600">
                  <span className="font-medium">Brand:</span> {productDetails.brand}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{productDetails?.sale_price?.toFixed(2) || '0.00'}
                </span>
                {productDetails?.regular_price && productDetails.regular_price > productDetails.sale_price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{productDetails.regular_price.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {productDetails?.colors && productDetails.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {productDetails.colors.map((color: string, index: number) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        isSelected === color
                          ? "border-gray-600 scale-110 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => setIsSelected(color)}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {productDetails?.sizes && productDetails.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {productDetails.sizes.map((size: string, index: number) => (
                    <button
                      key={index}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                        isSizeSelected === size
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => setIsSizeSelected(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    className="p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    className="p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {productDetails?.stock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle size={16} className="mr-1" />
                    In Stock ({productDetails.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <button
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 font-medium rounded-lg transition-colors ${
                  isInCart || productDetails?.stock === 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                disabled={isInCart || productDetails?.stock === 0}
                onClick={() =>
                  addToCart(
                    {
                      ...productDetails,
                      quantity,
                      selectedOptions: {
                        color: isSelected,
                        size: isSizeSelected,
                      },
                    },
                    user,
                    location,
                    deviceInfo
                  )
                }
              >
                <ShoppingCart size={18} />
                {isInCart ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>

            {/* Shop Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={productDetails?.Shop?.avatar || '/placeholder-avatar.jpg'}
                    alt="Shop Logo"
                    width={48}
                    height={48}
                    className="rounded-full w-12 h-12 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-avatar.jpg';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{productDetails?.Shop?.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{location?.city}, {location?.country}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  onClick={() => handleChat()}
                  disabled={isConvoLoading}
                >
                  <MessageSquareText size={16} />
                  {isConvoLoading ? 'Loading...' : 'Chat Now'}
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Positive Ratings</p>
                  <p className="text-lg font-semibold text-green-600">88%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Ship on Time</p>
                  <p className="text-lg font-semibold text-blue-600">100%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Response Rate</p>
                  <p className="text-lg font-semibold text-purple-600">100%</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href={`/shop/${productDetails?.Shop?.id}`}
                  className="text-blue-600 font-medium text-sm hover:underline"
                >
                  Visit Store →
                </Link>
              </div>
            </div>

            {/* Delivery & Return Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={16} className="text-green-600" />
                <span>Free delivery on orders over ₹500</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Package size={16} className="text-blue-600" />
                <span>7 days return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield size={16} className="text-purple-600" />
                <span>Secure payment guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{
              __html: productDetails?.detailed_description,
            }}
          />
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
          <div className="text-center py-12">
            <Star size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reviews available yet!</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to review this product</p>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendedProducts?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
