"use client";

import { useState, useEffect } from "react";
import axiosClient from "@/lib/api/axiosClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Department {
  id: string;
  name: string;
}

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState<string | undefined>(undefined);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch departments for dropdown
  useEffect(() => {
    axiosClient
      .get<Department[]>("/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => {
        console.error("Failed to load departments:", err);
        toast.error("Impossible de charger les départements");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !departmentId) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post("/posts", { title, departmentId });
      toast.success(`Poste "${res.data.title}" créé avec succès`);
      setTitle("");
      setDepartmentId(undefined);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erreur lors de la création"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div>
            <Label htmlFor="title">Titre du poste</Label>
            <Input
              id="title"
              placeholder="Entrez le titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Sélect département */}
          <div>
            <Label htmlFor="department">Département</Label>
            <Select
              id="department"                // ← correspond au htmlFor ci‑dessus
              value={departmentId}
              onValueChange={(val) => setDepartmentId(val || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un département" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Bouton soumission */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Création..." : "Créer poste"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
