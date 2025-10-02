import React, { useState } from 'react'

const ImagePlaceHolder = ({
    size,small,onImageChange,onRemove,defaultImage = null,index=null,setOpenImageModel
}:{
    size:string;
    small?:boolean;
    onImageChange:(file:File | null,index:number)=>void;
    onRemove:(index:number)=>void;
    defaultImage?:string | null;
    index?:null,
    setOpenImageModel:(openImageModel: boolean) => void;
}) => {
    const [imagePreview,setImagePreview] = useState<string | null>(defaultImage);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        const file = event.target.files?.[0];
        if(file){
            setImagePreview(URL.createObjectURL(file));
            onImageChange(file,index!);
        }
    };

  return (
    <div>ImagePlaceHolder</div>
  )
}

export default ImagePlaceHolder;