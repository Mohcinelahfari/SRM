
"use client";

import axiosClient from "@/lib/api/axiosClient";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Building2, Users } from 'lucide-react';
import DeleteDepartmentModal from './DeleteDepartmentModal';
import UpdateDepartmentModal from "./DepartmentUpdateForm";

// Typage du modèle Department
interface Post {
  id: string;
  title: string;
}

interface Department {
  id: string;
  name: string;
  posts: Post[];
}

interface DepartmentTableProps {
  onUpdate?: () => void;
}

export default function DepartmentTable({ onUpdate }: DepartmentTableProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchDepartments = () => {
    axiosClient
      .get<Department[]>('/departments')
      .then((res) => setDepartments(res.data))
      .catch((err) => {
        console.error('Erreur Axios departments:', err);
        setError('Impossible de charger les départements');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setUpdateModalOpen(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setDeleteModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    fetchDepartments();
    setUpdateModalOpen(false);
    onUpdate?.();
  };

  const handleDeleteSuccess = () => {
    fetchDepartments();
    setDeleteModalOpen(false);
    onUpdate?.();
  };

  if (loading) return <p className="text-center py-4">Chargement...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Départements ({departments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nom du département</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      Postes
                    </div>
                  </TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs text-gray-500">
                      {department.id}
                    </TableCell>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {department.posts.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(department)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(department)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UpdateDepartmentModal
        department={selectedDepartment}
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        onSuccess={handleUpdateSuccess}
      />

      <DeleteDepartmentModal
        department={selectedDepartment}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
