"use client";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import

const page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit=(data:any)=>{
    console.log(data);
  }

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
        <h2 className="text-2xl py-2 font-Poppins text-white">
            Create Product
        </h2>
        <div className="flex items-center">
            <span className="text-[#80Deea] cursor-pointer">
                Dashboard
            </span>
            <ChevronRight size={20} className="opacity-[.8]"/>
            <span>Create Product</span>
        </div>
        <div className="py-4 w-full flex gap-6">
          <div className="w-[35%]">
            
          </div>
        </div>
    </form>
  );
};

export default page;
