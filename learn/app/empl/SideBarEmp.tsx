"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  CalendarDays, 
  ClipboardList, 
  User, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/employee/dashboard", icon: Home },
    { name: "Leaves", href: "/employee/leaves", icon: CalendarDays },
    { name: "Requests", href: "/employee/requests", icon: ClipboardList },
    { name: "Profile", href: "/employee/profile", icon: User },
    { name: "Settings", href: "/employee/settings", icon: Settings },
  ];

  return (
    <div className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 border-r bg-white">
      <div className="flex items-center h-16 px-6 border-b">
        <h1 className="text-xl font-bold text-primary">WorkSpace</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}