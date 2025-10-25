"use client"

import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState:{errors,isSubmitting},
    }=useForm();
    const [error,setError] = useState("");
    const [message,setMessage] = useState("");
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const onSubmit = async(data:any)=>{
      setError("");
      setMessage("");
      try {
        await axiosInstance.post("/api/change-password",{
          currentPassword:data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data?.confirmPassword,
        });
        setMessage("Password updated successfully!");
        reset();
      } catch (error:any) {
        setError(error?.response?.data?.message);
      }
    };

    const newPassword = watch("newPassword");
    const passwordRequirements = [
        { text: "At least 8 characters", met: newPassword?.length >= 8 },
        { text: "One lowercase letter", met: /[a-z]/.test(newPassword || "") },
        { text: "One uppercase letter", met: /[A-Z]/.test(newPassword || "") },
        { text: "One number", met: /\d/.test(newPassword || "") }
    ];

  return (
    <div className='max-w-lg mx-auto space-y-6'>
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-4">
                <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Change Password</h2>
            <p className="text-gray-600">Update your password to keep your account secure</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700'>
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                placeholder="Enter your current password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-10"
                {...register("currentPassword", {
                  required: "Current password is required",
                  minLength:{
                    value:6,
                    message:"Minimum 6 characters required",
                  }
                })}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword?.message && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {String(errors.currentPassword.message)}
              </p>
            )}
          </div>

          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700'>
              New Password *
            </label>
            <div className="relative">
              <input 
                type={showPasswords.new ? "text" : "password"}
                {...register("newPassword",{
                  required:"New password is required",
                  minLength:{
                    value:8,
                    message:"Must be at least 8 characters",
                  },
                  validate:{
                    hasLower:(value)=>
                      /[a-z]/.test(value) || "Must include a lowercase letter",
                    hasUpper:(value)=>
                      /[A-Z]/.test(value) || "Must include an uppercase letter",
                    hasNumber:(value)=>
                      /\d/.test(value) || "Must include a number",
                  },
                })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-10'
                placeholder='Enter your new password'
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Requirements */}
            {newPassword && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">Password requirements:</p>
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <CheckCircle className={`w-3 h-3 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={req.met ? 'text-green-700' : 'text-gray-500'}>{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.newPassword?.message && (
              <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                <AlertCircle className="w-3 h-3" />
                {String(errors.newPassword.message)}
              </p>
            )}
          </div>

          <div>
            <label className='block mb-2 text-sm font-medium text-gray-700'>
              Confirm New Password *
            </label>
            <div className="relative">
              <input 
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword",{
                  required:"Please confirm your password",
                  validate:(value)=>
                    value == watch("newPassword") || "Passwords do not match",
                })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-10'
                placeholder='Re-enter your new password'
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword?.message && (
              <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                <AlertCircle className="w-3 h-3" />
                {String(errors.confirmPassword.message)}
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </button>
        </form>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className='text-red-700 text-sm'>{error}</p>
          </div>
        )}
        {message && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className='text-green-700 text-sm'>{message}</p>
          </div>
        )}
    </div>
  )
}

export default ChangePassword