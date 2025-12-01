import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HelpChatbot } from "@/components/HelpChatbot";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
      <HelpChatbot />
    </div>
  );
};

export default Dashboard;
