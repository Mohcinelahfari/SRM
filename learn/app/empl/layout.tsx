import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../../components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { AppSidebarEmp } from "@/components/app-sidebarEmp";
import AdminHeader from "../admin/AdminHeader";
export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
    <AdminHeader />
    <SidebarProvider>
      <AppSidebarEmp />
      <main className="container mx-auto px-4 py-8">
        <SidebarTrigger />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
    
    </>
    
  )
}