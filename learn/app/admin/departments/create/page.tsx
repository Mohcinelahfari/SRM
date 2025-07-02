// app/dashboard/departments/page.tsx

import CreateDepartmentModal from "@/components/Departement/CreateDepartmentModal";


export default function DepartmentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Créer un Département</h1>
      <CreateDepartmentModal />
    </div>
  )
}
