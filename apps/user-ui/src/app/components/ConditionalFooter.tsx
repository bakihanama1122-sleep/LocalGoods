"use client";

import { usePathname } from "next/navigation";
import Footer from "../shared/widgets/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't show footer on inbox page
  if (pathname === '/inbox') {
    return null;
  }
  
  return <Footer />;
}
