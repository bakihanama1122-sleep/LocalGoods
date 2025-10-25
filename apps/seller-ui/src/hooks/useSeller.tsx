import { useQuery} from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";


const fetchSeller = async()=>{
    const response = await axiosInstance.get("/api/logged-in-seller");
    return response.data.seller;
}

const useSeller=(options?: {enabled?: boolean})=>{
    const {data:seller,isLoading,isError,refetch} = useQuery({
        queryKey:["seller"],
        queryFn:fetchSeller,
        staleTime: 1000*60*5,
        retry: 1,
        enabled: options?.enabled !== false, // Default to true if not specified
    });

    return {seller,isLoading,isError,refetch};
}

export default useSeller;