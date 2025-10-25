'use client'

import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { XCircle, ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {loadStripe,Appearance} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from '../../shared/components/checkout/CheckoutForm';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const page = () => {
    const [clientSecret,setClientSecret] = useState("");
    const [cartItem,setCartItem] = useState<any[]>([]);
    const [coupon,setCoupon] = useState();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const sessionId = searchParams.get("sessionId");

    useEffect(()=>{
        const fetchSessionAndClientSecret = async()=>{
            if(!sessionId){
                setError("Invalid session.Please try again.");
                setLoading(false);
                return;
            }

            try {
                const verifyRes = await axiosInstance.get(
                    `/order/api/verifying-payment-session?sessionId=${sessionId}`
                );

                const {totalAmount,sellers,cart,coupon} = verifyRes.data.session;
                
                if(
                    !sellers || 
                    sellers.length === 0 ||
                    totalAmount === undefined ||
                    totalAmount === null
                ){
                    throw new Error("Invalid payment session data.");
                }

                setCartItem(cart);
                setCoupon(coupon);
                const sellerStripeAccountId = sellers[0].stripeAccountId;

                const intentRes = await axiosInstance.post(
                    "/order/api/create-payment-intent",
                    {
                        amount:coupon?.discountAmount
                        ? totalAmount - coupon?.discountAmount
                        : totalAmount,
                        sellerStripeAccountId,
                        sessionId,
                    }
                );

                setClientSecret(intentRes.data.clientSecret);
            } catch (error) {
                console.error(error);
                setError("Something went wrong while preparing your payment.");
            }finally{
                setLoading(false);
            }
        };

        fetchSessionAndClientSecret();
    },[sessionId]);

    const appearance: Appearance = {
        theme:"stripe",
    };

    if(loading){
        return(
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="relative">
                            <div className="w-16 h-16 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                            </div>
                            <div className="flex items-center justify-center mb-4">
                                <CreditCard className="w-8 h-8 text-blue-600 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-900">Preparing Payment</h2>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Please wait while we set up your secure checkout session...
                            </p>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                <Shield className="w-4 h-4" />
                                <span>Secure SSL encryption</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if(error){
        return(
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-8 h-8 text-red-600"/>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Payment Setup Failed
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {error}
                        <br />
                        Please go back and try checking out again.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={()=> router.push("/cart")}
                            className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={20} />
                            Back to Cart
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

  return (
    clientSecret && (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <button 
                                onClick={() => router.push("/cart")}
                                className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back to Cart
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Shield size={16} className="text-green-600" />
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Elements
                    stripe={stripePromise}
                    options={{clientSecret,appearance}}
                >
                    <CheckoutForm
                        clientSecret={clientSecret}
                        cartItems={cartItem}
                        coupon={coupon}
                        sessionId={sessionId}
                    />
                </Elements>
            </div>
        </div>
    )
  )
}

export default page