"use client";

import CreateEmployeeModal from "@/components/Employees/CreateEmployeeModal";
import EmployeeTable from "@/components/Employees/EmployeeTable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function EmployeePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Employés</h1>
          <p className="text-muted-foreground mt-1">
            Gérer les informations de votre équipe
          </p>
        </div>
      <CreateEmployeeModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => {
          setCreateModalOpen(false);
          handleRefresh();
        }}
      />
      </div>

      <Card className="p-6">
        <EmployeeTable key={refreshKey} refreshList={handleRefresh} />
      </Card>


    </div>
  );
}