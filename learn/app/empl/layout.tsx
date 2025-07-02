import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../../components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { AppSidebarEmp } from "@/components/app-sidebarEmp";
export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
    <SidebarProvider>
      <AppSidebarEmp />
      <main>
        <SidebarTrigger />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
    
    </>
    
  )
}