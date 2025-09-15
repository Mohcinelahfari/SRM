"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row items-center justify-center p-6">
      {/* Left Side - Text + Card */}
      <div className="flex-1 flex justify-center items-center">
        <Card className="max-w-lg w-full shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-blue-700 flex flex-col items-center">
              Bienvenue sur le portail RH
              <span className="text-lg font-normal text-gray-600 mt-2">
                Votre espace de gestion des ressources humaines
              </span>
            </CardTitle>
            <CardDescription className="text-gray-500 mt-4">
              Gérez facilement vos <span className="font-semibold">congés</span>,  
              suivez l'état de vos <span className="font-semibold">demandes</span>,  
              et optimisez la gestion de votre équipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-6">
            <Link href="/login">
              <Button size="lg" className="px-8">
                Accéder au portail
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 justify-center items-center p-8">
        <Image
          src="/images/analyse.jpeg" // 👉 Add your own image in /public/images
          alt="RH Dashboard Illustration"
          width={500}
          height={500}
          className="object-contain drop-shadow-md"
          priority
        />
      </div>
    </div>
  );
}
