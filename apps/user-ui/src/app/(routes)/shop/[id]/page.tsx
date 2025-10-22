import axiosInstance from 'apps/user-ui/src/utils/axiosInstance'
import { Metadata } from 'next';
import React from 'react'
import SellerProfile from '../../../shared/modules/seller/seller-profile';

async function fetchSellerDetails(id:string) {
    const response = await axiosInstance.get(`/seller/api/get-seller/${id}`);
    return response.data;
}

export async function generateMetaData  ({
    params
}:{
    params:{id:string};
}):Promise<Metadata> {
    const data = await fetchSellerDetails(params.id);
    return {
        title:`${data?.shop?.name}` || `LocalGoods Marketplace`,
        description : data?.shop?.bio || "Explore shops on LocalGoods.",
        openGraph:{
            title: `${data?.shop?.name}` || `LocalGoods Marketplace`,
            description: data?.shop?.bio || "Explore shops on LocalGoods.",
            type:"website",
            images:[
                {
                    url:data?.shop?.avatar || "store_fallback.png",
                    width:800,
                    height:600,
                    alt:data?.shop?.name || "Shop Logo"
                }
            ]
        },
        twitter:{
            card:"summary_large_image",
            title:`${data?.shop?.name}` || "Eshop Marketplace",
            description:
                data?.shop?.bio || "Explore shops on LocalGoods.",
            images:[data?.shop?.avatar || "store_fallback.png"],
        }
    }
}

const page =async ({params}:{params:{id:string}}) => {
const data = await fetchSellerDetails(params.id);
  return (
    <div>
        <SellerProfile shop={data?.shop} followersCount={data?.followersCount} />
    </div>
  )
}

export default page