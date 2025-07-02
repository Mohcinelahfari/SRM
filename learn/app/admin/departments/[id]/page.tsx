import DepartmentUpdateForm from "@/components/Departement/DepartmentUpdateForm"
import axiosClient from "@/lib/api/axiosClient"
import { cookies } from "next/headers"

export default async function EditDepartmentPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const cookieStore = cookies()

  try {
    const res = await axiosClient.get(`/departments/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })

    const department = res.data

    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Modifier le département</h1>
        <DepartmentUpdateForm id={department.id} initialName={department.name} />
      </div>
    )
  } catch (error: any) {
    console.error("Erreur lors de la récupération du département :", error.message)
    throw new Error("Non autorisé ou département introuvable")
  }
}
