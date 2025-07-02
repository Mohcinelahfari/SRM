"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosClient from "@/lib/api/axiosClient";
import UpdateEmployeeModal from "./UpdateEmployeeModal";
import DeleteEmployeeModal from "./DeleteEmployeeModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Phone, Mail, Home, Calendar } from "lucide-react";

interface Post {
  id: string;
  title: string;
}

interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  address?: string;
  datedebut: string;
  post: Post;
}

export default function EmployeeTable({
  refreshList,
}: {
  refreshList: () => void;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get<Employee[]>("/employee");
      setEmployees(response.data);
    } catch (err) {
      setError("Impossible de charger les employés.");
      toast.error("Erreur de chargement des employés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    refreshList && fetchEmployees();
  }, [refreshList]);

  const openUpdateModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setUpdateModalOpen(true);
  };

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Badge variant="destructive" className="text-sm">
          {error}
        </Badge>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={fetchEmployees}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nom Complet</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Date d'embauche</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">
                  {emp.firstname} {emp.lastname}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{emp.email}</span>
                    </div>
                    {emp.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{emp.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {emp.address ? (
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="line-clamp-1">{emp.address}</span>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(emp.datedebut).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {emp.post?.title || "Non spécifié"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openUpdateModal(emp)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteModal(emp)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                Aucun employé trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <UpdateEmployeeModal
        employee={selectedEmployee}
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        onSuccess={() => {
          fetchEmployees();
          setUpdateModalOpen(false);
          refreshList();
        }}
      />

      <DeleteEmployeeModal
        employee={selectedEmployee}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSuccess={() => {
          fetchEmployees();
          setDeleteModalOpen(false);
          refreshList();
        }}
      />
    </>
  );
}