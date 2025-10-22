"use client"

import React from "react";
import { useRouter } from "next/navigation";

const StripeSuccessPage = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/login"); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        <svg
          className="w-16 h-16 mx-auto text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>

        <h1 className="text-2xl font-bold mt-4">Success!</h1>
        <p className="text-gray-600 mt-2">
          Your Stripe account has been successfully connected.
        </p>

        <button
          onClick={handleRedirect}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default StripeSuccessPage;
