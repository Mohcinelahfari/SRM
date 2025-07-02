"use client";

import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/api/axiosClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, LayoutDashboard, Users } from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosClient.get("/user/logout");
      router.push("/");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold md:text-xl">Admin Dashboard</h1>
          
          {/* Navigation pour desktop */}
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/admin/"
              className="flex items-center transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/employees"
              className="flex items-center transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Link>
          </nav>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin/" className="w-full">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/emplyee" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bouton logout pour desktop */}
        <div className="hidden md:block">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}