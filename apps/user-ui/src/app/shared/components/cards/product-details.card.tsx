import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Ratings from "../ratings";
import { ShoppingCart, Heart, MapPin, X, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "apps/user-ui/src/store";
import useUser from "apps/user-ui/src/hooks/useUser";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useDeviceTracking from "apps/user-ui/src/hooks/DeviceTracking";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { isProtected } from "apps/user-ui/src/utils/protected";

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sales?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isLoading,setIsLoading] = useState(false);

  const addToCart = useStore((state:any)=>state.addToCart);
  const cart = useStore((state:any)=>state.cart);
  const isInCart = cart.some((item:any)=>item.id===data.id);
  const addToWishlist = useStore((state:any)=>state.addToWishlist);
  const removeFromWishlist = useStore((state:any)=>state.removeFromWishlist);
  const wishlist = useStore((state:any)=>state.wishlist);
  const isWishlisted = wishlist.some((item:any)=>item.id === data.id)
  const {user} = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();


  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate()+5);

  const handleChat = async()=>{
    if(isLoading){
      return;
    }

    setIsLoading(true);

    try {
        const res = await axiosInstance.post("/chatting/api/create-user-conversationGroup",{sellerId:data?.Shop?.sellerId},
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
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 p-6">
            <div className="aspect-square relative mb-4">
              <Image
                src={data?.images?.[activeImage]?.url?.[0] || data?.images?.[activeImage]?.url || '/placeholder-image.jpg'}
                alt={data?.title || 'Product image'}
                fill
                className="object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </div>
            
            {/* Thumbnail Images */}
            {data?.images && data.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {data.images.map((img: any, index: number) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden transition-all ${
                      activeImage === index
                        ? "border-gray-500 ring-2 ring-gray-300"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveImage(index)}
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
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="w-full lg:w-1/2 p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
            {/* Shop Info */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <Image
                src={data?.Shop?.avatar || '/placeholder-avatar.jpg'}
                alt="Shop Logo"
                width={60}
                height={60}
                className="rounded-full w-15 h-15 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-avatar.jpg';
                }}
              />
              <div className="flex-1">
                <Link
                  href={`/shop/${data?.Shop?.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-gray-700"
                >
                  {data?.Shop?.name || 'Shop Name'}
                </Link>
                <div className="mt-1">
                  <Ratings rating={data?.Shop?.ratings || 0} />
                </div>
                <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                  <MapPin size={16} />
                  {data?.Shop?.address || "Location Not Available"}
                </p>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={() => handleChat()}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Chat with Seller'}
              </button>
            </div>

            {/* Product Title and Description */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{data?.title}</h1>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">
              {data?.short_description}
            </p>

            {/* Brand */}
            {data?.brand && (
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Brand:</span> {data.brand}
              </p>
            )}

            {/* Color Selection */}
            {data?.colors && data.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {data.colors.map((color: string, index: number) => (
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
            {data?.sizes && data.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {data.sizes.map((size: string, index: number) => (
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

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{data?.sale_price?.toFixed(2) || '0.00'}
                </span>
                {data?.regular_price && data.regular_price > data.sale_price && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{data.regular_price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
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
                
                <button
                  className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${
                    isInCart
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                  disabled={isInCart}
                  onClick={() =>
                    addToCart(
                      {
                        ...data,
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
                
                <button
                  className={`p-3 rounded-lg transition-colors ${
                    isWishlisted
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                  onClick={() =>
                    isWishlisted
                      ? removeFromWishlist(data.id, user, location, deviceInfo)
                      : addToWishlist(
                          {
                            ...data,
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
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {data.stock > 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  In Stock ({data.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Delivery Info */}
            <div className="text-gray-600 text-sm">
              <p>
                <span className="font-medium">Estimated Delivery:</span>{" "}
                {estimatedDelivery.toDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
