"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { countries } from "apps/seller-ui/src/utils/countries";
import CreateShop from "apps/seller-ui/src/shared/modules/auth/CreateShop";
import StripeLogo from "apps/seller-ui/src/assets/svgs/StripeLogo";

const Signup = () => {
  const [activeStep, setActiveStep] = useState(3);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sellerData, setSellerData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
const [sellerId,setSellerId] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
        } else {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/seller-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setSellerData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!sellerData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-seller`,
        {
          ...sellerData,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setSellerId(data?.sellerId?.Id);
      setActiveStep(2);
    },
  });

  const onSubmit = (data:any) => {
    console.log(data);
    signupMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = () => {
    if (sellerData) {
      signupMutation.mutate(sellerData);
    }
  };

  const connectStripe = async()=>{
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URI}/api/create-stripe-link`,{
            sellerId
        });
        if(response.data.url){
            window.location.href= response.data.url;
        }
    } catch (error) {
        console.error("Stripe Connection Error: ",error);
    }
  }

  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      <div className="relative flex items-center justify-between md:w-[50%] mb-8">
        <div className="absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10" />
        {[1, 2, 3].map((step) => (
          <div key={step}>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step <= activeStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {step}
            </div>
            <span className="ml-[-15px]">
              {step === 1
                ? "Create Account"
                : step === 2
                ? "Setup Shop"
                : "Connect Bank"}
            </span>
          </div>
        ))}
      </div>
      <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
        {activeStep === 1 && (
          <>
            {!showOtp ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="text-2xl font-semibold text-center mb-4">
                  Create Account
                </h3>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="your name"
                  className="w-full p-2 border-gray-300 outline-0 rounded mb-1"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    {String(errors.name.message)}
                  </p>
                )}
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="support@localgoods.com"
                  className="w-full p-2 border-gray-300 outline-0 rounded mb-1"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalide email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {String(errors.email.message)}
                  </p>
                )}

                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="99-********"
                  className="w-full p-2 border-gray-300 outline-0 rounded mb-1"
                  {...register("phone_number",{
                    required:"Phone number is required",
                    pattern:{
                        value:/^\+?[1-9]\d{1,14}$/,
                        message:"Invalid phone number format",
                    },
                    minLength:{
                        value:10,
                        message:"Phone number must be at least 10 digits",
                    },
                    maxLength:{
                        value:10,
                        message:"Phone number must be at max 15 digits",
                    },
                  })}
                />
                <label className="block text-gray-700 mb-1">Country</label>
                <select 
                className="w-full p-2 border border-gray-300 outline-0 rounded-[4px]"
                {...register("country",{required:"Country is required"})}
                name="" id="">
                    <option value="">Select you country</option>
                    {countries?.map((country)=>(
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}
                </select>
                {errors.country &&(
                    <p className="text-red-500 text-sm">
                        {String(errors.country.message)}
                    </p>
                )}
                <label className="block text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  >
                    {passwordVisible ? <Eye /> : <EyeOff />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {String(errors.password.message)}
                    </p>
                  )}
                  <p className="pt-3 text-center">
                    Already have an account?{" "}
                    <Link href={"/login"} className="text-blue-500">
                    Login
                    </Link>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
                >
                  {signupMutation.isPending ? "Signing up ..." : "Signup"}
                </button>

                {signupMutation.isError &&
                signupMutation.error instanceof AxiosError &&(
                    <p className="text-red-500 text-sm mt-2">
                        {signupMutation.error.response?.data?.message ||
                        signupMutation.error.message}
                    </p>
                )}
              </form>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  Enter OTP
                </h3>
                <div className="flex justify-center gap-6">
                  {otp?.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      maxLength={1}
                      className="w-12 h-12 text-center border border-gray-300 outline-none !rounded"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <button
                  className="w-full mt-4 text-lg cusrsor-pointere bg-blue-500 text-white py-2 rounded-lg"
                  disabled={verifyOtpMutation.isPending}
                  onClick={() => verifyOtpMutation.mutate()}
                >
                  {verifyOtpMutation.isPending ? "Verifying...." : "Verify OTP"}
                </button>
                <p className="text-center text-sm mt-4">
                  {canResend ? (
                    <button
                      onClick={resendOtp}
                      className="text-blue-500 cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    `Resend OTP in ${timer}s`
                  )}
                </p>
                {verifyOtpMutation?.isError &&
                  verifyOtpMutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                      {verifyOtpMutation.error.response?.data?.message ||
                        verifyOtpMutation.error.message}
                    </p>
                  )}
                  
              </div>
            )}
          </>
        )}

        {activeStep===2 && (
            <CreateShop sellerId={sellerId} setActiveStep={setActiveStep}/>
        )}

        {activeStep===3 && (
            <div className="text-center">
                <h3 className="text-xl font-semibold text-center mb-4">
                  Withdraw Method
                </h3>
                <br/>
                <button
                className="w-full m-auto flex items-center justify-center gap-3 text-lg bg-[#334155] text-white py-2 rounded-lg"
                onClick={connectStripe}
                >
                    Connect Stripe <StripeLogo/>
                </button>

            </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
