import LoginForm from "@/components/login/LoginForm";
import Image from "next/image";
import React from "react";

function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-100 relative">
        <Image
          src="/images/logofd.jpeg" // 👉 Replace with your own image in /public/images/
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
 
      </div>

      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Connexion
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Entrez vos identifiants pour continuer
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
