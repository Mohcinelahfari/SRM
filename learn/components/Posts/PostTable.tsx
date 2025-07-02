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
import { Edit, Trash2, Briefcase, Building2, Users } from 'lucide-react';
import UpdatePostModal from "./UpdatePostModel";
import DeletePostModal from "./DeletePostModel";


// Typage du modèle Post
interface Department {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  department: Department;
  departmentId: string;
  employees: Employee[];
  createdAt: string;
}

interface PostTableProps {
  onUpdate?: () => void;
}

export default function PostTable({ onUpdate }: PostTableProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchPosts = () => {
    axiosClient
      .get<Post[]>('/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error('Erreur Axios posts:', err);
        setError('Impossible de charger les postes');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setUpdateModalOpen(true);
  };

  const handleDelete = (post: Post) => {
    setSelectedPost(post);
    setDeleteModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    fetchPosts();
    setUpdateModalOpen(false);
    onUpdate?.();
  };

  const handleDeleteSuccess = () => {
    fetchPosts();
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
            <Briefcase className="w-5 h-5" />
            Postes ({posts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Titre du poste</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      Département
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      Employés
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Date création</TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs text-gray-500">
                      {post.id}
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {post.department.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {post.employees.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(post)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post)}
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

      <UpdatePostModal
        post={selectedPost}
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        onSuccess={handleUpdateSuccess}
      />

      <DeletePostModal
        post={selectedPost}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
