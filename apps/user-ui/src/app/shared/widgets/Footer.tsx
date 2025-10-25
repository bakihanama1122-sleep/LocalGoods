"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import useLayout from "apps/user-ui/src/hooks/useLayout";

const Footer = () => {
  const { layout } = useLayout();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <Image
                src={layout?.logo || "https://drive.google.com/file/d/13XDWM1-6EUHPjhyq7KaURBT6mZ376UB6/view?usp=sharing"}
                width={200}
                height={60}
                alt="LocalGoods Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Connecting you with authentic Indian local goods, antiques, and handmade treasures. 
              Support local artisans and discover unique finds from your community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 transition-colors">
                <Facebook size={18} className="text-gray-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 transition-colors">
                <Twitter size={18} className="text-gray-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 transition-colors">
                <Instagram size={18} className="text-gray-600" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/category/antiques" className="text-gray-600 hover:text-amber-600 transition-colors text-sm flex items-center">
                  Antiques & Collectibles
                </Link>
              </li>
              <li>
                <Link href="/category/handmade" className="text-gray-600 hover:text-amber-600 transition-colors text-sm flex items-center">
                  Handmade Crafts
                </Link>
              </li>
              <li>
                <Link href="/category/vintage" className="text-gray-600 hover:text-amber-600 transition-colors text-sm flex items-center">
                  Vintage Items
                </Link>
              </li>
              <li>
                <Link href="/category/art" className="text-gray-600 hover:text-amber-600 transition-colors text-sm flex items-center">
                  Art & Paintings
                </Link>
              </li>
              <li>
                <Link href="/category/jewelry" className="text-gray-600 hover:text-amber-600 transition-colors text-sm flex items-center">
                  Jewelry & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shops" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  Local Shops
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  Sell Items
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">support@localgoods.in</p>
                  <p className="text-gray-500 text-xs">Customer Support</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">+91 98765 43210</p>
                  <p className="text-gray-500 text-xs">Mon-Fri 9AM-6PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Mumbai, Maharashtra</p>
                  <p className="text-gray-500 text-xs">India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-500 text-sm">
                © 2024 LocalGoods India. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs">
                Supporting local artisans and preserving Indian heritage
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <Link href="#" className="text-gray-500 hover:text-amber-600 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-amber-600 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-amber-600 transition-colors text-sm">
                Seller Agreement
              </Link>
              <Link href="#" className="text-gray-500 hover:text-amber-600 transition-colors text-sm">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
