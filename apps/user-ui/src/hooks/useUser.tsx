"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useAuthStore } from "../store/authStore";
import { isProtected } from "../utils/protected";
import { useEffect } from "react";

/**
 * Fetches the currently logged-in user.
 * If unauthorized, just return null — do NOT throw error.
 */
const fetchUser = async () => {
  try {
    const response = await axiosInstance.get("/api/logged-in-user", isProtected);
    return response.data.user;
  } catch (err: any) {
    if (err?.response?.status === 401) return null; // handle unauthorized gracefully
    throw err;
  }
};

const useUser = () => {
  const { setLoggedIn } = useAuthStore();

  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    if (user) setLoggedIn(true);
    else if (!isPending) setLoggedIn(false);
  }, [user, isPending, setLoggedIn]);

  return {
    user: user as any,
    isLoading: isPending,
    isError,
  };
};

export default useUser;
