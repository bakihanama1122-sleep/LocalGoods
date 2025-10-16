"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DummyStripeOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sellerId = searchParams.get("sellerId");
  const accountId = searchParams.get("accountId");

  useEffect(() => {
    if (sellerId && accountId) {
      // Simulate a delay for "onboarding"
      const timer = setTimeout(() => {
        router.push("/success");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sellerId, accountId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 rounded-lg shadow-lg bg-white text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Simulating Stripe Onboarding
        </h1>
        <p className="text-gray-600">
          Please wait while we set up your Stripe account...
        </p>
        {sellerId && accountId && (
          <div className="mt-4 text-sm text-gray-500">
            Seller ID: <span className="font-mono">{sellerId}</span>
            <br />
            Account ID: <span className="font-mono">{accountId}</span>
          </div>
        )}
      </div>
    </div>
  );
}
