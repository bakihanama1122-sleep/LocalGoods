import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendKafkaevent } from "../actions/track-user";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity?: number;
  shopId: string;
};

type Store = {
  cart: Product[];
  wishlist: Product[];
  addToCart: (
    product: Product,
    user: any,
    location: any,
    deviceInfo: any
  ) => void;
  removeFromCart: (
    id: string,
    user: any,
    location: any,
    deviceInfo: any
  ) => void;
  addToWishlist: (
    product: Product,
    user: any,
    location: any,
    deviceInfo: any
  ) => void;
  removeFromWishlist: (
    id: string,
    user: any,
    location: any,
    deviceInfo: any
  ) => void;
  clearAll: () => void;
};

export const useStore = create<Store>()(
  persist<Store>((set, get) => ({
    cart: [],
    wishlist: [],

    addToCart: (product, user, location, deviceInfo) => {
      set((state) => {
        const existing = state.cart?.find((item) => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                : item
            ),
          };
        }
        return {cart:[...state.cart,{...product,quantity:product?.quantity}]};
      });

      console.log(location,deviceInfo,user.id);

      if(user?.id){
        sendKafkaevent({
          userId:user?.id,
          productId:product?.id,
          shopId:product?.shopId,
          action:"add_to_cart",
          country:location?.country || "Unknown",
          city:location?.city || "Unknown",
          device:deviceInfo || "Unknown Device",
        }).catch(err => console.error("Kafka event error:", err));
      }
    },

    removeFromCart:(id,user,location,deviceInfo)=>{
        const removeProduct = get().cart.find((item)=>item.id===id);
        set((state)=>({
            cart:state.cart?.filter((item)=>item.id !==id),
        }));

        if(user?.id && location && deviceInfo && removeProduct){
        sendKafkaevent({
          userId:user?.id,
          productId:removeProduct?.id,
          shopId:removeProduct?.shopId,
          action:"remove_to_cart",
          country:location?.country || "Unknown",
          city:location?.city || "Unknown",
          device:deviceInfo || "Unknown Device",
        }).catch(err => console.error("Kafka event error:", err));
      }
    },

    addToWishlist:(product,user,location,deviceInfo)=>{
        set((state)=>{
            if(state.wishlist.find((item)=>item.id === product.id))
                return state;
            return {wishlist:[...state.wishlist,product]};
        });

        if(user?.id && location && deviceInfo){
        sendKafkaevent({
          userId:user?.id,
          productId:product?.id,
          shopId:product?.shopId,
          action:"add_to_wishlist",
          country:location?.country || "Unknown",
          city:location?.city || "Unknown",
          device:deviceInfo || "Unknown Device",
        }).catch(err => console.error("Kafka event error:", err));
      }
    },
    
    removeFromWishlist:(id,user,location,deviceInfo)=>{
        const removeProduct = get().wishlist.find((item)=>item.id===id);
        set((state)=>({
            wishlist:state.wishlist?.filter((item)=>item.id !==id),
        }));

        if(user?.id && location && deviceInfo && removeProduct){
        sendKafkaevent({
          userId:user?.id,
          productId:removeProduct?.id,
          shopId:removeProduct?.shopId,
          action:"remove_from_wishlist",
          country:location?.country || "Unknown",
          city:location?.city || "Unknown",
          device:deviceInfo || "Unknown Device",
        }).catch(err => console.error("Kafka event error:", err));
      }
    },

    clearAll: () => set({ cart: [], wishlist: [] }),
  }),{name:"store-storage"}
));
