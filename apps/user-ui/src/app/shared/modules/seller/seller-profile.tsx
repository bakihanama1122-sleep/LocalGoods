"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { Calendar, Clock, Globe, Heart, MapPin, Star, Users, VideoIcon, XIcon,} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "../../components/cards/product-card";


const TABS = ["Products","Offers","Reviews"];

const SellerProfile = ({
    shop,
    seller,
    followersCount,
}:{
    shop:any;
    seller?:any;
    followersCount:number;
})=>{
    const [activeTab,setActiveTab] = useState("Products");
    const [followers,setFollowers] = useState(followersCount);
    const [isFollowing,setIsFollowing] = useState(false);

    const queryClient = useQueryClient();

    const {data:products,isLoading} = useQuery({
        queryKey:["seller-products"],
        queryFn:async()=>{
            const res = await axiosInstance.get(
                `/seller/api/get-seller-products/${seller?.id}?page=1&limit=10`
            );
            return res.data.products;
        },
        staleTime:1000*60*5,
    });

    useEffect(()=>{
        const fetchFollowStatus = async()=>{
            if(!shop?.id) return;
            try {
                const res = await axiosInstance.get(
                    `/seller/api/is-following/${shop?.id}`
                );
                setIsFollowing(res.data.isFollowing);
            } catch (error) {
                console.error("failed to fetch follow status",error);
            }
        };
        fetchFollowStatus();
    },[shop?.id]);

    const {data:events,isLoading:isEventLoading} = useQuery({
        queryKey:["seller-events"],
        queryFn:async()=>{
            const res = await axiosInstance.get(
                `/seller/api/get-seller-events/${seller?.id}?page=1&limit=10`
            );
            return res.data.products;
        },
        staleTime:1000*60*5,
    });

    const toggleFollowMutation = useMutation({
        mutationFn: async()=>{
            await axiosInstance.post(`/seller/api/toggle-follow/${shop?.id}`);
        },
        onSuccess:()=>{
            if(isFollowing){
                setFollowers(followers-1);
            }else{
                setFollowers(followers+1);
            }
            setIsFollowing((prev)=>!prev);
            queryClient.invalidateQueries({
                queryKey:["is-following",shop?.id]
            });
        },
        onError:()=>{
            console.error("Failed to follow/unfollow the shop.");
        }
    })

    // useEffect(()=>{
    //     if(!isLoading){
    //         if(!location || !deviceInfo || !user?.id) return;
    //         sendKafkaevent({
    //             userId:user?.id,
    //             shopId:shop?.id,
    //             action:"Shop_visit",
    //             country:location?.country || "Unknown",
    //             city:location?.city || "Unknown",
    //             device:deviceInfo || "Unknown Device",
    //         });
    //     }
    // },[location,deviceInfo,isLoading]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Section */}
            <div className="relative w-full h-[250px] overflow-hidden">
                <Image
                src={shop?.coverBanner?.startsWith('http') ? shop.coverBanner : (shop?.coverBanner || "/store_banner_fallback.jpg")}
                alt="Seller Cover"
                className="w-full h-full object-cover"
                width={1200}
                height={250}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            {/* Content Section */}
            <div className="relative -mt-20 z-10">
                <div className="w-[85%] lg:w-[70%] mx-auto flex flex-col lg:flex-row gap-6">
                    {/* Main Info Card */}
                    <div className="bg-white p-6 rounded-lg shadow-lg flex-1 border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="relative w-[100px] h-[100px] rounded-full border-4 border-white overflow-hidden shadow-lg">
                                <Image
                                src={
                                    shop?.avatar?.startsWith('http') ? shop.avatar : (shop?.avatar || "/store_fallback.png")
                                }
                                alt="seller avatar"
                                layout="fill"
                                objectFit="cover"
                                />
                            </div>

                        <div className="flex-1 w-full">
                            <h1 className="text-2xl font-semibold text-slate-900">
                                {shop?.name}
                            </h1>
                            <p className="text-slate-800 text-sm mt-1">
                                {shop?.bio || "No bio available."}
                            </p>

                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center text-blue-400 gap-1">
                                    <Star fill="#60a5fa" size={18}/>{" "}
                                    <span>{shop?.rating || "N/A"}</span>
                                </div>
                                <div className="flex items-center text-slate-700 gap-1">
                                    <Users size={18}/> <span>{followers} Followers</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-3 text-slate-700">
                                <Clock size={18}/>
                                <span>{shop?.opening_hours || "Mom -- Sat: 9AM - 6 PM"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <MapPin size={18}/>{" "}
                                <span>{shop?.address || "No address provided"}</span>
                            </div>
                        </div>
                        <button
                        className={`px-6 py-2 h-[40px] rounded-lg font-semibold flex items-center gap-2 transition ${
                            isFollowing
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        onClick={()=>toggleFollowMutation.mutate()}
                        disabled={toggleFollowMutation.isPending}
                        >
                            <Heart size={18}/>
                            {isFollowing?"UnFollow":"Follow"}
                        </button>
                    </div>
                </div>

                {/* Shop Details Card */}
                <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-[30%] border border-gray-200">
                        <h2 className="text-xl font-semibold text-slate-900">Shop Details</h2>

                        <div className="flex items-center gap-3 mt-3 text-slate-700">
                            <Calendar size={18}/>
                            <span>
                                Joined At: {new Date(shop?.createdAt!).toLocaleDateString()}
                            </span>
                        </div>

                        {shop?.website && (
                            <div className="flex items-center gap-3 mt-3 text-slate-700">
                                <Globe size={18}/>
                                <Link
                                href={shop?.website}
                                className="hover:underline text-blue-600"
                                >
                                    {shop?.website}
                                </Link>
                            </div>
                        )}
                        {seller && (
                            <div className="mt-3">
                                <h3 className="text-slate-700 text-lg font-medium">
                                    Seller Information:
                                </h3>
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="font-medium">Name:</span>
                                        <span>{seller.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="font-medium">Email:</span>
                                        <span>{seller.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="font-medium">Phone:</span>
                                        <span>{seller.phone_number}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="font-medium">Country:</span>
                                        <span>{seller.country}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {shop?.socialLinks && shop?.socialLinks.length>0 && (
                            <div className="mt-3">
                                <h3 className="text-slate-700 text-lg font-medium">
                                    Follow Us:
                                </h3>
                                <div className="flex gap-3 mt-2">
                                {shop?.socialLinks?.map((link:any,index:number)=>(
                                    <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opacity-[.9]"
                                    >
                                        {link.type === "youtube" && <VideoIcon/>}
                                        {link.type === "x" && <XIcon/>}
                                    </a>
                                ))}
                                </div>
                            </div>
                        )}
                </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="w-[85%] lg:w-[70%] mx-auto mt-8">
                    <div className="flex border-b border-gray-300 bg-white rounded-t-lg">
                        {TABS.map((tab)=>(
                            <button
                            key={tab}
                            onClick={()=>setActiveTab(tab)}
                            className={`py-3 px-6 text-lg font-semibold rounded-t-lg ${
                                activeTab === tab
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                                :"text-slate-600 hover:text-slate-800 hover:bg-gray-50"
                            } transition`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0">
                        {activeTab === "Products" && (
                            <div className="p-6">
                                {isLoading && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {Array.from({length:8}).map((_,index)=>(
                                            <div
                                            key={index}
                                            className="h-[250px] bg-gray-200 animate-pulse rounded-lg"
                                            >
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!isLoading && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {products?.map((product:any)=>(
                                            <ProductCard key={product.id} product={product}/>
                                        ))}
                                    </div>
                                )}
                                {!isLoading && products?.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No products available yet!</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab==="Offers" && (
                            <div className="p-6">
                                {isEventLoading && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {Array.from({length:8}).map((_,index)=>(
                                            <div
                                            key={index}
                                            className="h-[250px] bg-gray-200 animate-pulse rounded-lg"
                                            >
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!isEventLoading && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {events?.map((product:any)=>(
                                            <ProductCard
                                            isEvent={true}
                                            key={product.id}
                                            product={product}
                                            />
                                        ))}
                                    </div>
                                )}
                                {!isEventLoading && events?.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No offers available yet!</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab==="Reviews" && (
                            <div className="p-6">
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No reviews available yet!</p>
                                </div>
                            </div>
                        )}
                    </div>
            </div>
        </div>
    )
}

export default SellerProfile;