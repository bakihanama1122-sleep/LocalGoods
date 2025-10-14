import { Divide, Eye, Heart, HeartIcon, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Ratings from "../ratings";
import ProductDetailsCard from "./product-details.card";
import { useStore } from "apps/user-ui/src/store";
import useUser from "apps/user-ui/src/hooks/useUser";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useDeviceTracking from "apps/user-ui/src/hooks/DeviceTracking";

const ProductCard = ({
  product,
  isEvent,
}: {
  product: any;
  isEvent?: boolean;
}) => {
    const [timeLeft,setTimeLeft] = useState("");
    const [open,setOpen] = useState(false);
    const {user} = useUser();
    const location = useLocationTracking();
    const deviceInfo = useDeviceTracking();
    const addToCart = useStore((state:any)=>state.addToCart);
    const addToWishlist = useStore((state:any)=>state.addToWishlist);
    const removeFromWishlist = useStore((state:any)=>state.removeFromWishlist);
    const wishlist = useStore((state:any)=>state.wishlist);
    const isWishlisted = wishlist.some((item:any)=>item.id === product.id);
    const cart = useStore((state:any)=>state.cart);
    const isInCart = cart.some((item:any)=> item.id === product.id);

    useEffect(()=>{
        if(isEvent && product?.ending_date){
            const interval = setInterval(()=>{
                const endTime = new Date(product.ending_date).getTime();
                const now = Date.now();
                const diff = endTime - now;

                if(diff <= 0){
                    setTimeLeft("Expired");
                }else{
                    const days = Math.floor(diff/(1000*60*60*24));
                    const hours = Math.floor((diff/(1000*60*60))%24);
                    const minutes = Math.floor((diff/(1000*60))%60);
                    setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price.`)
                }
            })
        }
    })

  return (
    <div className="w-full min-h-[350px] h-max bg-white rounded-lg relative">
      {isEvent && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
          OFFER
        </div>
      )}
      {product?.stock <= 5 && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-slate-600">
          Limited stock
        </div>
      )}
      <Link href={`product/${product?.slug}`}>
        <img
          src={
            product?.images[0]?.url ||
            "https://www.google.com/imgres?q=product%20images&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F024%2F841%2F285%2Fsmall_2x%2Fwireless-headphone-isolated-on-transparent-background-high-quality-bluetooth-headphone-for-advertising-and-product-catalogs-generative-ai-png.png&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-png%2Fproduct&docid=tYWSX8WmLvTNiM&tbnid=2abQS3QYH_pjDM&vet=12ahUKEwjjuJ_SipKQAxWHcGwGHTWXJVYQM3oECCcQAA..i&w=400&h=400&hcb=2&ved=2ahUKEwjjuJ_SipKQAxWHcGwGHTWXJVYQM3oECCcQAA"
          }
          alt={product?.title}
          width={300}
          height={300}
          className="w-full h-[200px] object-cover mx-auto rounded-t-md"
        />
      </Link>
      <Link
        href={`/shop/${product?.shop?.id}`}
        className="block text-blue-500 text-sm font-medium my-2 px-2"
      >
        {product?.shop?.name}
      </Link>
      <Link href={`/product/${product?.slug}`}>
        <h3 className="text-base text-gray-800 font-semibold my-2 px-2 lin">
          {product?.title}
        </h3>
      </Link>

      <div className="mt-2 px-2">
          <Ratings rating={product?.ratings}/>
      </div>
      <div className="mt-3 flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
                ${product?.sale_price}
            </span>
            <span className="text-sm line-through text-gray-400">
                ${product?.regular_price}
            </span>
          </div>
          <span className="text-green-500 text-sm font-medium">
            {product.totalsales} sold
          </span>
      </div>
      {isEvent && timeLeft && (
        <div className="mt-2">
            <span className="inline-block text-xs bg-orange-100 text-red-500">
                {timeLeft}
            </span>
        </div>
      )}

      <div className="absolute z-10 flex flex-col gap-3 right-3 top-10">
        <div className="bg-white rounded-full p-[6px] shadow-md">
            <Heart
            className="cursor-pointer hover:scale-110 transition"
            size={22}
            fill={isWishlisted?"red":"transparent"}
            stroke={isWishlisted?"red":"#4b5563"}
            onClick={()=>
              isWishlisted?removeFromWishlist(product.id,user,location,deviceInfo):addToWishlist({...product,quantity:1},
              user,
              location,
              deviceInfo)
            }
            />
        </div>
        <div className="bg-white rounded-full p-[5px] shadow-md">
            <Eye
            className="cursor-pointer text-[#4b5563] hover:scale-110 transition"
            size={22}
            onClick={()=>setOpen(!open)}
            />
        </div>
        <div className="bg-white rounded-full p-[6px] shadow-md">
            <ShoppingBag
            className="cursor-pointer text-[#4b5563] hover:scale-110 transition"
            size={22}
            onClick={()=>
              !isInCart && 
              addToCart({...product,quantity:1},user,location,deviceInfo)
            }
            />
        </div>
        {open &&(
            <ProductDetailsCard data={product} setOpen={setOpen}/>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
