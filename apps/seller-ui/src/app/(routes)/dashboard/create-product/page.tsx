"use client";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ImagePlaceHolder from "apps/seller-ui/src/shared/components/image-placeholder";

const page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageModel,setOpenImageModel]= useState(false);
  const [isChanged,setIsChanged]= useState(false);
  const [images,setImages]= useState<(File | null)[]>([null]);
  const [loading,setLoading]= useState(false);

  const handleImageChange=(file:File|null,index:number)=>{
    const updatedImages = [...images];
    updatedImages[index]=file;
    if(index===images.length-1 && images.length<8){
      updatedImages.push(null);
    }

    setImages(updatedImages);
    setValue("images",updatedImages);
  }

  const handleRemoveImages = (index:number)=>{
    setImages((prevImages)=>{
      let updatedImages = [...prevImages];
      if(index===-1){
        updatedImages[0]=null;
      }else{
        updatedImages.splice(index,1);
      }
      if(!updatedImages.includes(null) && updatedImages.length<0){
        updatedImages.push(null);
      }
      return updatedImages;
    })
  }
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
            <ImagePlaceHolder
            setOpenImageModel={setOpenImageModel}
            size="765 X 850"
            small={false}
            index={0}
            onImageChange={handleImageChange}
            onRemove={handleRemoveImages}
            />
          </div>
        </div>
    </form>
  );
};

export default page;
