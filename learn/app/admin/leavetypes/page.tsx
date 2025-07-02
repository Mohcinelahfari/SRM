"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/lib/api/axiosClient";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LeaveType {
  id: number;
  name: string;
  maxDays: number;
  carryForward: boolean;
  createdAt: string;
}

export default function LeaveTypeManager() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveType | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    maxDays: "", 
    carryForward: false 
  });

  const fetchLeaveTypes = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get<LeaveType[]>("/leaveTypes");
      setLeaveTypes(res.data);
    } catch {
      toast.error("Failed to load leave types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.maxDays) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        maxDays: parseInt(formData.maxDays),
        carryForward: formData.carryForward,
      };

      if (editing) {
        await axiosClient.put(`/leaveTypes/${editing.id}`, payload);
        toast.success("Leave type updated successfully");
      } else {
        await axiosClient.post("/leaveTypes", payload);
        toast.success("Leave type created successfully");
      }

      setFormData({ name: "", maxDays: "", carryForward: false });
      setEditing(null);
      setDialogOpen(false);
      fetchLeaveTypes();
    } catch {
      toast.error("Failed to save leave type");
    }
  };

  const openCreateDialog = () => {
    setEditing(null);
    setFormData({ name: "", maxDays: "", carryForward: false });
    setDialogOpen(true);
  };

  const openEditDialog = (leaveType: LeaveType) => {
    setEditing(leaveType);
    setFormData({
      name: leaveType.name,
      maxDays: leaveType.maxDays.toString(),
      carryForward: leaveType.carryForward,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/leaveTypes/${id}`);
      toast.success("Leave type deleted");
      fetchLeaveTypes();
    } catch {
      toast.error("Failed to delete leave type");
    }
  };

  return (
    <div className="container mx-5 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Type Management</h1>
          <p className="text-muted-foreground mt-1">
            Configure your organization's leave policies
          </p>
        </div>
        
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Leave Type
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={handleSubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {editing ? "Edit Leave Type" : "Create New Leave Type"}
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Leave Type Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Annual Leave"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Maximum Days
                    </label>
                    <Input
                      name="maxDays"
                      type="number"
                      min="0"
                      value={formData.maxDays}
                      onChange={handleChange}
                      placeholder="e.g. 20"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="carryForward"
                      name="carryForward"
                      checked={formData.carryForward}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, carryForward: Boolean(checked)})
                      }
                    />
                    <label htmlFor="carryForward" className="text-sm font-medium leading-none">
                      Allow carry forward to next year
                    </label>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">
                  {editing ? "Update" : "Create"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Leave Types</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : leaveTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No leave types configured yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead className="text-right">Max Days</TableHead>
                  <TableHead>Carry Forward</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes.map((lt) => (
                  <TableRow key={lt.id}>
                    <TableCell className="font-medium">{lt.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{lt.maxDays} days</Badge>
                    </TableCell>
                    <TableCell>
                      {lt.carryForward ? (
                        <Badge className="gap-1">
                          Allowed
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Allowed</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(lt.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(lt)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the leave type.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(lt.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}