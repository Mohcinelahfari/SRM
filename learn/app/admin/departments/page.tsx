
"use client";

import DepartmentTable from '@/components/Departement/DepartementTable';
import CreateDepartmentModal from '@/components/Departement/CreateDepartmentModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { useState } from 'react';


export default function DepartmentPage() {
    const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            Gestion des Départements
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les départements de votre organisation et leurs postes associés.
          </p>
        </div>
        <CreateDepartmentModal onSuccess={handleSuccess} />
      </div>

      {/* Table */}
      <DepartmentTable key={refreshKey} onUpdate={handleSuccess} />
    </div>
  );
}
