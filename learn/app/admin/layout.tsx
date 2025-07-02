import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../../components/app-sidebar"
import AdminHeader from "./AdminHeader"
import { Toaster } from "@/components/ui/sonner"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
export default function Layout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("jwtToken")?.value;
  if (!token) {
    return redirect("/login");
  }

  // 2) Verify and decode
  let payload: any;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return redirect("/login");
  }

  // 3) Only allow isAdmin = true
  if (!payload.isAdmin) {
    return redirect("/empl");
  }
  return (
    <>
    <AdminHeader />
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
    
    </>
    
  )
}