"use client";

import useAdmin from "apps/admin-ui/src/hooks/useAdmin";
import useSidebar from "apps/admin-ui/src/hooks/useSidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./sidebar.Styles";
import Link from "next/link";
import Logo from "apps/admin-ui/src/assets/svgs/Logo";
import SidebarItem from "./Sidebar.Items";
import { BellPlus, BellRing, CreditCard, FileClock, FileLock, Home, ListOrdered, LogOut, PackageSearch, PencilRuler, Settings, Store, Users } from "lucide-react";
import SideBarMenu from "./Sidebar.Menu";

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { admin } = useAdmin();

  useEffect(()=>{
    setActiveSidebar(pathName);
  },[pathName,setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";
  return (
    <div>
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
                  {admin?.name || "ADMIM NAME"}
                </h3>
                <h5 className="font-medium text-xs text-[#ecedeecf] white-space-nowrap overflow-hidden text-ellispsis max-w-[170px]">
                  {admin?.email || "admin mail"}
                </h5>
              </Box>
            </Link>
          </Box>

          
        </Sidebar.Header>
        <div className="block my-3 h-full">
            <Sidebar.Body className="body sidebar">
              <SidebarItem
                title="Dashboard"
                icon={<Home fill={getIconColor("/dashboard")} />}
                isActive={activeSidebar === "/dashboard"}
                href="/dashboard"
              />
            </Sidebar.Body>

            <div className="mt-2 block">
              <SideBarMenu title="main menu">
                <SidebarItem
                  title="Orders"
                  icon={
                    <ListOrdered
                      size={26}
                      fill={getIconColor("/dashboard/orders")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/orders"}
                  href="/dashboard/orders"
                />
                <SidebarItem
                  title="Payments"
                  icon={
                    <CreditCard
                      size={26}
                      fill={getIconColor("/dashboard/payments")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/payments"}
                  href="/dashboard/payments"
                />

                <SidebarItem
                  title="Products"
                  icon={
                    <PackageSearch
                      size={26}
                      fill={getIconColor("/dashboard/products")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/products"}
                  href="/dashboard/products"
                />

                <SidebarItem
                  title="Events"
                  icon={
                    <BellPlus
                      size={26}
                      fill={getIconColor("/dashboard/events")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/events"}
                  href="/dashboard/events"
                />

                <SidebarItem
                  title="Users"
                  icon={
                    <Users
                      size={26}
                      fill={getIconColor("/dashboard/users")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/users"}
                  href="/dashboard/users"
                />

                <SidebarItem
                  title="Sellers"
                  icon={
                    <Store
                      size={26}
                      fill={getIconColor("/dashboard/sellers")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/sellers"}
                  href="/dashboard/sellers"
                />
              </SideBarMenu>

              <SideBarMenu title="Controllers">
                <SidebarItem
                  title="Loggers"
                  icon={
                    <FileClock
                      size={26}
                      fill={getIconColor("/dashboard/loggers")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/loggers"}
                  href="/dashboard/loggers"
                />
                <SidebarItem
                  title="Management"
                  icon={
                    <Settings
                      size={26}
                      fill={getIconColor("/dashboard/management")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/management"}
                  href="/dashboard/management"
                />

                <SidebarItem
                  title="Notifications"
                  icon={
                    <BellRing
                      size={26}
                      fill={getIconColor("/dashboard/notifications")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/notifications"}
                  href="/dashboard/notifications"
                />
              </SideBarMenu>

              <SideBarMenu title="Customization">
                <SidebarItem
                  title="All Customization"
                  icon={
                    <PencilRuler
                      size={26}
                      fill={getIconColor("/dashboard/customization")}
                    />
                  }
                  isActive={activeSidebar === "/dashboard/customization"}
                  href="/dashboard/customization"
                />
              </SideBarMenu>

              <SideBarMenu title="Extras">
                <SidebarItem
                  title="Logout"
                  icon={
                    <LogOut
                      size={26}
                      fill={getIconColor("/logout")}
                    />
                  }
                  isActive={activeSidebar === "/logout"}
                  href="/logout"
                />
              </SideBarMenu>
            </div>
          </div>
      </Box>
    </div>
  );
};

export default SidebarWrapper;
