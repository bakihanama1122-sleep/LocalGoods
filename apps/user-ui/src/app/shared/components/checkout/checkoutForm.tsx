import {useElements,useStripe,PaymentElement} from '@stripe/react-stripe-js';
import { CheckCircle, Loader2, XCircle, CreditCard, Shield, Package, ShoppingCart } from 'lucide-react';
import React, { useState } from "react";

const CheckoutForm = ({
  clientSecret,
  cartItems,
  coupon,
  sessionId,
}: {
  clientSecret: string;
  cartItems: any[];
  coupon: any;
  sessionId: string | null;
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading,setLoading] = useState(false);
    const [status,setStatus] = useState<"success"|"failed"|null>(null);
    const [errorMsg,setErrorMsg] = useState<string|null>(null);

    const total = cartItems.reduce(
        (sum,item)=>sum+item.sale_price * item.quantity,
        0
    );

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        if(!stripe || !elements){
            setLoading(false);
            return;
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams:{
                return_url:`${window.location.origin}/payment-success?sessionId=${sessionId}`,
            },
        });

        if(result.error){
            setStatus("failed");
            setErrorMsg(result.error.message || "Something went wrong.");
        }else{
            setStatus("success");
        }
        setLoading(false);
    }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingCart size={24} />
            Order Summary
          </h2>
          
          <div className="space-y-4">
            {cartItems.map((item,idx)=>(
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-gray-900">
                  ₹{(item.quantity*item.sale_price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {coupon?.discountAmount && (
              <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3">
                <span className="text-green-700 font-medium">Discount Applied</span>
                <span className="text-green-700 font-semibold">
                  -₹{coupon.discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{(total - (coupon?.discountAmount || 0)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield size={18} />
              Secure Payment
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>PCI DSS compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Your payment information is secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard size={24} />
            Payment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <PaymentElement />
            </div>

            <button
              type="submit"
              disabled={!stripe || loading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                !stripe || loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? "Processing Payment..." : "Complete Payment"}
            </button>

            {errorMsg && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Payment successful! Redirecting...</span>
              </div>
            )}

            {status === "failed" && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <span>Payment failed. Please try again.</span>
              </div>
            )}
          </form>

          {/* Payment Methods */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Accepted Payment Methods</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CreditCard size={16} />
                <span>Cards</span>
              </div>
              <div className="flex items-center gap-1">
                <Package size={16} />
                <span>UPI</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={16} />
                <span>Net Banking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
