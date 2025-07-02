"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import axiosClient from "@/lib/api/axiosClient";

interface Employee {
  id: number;
  firstname: string;
  lastname: string;
}

interface DeleteEmployeeModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DeleteEmployeeModal({
  employee,
  open,
  onOpenChange,
  onSuccess,
}: DeleteEmployeeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!employee) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosClient.delete(`/employee/${employee.id}`);
      toast.success(`Employé ${employee.firstname} ${employee.lastname} supprimé`);
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'employé");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Supprimer l'employé
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong>{employee.firstname} {employee.lastname}</strong> ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
