'use client'
import useUser from 'apps/user-ui/src/hooks/useUser'
import { BadgeCheck, Bell, CheckCircle, Clock, Gift, Inbox, Loader2, Lock, LogOut, MapPin, Pencil, PhoneCall, Receipt, Settings, ShoppingBag, TrainTrack, User } from 'lucide-react';
import React, { act, useEffect, useState } from 'react'
import StatCard from '../../shared/components/cards/stat.card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import Image from 'next/image';
import QuickActionCard from '../../shared/components/cards/quick-action.card';
import ShippingAddressSection from '../../shared/components/shippingAddress/page';

const page = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const {user,isLoading} = useUser();
    const queryTab = searchParams.get("active") || "Profile"
    const [activeTab,setActiveTab] = useState(queryTab);

    useEffect(()=>{
        if(activeTab!==queryTab){
            const newParams = new URLSearchParams(searchParams);
            newParams.set("active",activeTab);
            router.replace(`/profile?${newParams.toString()}`);
        }
    },[activeTab]);

    const logOutHandler = async()=>{
        await axiosInstance.get("/api/logout-user").then((res)=>{
            queryClient.invalidateQueries({queryKey:["user"]});
            router.push("/login");
        });
    };

  return (
    <div className='bg-gray-50 p-6 pb-14'>
        <div className='md:max-w-7xl mx-auto'>
            <div className='text-center mb-10'>
                <h1 className='text-3xl font-bold text-gray-800'>
                Welcome back,
                
                <span className='text-blue-600'>
                {isLoading?(
                    <Loader2 className='inline animate-spin w-5 h-5'/>
                ):(
                    `${user?.name}` || "User"
                )}
                </span>{" "}👋
                </h1>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                <StatCard
                title="Total Orders"
                count={10}
                Icon={Clock}
                />
                <StatCard
                title="Processing Orders"
                count={4}
                Icon={TrainTrack}
                />
                <StatCard
                title="Completed Orders"
                count={10}
                Icon={CheckCircle}
                />
            </div>
            <div className='mt-10 flex flex-col md:flex-row gap-6'>
                <div className='bg-white p-4 rounded-md shadow-md border border-gray-100 w-full md:w-1/5'>
                    <nav className='space-y-2'>
                        <NavItems
                        label="Profile"
                        Icon={User}
                        active={activeTab === "Profile"}
                        onClick={()=>setActiveTab("Profile")}
                        />
                        <NavItems
                        label="My orders"
                        Icon={ShoppingBag}
                        active={activeTab === "My orders"}
                        onClick={()=>setActiveTab("My orders")}
                        />
                        <NavItems
                        label="Inbox"
                        Icon={Inbox}
                        active={activeTab === "Inbox"}
                        onClick={()=>router.push("/inbox")}
                        />
                        <NavItems
                        label="Notifications"
                        Icon={Bell}
                        active={activeTab === "Notifications"}
                        onClick={()=>setActiveTab("Notifications")}
                        />
                        <NavItems
                        label="Shipping address"
                        Icon={MapPin}
                        active={activeTab === "Shipping address"}
                        onClick={()=>setActiveTab("Shipping address")}
                        />
                        <NavItems
                        label="Change Password"
                        Icon={Lock}
                        active={activeTab === "Change Password"}
                        onClick={()=>setActiveTab("Change Password")}
                        />
                        <NavItems
                        label="Logout"
                        Icon={LogOut}
                        danger
                        onClick={()=>logOutHandler()}
                        />
                    </nav>
                </div>

                <div className='bg-white p-6 rounded-md shadow-sm border border-gray-100 w-full md:w-[55%]'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                        {activeTab}
                    </h2>
                    {activeTab==="Profile" && !isLoading && user ? (
                        <div className='space-y-4 text-sm text-gray-700'>
                            <div className='flex items-center gap-3'>
                                <Image
                                src={user?.avatar || ""}
                                alt="profile"
                                width={60}
                                height={60}
                                className='w-16 h-16 rounded-full border-gray-200'
                                />
                                <button
                                className='flex items-center gap-1 text-blue-500 text-xs font-medium'
                                >
                                    <Pencil className='w-4 h-4'/> Change Photo
                                </button>
                            </div>
                            <p>
                                <span className='font-semibold'>
                                    Name:
                                </span>
                                {user.name}
                            </p>
                            <p>
                                <span className='font-semibold'>
                                    Email:
                                </span>
                                {user.email}
                            </p>
                            <p>
                                <span className='font-semibold'>
                                    Joined:
                                </span>{" "}
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                            <p>
                                <span className='font-semibold'>
                                    Earned Points:
                                </span>{" "}
                                {user.points || 0}
                            </p>
                        </div>
                    ):activeTab==="Shipping Addresss"?(
                        <ShippingAddressSection/>
                    ):<></>}
                </div>

                <div className='w-full md:w-1/4 space-y-4'>
                    <QuickActionCard
                    Icon={Gift}
                    title="Referral Program"
                    description="Invite friends and earn rewards."
                    />
                    <QuickActionCard
                    Icon={BadgeCheck}
                    title="Your Badges"
                    description="View your earned achivements."
                    />
                    <QuickActionCard
                    Icon={Settings}
                    title="Account Settings"
                    description="Manage your preference and security."
                    />
                    <QuickActionCard
                    Icon={Receipt}
                    title="Billing History"
                    description="Check your recent payments."
                    />
                    <QuickActionCard
                    Icon={PhoneCall}
                    title="Support center"
                    description="Need help? Contact support."
                    />
                </div>
            </div>
        </div>
    </div>
  )
};

const NavItems = ({label,Icon,active,danger,onClick}:any)=>(
    <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
        active
        ? "bg-blue-100 text-blue-600"
        : danger
        ? "text-red-500 hover:bg-red-50"
        : "text-gray-700 hover:bg-gray-100"
    }`}
    >
        <Icon className="w-4 h-4"/>
        {label}
    </button>
)

export default page