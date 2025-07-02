"use client";

import CreatePostModal from '@/components/Posts/CreatePostModel';
import PostTable from '@/components/Posts/PostTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

import { useState } from 'react';

export default function PostPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            Gestion des Postes
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les postes de votre organisation et leurs départements associés.
          </p>
        </div>
        <CreatePostModal onSuccess={handleSuccess} />
      </div>

      {/* Table */}
      <PostTable key={refreshKey} onUpdate={handleSuccess} />
    </div>
  );
}
