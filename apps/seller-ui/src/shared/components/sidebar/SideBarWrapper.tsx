"use client";
import useSeller from "apps/seller-ui/src/hooks/useSeller";
import useSidebar from "apps/seller-ui/src/hooks/useSidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./SideBar.Styles";
import Link from "next/link";
import Logo from "../../../assets/svgs/Logo"
import SidebarItem from "./Sidebar.Items";
import { BellPlus, BellRing, CalendarPlus, HomeIcon, ListOrdered, LogOut, Mail, PackageSearch, SquarePlus, TicketPercent, WalletCards } from "lucide-react";
import SideBarMenu from "./SideBar.Menu";
import PaymentIcon from "apps/seller-ui/src/assets/icons/payment";

const SideBarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathname = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathname);
  }, [pathname, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";
  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href={"/"} className="flex justify-center text-center gap-2">
            <Logo />
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name || "SHOP NAME"}
              </h3>
              <h5 className="font-medium text-xs text-[#ecedeecf] white-space-nowrap overflow-hidden text-ellispsis max-w-[170px]">
                {seller?.shop?.address || "Shop address"}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<HomeIcon fill={getIconColor("/dashboard")} />}
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />

          <div className="mt-2 block">
            <SideBarMenu title="Main Menu">
              <SidebarItem
                title="Orders"
                isActive={activeSidebar === "/dashboard/orders"}
                href="/dashboard/orders"
                icon={
                  <ListOrdered size={24} color={getIconColor("dashboard/accounts")} />
                }
              />
              <SidebarItem
                title="Payments"
                isActive={activeSidebar === "/dashboard/payments"}
                href="/dashboard/payments"
                icon={
                  <WalletCards  size={24} color={getIconColor("/dashboard/payments")} />
                }
              />
              <SidebarItem
                title="Create Product"
                isActive={activeSidebar === "/dashboard/create-product"}
                href="/dashboard/create-product"
                icon={
                  <SquarePlus size={24} color={getIconColor("dashboard/create-product")} />
                }
              />
              <SidebarItem
                title="All Products"
                isActive={activeSidebar === "/dashboard/all-products"}
                href="/dashboard/all-products"
                icon={
                  <PackageSearch size={26} color={getIconColor("/dashboard/all-products")} />
                }
              />
            </SideBarMenu>

            <SideBarMenu title="Events">
              <SidebarItem
                title="Create Events"
                isActive={activeSidebar === "/dashboard/create-event"}
                href="/dashboard/create-event"
                icon={
                  <CalendarPlus size={24} color={getIconColor("dashboard/create-event")} />
                }
              />
              <SidebarItem
                title="All Events"
                isActive={activeSidebar === "/dashboard/all-events"}
                href="/dashboard/all-events"
                icon={
                  <BellPlus size={24} color={getIconColor("/dashboard/all-events")} />
                }
              />
            </SideBarMenu>

            <SideBarMenu title="Controllers">
              <SidebarItem
                title="Inbox"
                isActive={activeSidebar === "/dashboard/inbox"}
                href="/dashboard/inbox"
                icon={
                  <Mail size={24} color={getIconColor("dashboard/inbox")} />
                }
              />
              <SidebarItem
                title="Settings"
                isActive={activeSidebar === "/dashboard/settings"}
                href="/dashboard/settings"
                icon={
                  <BellPlus size={24} color={getIconColor("/dashboard/settings")} />
                }
              />
              <SidebarItem
                title="Notifications"
                isActive={activeSidebar === "/dashboard/notifications"}
                href="/dashboard/notifications"
                icon={
                  <BellRing size={24} color={getIconColor("/dashboard/notifications")} />
                }
              />
            </SideBarMenu>

            <SideBarMenu title="Extras">
              <SidebarItem
                title="Discount Codes"
                isActive={activeSidebar === "/dashboard/discount-codes"}
                href="/dashboard/discount-codes"
                icon={
                  <TicketPercent size={22} color={getIconColor("dashboard/discount-codes")} />
                }
              />
              <SidebarItem
                title="Logout"
                isActive={activeSidebar === "/logout"}
                href="/logout"
                icon={
                  <LogOut size={24} color={getIconColor("/logout")} />
                }
              />
            </SideBarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SideBarWrapper;
