"use client";
import axiosClient from "@/lib/api/axiosClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MySalairesPage() {
  const [salaires, setSalaires] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMySalaires = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/salaires"); // <-- API you just created
      setSalaires(res.data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Impossible de récupérer vos salaires");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySalaires();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Mes Salaires
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : salaires.length === 0 ? (
        <p className="text-center text-gray-600">
          Aucun salaire trouvé pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {salaires.map((s) => (
            <li
              key={s.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg text-blue-600">
                  💰 {s.amount} MAD
                </p>
                <p className="text-sm text-gray-500">
                  {s.employee?.firstname} {s.employee?.lastname}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(s.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
