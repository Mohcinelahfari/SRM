"use client";
import axiosClient from "@/lib/api/axiosClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SalairesPage() {
  const [salaires, setSalaires] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch salaires
  const fetchSalaires = async () => {
    try {
      const res = await fetch("/api/salaires");
      const data = await res.json();
      setSalaires(data);
    } catch (err) {
      toast.error("Erreur de chargement des salaires");
    }
  };

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/employee");
      setEmployees(response.data);
    } catch (err) {
      toast.error("Impossible de charger les employés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaires();
    fetchEmployees();
  }, []);

  // Add or Update salaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/salaires/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amount),
            employeeId: Number(employeeId),
          }),
        });
        toast.success("Salaire mis à jour avec succès ✅");
      } else {
        await fetch("/api/salaires", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amount),
            employeeId: Number(employeeId),
          }),
        });
        toast.success("Salaire ajouté avec succès ✅");
      }
      setAmount("");
      setEmployeeId("");
      setEditingId(null);
      fetchSalaires();
    } catch (err) {
      toast.error("Erreur lors de l’enregistrement");
    }
  };

  // Edit salaire
  const handleEdit = (salaire: any) => {
    setAmount(salaire.amount);
    setEmployeeId(salaire.employeeId);
    setEditingId(salaire.id);
    toast.info("Mode édition activé ✏️");
  };

  // Delete salaire
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce salaire ?")) return;
    try {
      await fetch(`/api/salaires/${id}`, { method: "DELETE" });
      toast.success("Salaire supprimé 🗑️");
      fetchSalaires();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        💼 Gestion des Salaires
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-xl p-5 mb-8"
      >
        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">-- Sélectionner un employé --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstname} {emp.lastname}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded w-full"
          >
            {editingId ? "Mettre à jour" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setAmount("");
                setEmployeeId("");
              }}
              className="bg-gray-500 hover:bg-gray-600 transition text-white px-4 py-2 rounded w-full"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="grid gap-4">
        {salaires.map((s) => (
          <div
            key={s.id}
            className="border shadow-sm p-4 rounded-lg bg-white flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <p className="text-lg font-semibold">
                💰 {s.amount} MAD
              </p>
              <p className="text-sm text-gray-600">
                👤 {s.employee?.firstname} {s.employee?.lastname}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(s)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
