import { Pencil, PencilIcon, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ImagePlaceHolder = ({
  size,
  small,
  pictureUploadingLoader,
  onImageChange,
  onRemove,
  defaultImage = null,
  setSelectedImage,
  setSelectedImageIndex,
  index = null,
  setOpenImageModel,
  images,
}: {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove: (index: number) => void;
  defaultImage?: string | null;
  setSelectedImage:(e:string)=>void;
  setSelectedImageIndex:(e:number)=>void;
  index?: any;
  setOpenImageModel: (openImageModel: boolean) => void;
  images:any;
  pictureUploadingLoader:boolean;
}) => {


  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);

  useEffect(() => {
    setImagePreview(defaultImage);
  }, [defaultImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file, index!);
    }
  };

  return (
    <div
      className={`relative ${
        small ? "h-[180px]" : "h-[450px]"
      } w-full cursor-pointer bg-[#1e1e1e] border border-gray-600 rounded-lg flex flex-col justify-center items-center`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`image-upload-${index}`}
        onChange={handleFileChange}
      />
      {imagePreview ? (
        <>
          <button
            type="button"
            disabled={pictureUploadingLoader}
            onClick={() => onRemove?.(index!)}
            className="absolute top-3 right-3 !rounded bg-red-600 shadow-lg"
          >
            <X size={16} />
          </button>
          <button
            disabled={pictureUploadingLoader}
            className="absolute top-3 right-[70px] p-2 !rounded bg-blue-500 shadow-lg"
            onClick={() => {
              setOpenImageModel(true);
              setSelectedImage(images[index].file_url);
              setSelectedImageIndex(index);
            }}
          >
            <WandSparkles size={16} />
          </button>
        </>
      ) : (
        <label
          htmlFor={`image-upload-${index}`}
          className="absolute top-3 right-3 p-2 !rounded bg-slate-700 shadow-lg cursor-pointer"
        >
          <Pencil size={16} />
        </label>
      )}
      {imagePreview ? (
        <Image
        width={400}
        height={300}
          src={imagePreview}
          alt="upload"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <>
          <p className={`text-gray-400 ${small ? "text-xl" : "text-4xl"}`}>
            {size}
          </p>
          <p
            className={`text-gray-500 ${
              small ? "text-sm" : "text-lg"
            } pt-2 text-center`}
          >
            Please choose an image <br />
            according to the expected ratio
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePlaceHolder;
