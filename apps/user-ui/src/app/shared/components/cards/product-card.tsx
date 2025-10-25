import { Eye, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Ratings from "../ratings";
import ProductDetailsCard from "./product-details.card";
import { useStore } from "apps/user-ui/src/store";
import useUser from "apps/user-ui/src/hooks/useUser";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useDeviceTracking from "apps/user-ui/src/hooks/DeviceTracking";

const ProductCard = ({
  product,
  isEvent,
}: {
  product: any;
  isEvent?: boolean;
}) => {
    const [timeLeft,setTimeLeft] = useState("");
    const [open,setOpen] = useState(false);
    const {user} = useUser();
    const location = useLocationTracking();
    const deviceInfo = useDeviceTracking();
    const addToCart = useStore((state:any)=>state.addToCart);
    const addToWishlist = useStore((state:any)=>state.addToWishlist);
    const removeFromWishlist = useStore((state:any)=>state.removeFromWishlist);
    const wishlist = useStore((state:any)=>state.wishlist);
    const isWishlisted = wishlist.some((item:any)=>item.id === product.id);
    const cart = useStore((state:any)=>state.cart);
    const isInCart = cart.some((item:any)=> item.id === product.id);

    useEffect(()=>{
        if(isEvent && product?.ending_date){
            const interval = setInterval(()=>{
                const endTime = new Date(product.ending_date).getTime();
                const now = Date.now();
                const diff = endTime - now;

                if(diff <= 0){
                    setTimeLeft("Expired");
                }else{
                    const days = Math.floor(diff/(1000*60*60*24));
                    const hours = Math.floor((diff/(1000*60*60))%24);
                    const minutes = Math.floor((diff/(1000*60))%60);
                    setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price.`)
                }
            }, 1000);
            
            return () => clearInterval(interval);
        }
        return undefined;
    }, [isEvent, product?.ending_date])

  return (
    <div className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Badges */}
        {isEvent && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              OFFER
            </span>
          </div>
        )}
        {product?.stock <= 5 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-md">
              Limited Stock
            </span>
          </div>
        )}

        {/* Product Image */}
        <Link href={`product/${product?.slug}`}>
          <img
            src={product?.images?.[0]?.url[0] || "product_fallback.jpg"}
            alt={product?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white hover:shadow-md transition-all"
            onClick={() =>
              isWishlisted
                ? removeFromWishlist(product.id, user, location, deviceInfo)
                : addToWishlist({ ...product, quantity: 1 }, user, location, deviceInfo)
            }
          >
            <Heart
              size={16}
              fill={isWishlisted ? "red" : "transparent"}
              stroke={isWishlisted ? "red" : "#6b7280"}
              className="transition-colors"
            />
          </button>
          <button
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white hover:shadow-md transition-all"
            onClick={() => setOpen(!open)}
          >
            <Eye size={16} className="text-gray-600" />
          </button>
          <button
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white hover:shadow-md transition-all"
            onClick={() =>
              !isInCart &&
              addToCart({ ...product, quantity: 1 }, user, location, deviceInfo)
            }
          >
            <ShoppingBag size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Shop Name */}
        <Link
          href={`/shop/${product?.Shop?.id}`}
          className="text-sm text-amber-600 hover:text-amber-700 font-medium mb-2 block"
        >
          {product?.Shop?.name || "Shop name"}
        </Link>

        {/* Product Title */}
        <Link href={`/product/${product?.slug}`}>
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
            {product?.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <Ratings rating={product?.ratings} />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product?.sale_price}
            </span>
            {product?.regular_price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product?.regular_price}
              </span>
            )}
          </div>
          <span className="text-sm text-green-600 font-medium">
            {product.totalsales || 0} sold
          </span>
        </div>

        {/* Event Timer */}
        {isEvent && timeLeft && (
          <div className="mt-2">
            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-md">
              {timeLeft}
            </span>
          </div>
        )}
      </div>

      {/* Render modal outside the button container to avoid z-index conflicts */}
      {open && <ProductDetailsCard data={product} setOpen={setOpen} />}
    </div>
  );
};

export default ProductCard;
