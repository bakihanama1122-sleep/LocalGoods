import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import React from "react";
import { Metadata } from "next";
import ProductDetails from "../../shared/modules/product/product-details";

async function fetchProductDetails(slug: string) {
  const response = await axiosInstance.get(`product/api/get-product/${slug}`);
  return response.data.product;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await fetchProductDetails(params.slug);

  return {
    title: `${product?.title} | LocalGoods Marketplace`,
    description:
      product?.short_description ||
      "Discover hight-quality products on LocalGoods Marketplace.",
    openGraph: {
      title: product?.title,
      description: product?.short_description || "",
      images: [product?.images?.[0]?.url || "default-image.jpg"],
      type: "website",
    },
  };
}

const page = async ({ params }: { params: { slug: string } }) => {
  const productDetails = await fetchProductDetails(params?.slug);
  return 
  <ProductDetails productDetails={productDetails}/>

};

export default page;
