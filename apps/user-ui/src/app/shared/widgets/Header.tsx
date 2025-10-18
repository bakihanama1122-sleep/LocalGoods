"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { Search, ShoppingCart } from "lucide-react";
import ProfileIcon from "apps/user-ui/src/assets/profile-icon";
import HeartIcon from "apps/user-ui/src/assets/heart-icon";
import HeaderBottom from "./HeaderBottom";
import useUser from "apps/user-ui/src/hooks/useUser";
import { useStore } from "apps/user-ui/src/store";
import { useAuthStore } from "apps/user-ui/src/store/authStore";

const Header = () => {
  const { user, isLoading } = useUser();
  const { cart, wishlist, clearAll } = useStore();
  const { isLoggedIn, setLoggedIn } = useAuthStore();

  // Keep Zustand state in sync with authentication state
  useEffect(() => {
    if (!isLoading) {
      // If user object is missing, mark as logged out and clear local store
      if (!user) {
        setLoggedIn(false);
        clearAll();
      } else {
        setLoggedIn(true);
      }
    }
  }, [user, isLoading, setLoggedIn, clearAll]);

  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link href={"/"}>
            <span className="text-3xl font-normal">LocalGoods</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 font-Poppins font-medium border-[2.5px] border-[#3489ff] outline-none h-[55px] rounded-md"
          />
          <div className="w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489FF] absolute top-0 right-0 rounded-r-md">
            <Search color="#fff" />
          </div>
        </div>

        {/* Profile, Wishlist & Cart */}
        <div className="flex items-center gap-8 pb-2">
          {/* Profile Section */}
          <div className="flex items-center gap-2">
            {!isLoading && isLoggedIn && user ? (
              <>
                <Link href="/profile" className="flex items-center gap-2">
                  <ProfileIcon />
                  <div>
                    <span className="block font-medium">Hello,</span>
                    <span className="font-semibold">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
                >
                  <ProfileIcon />
                </Link>
                <Link href="/login">
                  <span className="block font-medium">Hello,</span>
                  <span className="font-semibold">
                    {isLoading ? "..." : "Sign in"}
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Wishlist & Cart (only show if logged in) */}
          {isLoggedIn && user && (
            <div className="flex items-center gap-5">
              <Link href="/wishlist" className="relative">
                <HeartIcon />
                {wishlist?.length > 0 && (
                  <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                    <span className="text-white font-medium text-sm">
                      {wishlist.length}
                    </span>
                  </div>
                )}
              </Link>

              <Link href="/cart" className="relative">
                <ShoppingCart />
                {cart?.length > 0 && (
                  <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                    <span className="text-white font-medium text-sm">
                      {cart.length}
                    </span>
                  </div>
                )}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="border-b border-b-slate-200" />
      <HeaderBottom />
    </div>
  );
};

export default Header;
