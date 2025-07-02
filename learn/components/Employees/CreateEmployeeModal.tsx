"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axiosClient from "@/lib/api/axiosClient";

interface Post {
  id: string;
  title: string;
}

interface CreateEmployeeModalProps {
  onSuccess?: () => void;
}

export default function CreateEmployeeModal({ onSuccess }: CreateEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [postId, setPostId] = useState("");
  const [datedebut, setDatedebut] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPosts();
    }
  }, [open]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await axiosClient.get<Post[]>("/posts");
      setPosts(response.data);
    } catch (error) {
      toast.error("Impossible de charger les postes");
    } finally {
      setLoadingPosts(false);
    }
  };

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPassword("");
    setPostId("");
    setDatedebut("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !firstname.trim() ||
      !lastname.trim() ||
      !email.trim() ||
      !password ||
      !postId ||
      !datedebut
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/employee", {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
        password : password.trim() ||  null,
        postId: parseInt(postId),
        datedebut,
      });

      toast.success("Employé créé avec succès");
      resetForm();
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button>Nouveau Employé</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouvel employé</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire pour ajouter un employé.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="firstname">Prénom *</Label>
            <Input
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="lastname">Nom *</Label>
            <Input
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optionnel"
            />
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Optionnel"
            />
          </div>

          <div>
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 6 caractères"
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="post">Poste *</Label>
            <Select value={postId} onValueChange={setPostId} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un poste" />
              </SelectTrigger>
              <SelectContent>
                {loadingPosts ? (
                  <SelectItem value="loading" disabled>
                    Chargement...
                  </SelectItem>
                ) : (
                  posts.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="datedebut">Date début *</Label>
            <Input
              type="date"
              id="datedebut"
              value={datedebut}
              onChange={(e) => setDatedebut(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
