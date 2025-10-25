import { ArrowUpRight, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ShopCardProps {
  shop: {
    id: string;
    name: string;
    description?: string;
    avatar: string;
    coverBanner?: string;
    address?: string;
    followers?: [];
    rating?: number;
    category?: string;
  };
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <div className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Cover Banner */}
      <div className="h-32 w-full relative overflow-hidden bg-gray-100">
        <Image
          src={shop?.coverBanner || "/store_banner_fallback.jpg"}
          alt="cover"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Avatar */}
      <div className="relative flex justify-center -mt-8 mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
          <Image
            src={shop.avatar || "/store_fallback.png"}
            alt={shop.name}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {shop?.name}
        </h3>
        
        <p className="text-sm text-gray-500 mb-3">
          {shop?.followers?.length ?? 0} followers
        </p>

        {/* Location and Rating */}
        <div className="flex items-center justify-center gap-4 mb-3 text-sm text-gray-600">
          {shop.address && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[120px]">{shop.address}</span>
            </span>
          )}

          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            {shop.rating ?? "N/A"}
          </span>
        </div>

        {/* Category */}
        {shop.category && (
          <div className="mb-4">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {shop.category}
            </span>
          </div>
        )}

        {/* Visit Shop Button */}
        <Link
          href={`/shop/${shop.id}`}
          className="inline-flex items-center justify-center w-full bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Visit Shop
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;
