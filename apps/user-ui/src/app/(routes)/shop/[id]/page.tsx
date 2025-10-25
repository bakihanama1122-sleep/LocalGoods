import axiosInstance from 'apps/user-ui/src/utils/axiosInstance'
import { Metadata } from 'next';
import React from 'react'
import SellerProfile from '../../../shared/modules/seller/seller-profile';

async function fetchShopDetails(id:string) {
    try {
        const response = await axiosInstance.get(`/seller/api/get-shop/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching shop details:', error);
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        
        // Return a fallback structure
        return {
            success: false,
            shop: null,
            seller: null,
            followersCount: 0,
            error: error.response?.data?.message || 'Failed to fetch shop details'
        };
    }
}

export async function generateMetaData  ({
    params
}:{
    params: Promise<{id:string}>;
}):Promise<Metadata> {
    try {
        const { id } = await params;
        const data = await fetchShopDetails(id);
        return {
            title:`${data?.shop?.name}` || `LocalGoods Marketplace`,
            description : data?.shop?.bio || "Explore shops on LocalGoods.",
            openGraph:{
                title: `${data?.shop?.name}` || `LocalGoods Marketplace`,
                description: data?.shop?.bio || "Explore shops on LocalGoods.",
                type:"website",
                images:[
                    {
                        url:data?.shop?.avatar || "/store_fallback.png",
                        width:800,
                        height:600,
                        alt:data?.shop?.name || "Shop Logo"
                    }
                ]
            },
            twitter:{
                card:"summary_large_image",
                title:`${data?.shop?.name}` || "LocalGoods Marketplace",
                description:
                    data?.shop?.bio || "Explore shops on LocalGoods.",
                images:[data?.shop?.avatar || "/store_fallback.png"],
            }
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: "LocalGoods Marketplace",
            description: "Explore shops on LocalGoods.",
        }
    }
}

const page = async ({params}:{params: Promise<{id:string}>}) => {
  const { id } = await params;
  const data = await fetchShopDetails(id);
  
  if (!data.success || !data.shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop Not Found</h1>
          <p className="text-gray-600 mb-4">
            {data.error || "The shop you're looking for doesn't exist or is no longer available."}
          </p>
          <a 
            href="/shops" 
            className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Browse All Shops
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div>
        <SellerProfile shop={data?.shop} seller={data?.seller} followersCount={data?.followersCount} />
    </div>
  )
}

export default page