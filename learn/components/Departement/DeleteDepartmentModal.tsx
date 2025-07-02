import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import axiosClient from "@/lib/api/axiosClient";

interface Department {
  id: string;
  name: string;
  posts: any[];
}

interface DeleteDepartmentModalProps {
  department: Department | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DeleteDepartmentModal({
  department,
  open,
  onOpenChange,
  onSuccess
}: DeleteDepartmentModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (department) {
      setLoading(true);
      
      try {
        await axiosClient.delete(`/departments/${department.id}`);
        toast.success('Département supprimé avec succès');
        onSuccess?.();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Le département "{department?.name}" sera
            définitivement supprimé avec tous ses postes associés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
