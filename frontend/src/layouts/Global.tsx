import { DashboardNav } from "@/components/DashboardNav";
import { MainNav } from "@/components/MainNav";
import { SiteFooter } from "@/components/SiteFooter";
import { dashboardConfig } from "@/config/dashboard";
import { Box, Cuboid, Server } from "lucide-react";
import React from "react";
import { Outlet } from "react-router-dom";

interface GlobalLayoutProps {}

const Global: React.FC<GlobalLayoutProps> = () => {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
};

export default Global;
