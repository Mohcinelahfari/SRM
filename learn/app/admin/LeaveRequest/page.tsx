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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface LeaveRequest {
  id: number;
  employee: {
    id: number;
    firstname: string;
    lastname: string;
  };
  leaveType: {
    id: number;
    name: string;
  };
  startDate: string;
  endDate: string;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface Employee {
  id: number;
  firstname: string;
  lastname: string;
}

interface LeaveType {
  id: number;
  name: string;
}

export default function LeaveRequestManager() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<LeaveRequest | null>(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "PENDING",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lrRes, empRes, ltRes] = await Promise.all([
        axiosClient.get<LeaveRequest[]>("/leaveRequests"),
        axiosClient.get<Employee[]>("/employee"),
        axiosClient.get<LeaveType[]>("/leaveTypes"),
      ]);

      setLeaveRequests(lrRes.data);
      setEmployees(empRes.data);
      setLeaveTypes(ltRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { employeeId, leaveTypeId, startDate, endDate } = formData;

    if (!employeeId || !leaveTypeId || !startDate || !endDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editing) {
        await axiosClient.put(`/leaveRequests/${editing.id}`, {
          employeeId: parseInt(formData.employeeId),
          leaveTypeId: parseInt(formData.leaveTypeId),
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          status: formData.status,
        });
        toast.success("Leave request updated");
      } else {
        await axiosClient.post("/leaveRequests", {
          employeeId: parseInt(formData.employeeId),
          leaveTypeId: parseInt(formData.leaveTypeId),
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          status: formData.status,
        });

        toast.success("Leave request created");
      }

      setFormData({
        employeeId: "",
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: "",
        status: "PENDING",
      });
      setEditing(null);
      fetchData();
    } catch(error) {
      toast.error(error.response?.data?.message);
    }
  };

  const startEdit = (lr: LeaveRequest) => {
    setEditing(lr);
    setFormData({
      employeeId: lr.employee.id.toString(),
      leaveTypeId: lr.leaveType.id.toString(),
      startDate: lr.startDate.slice(0, 10),
      endDate: lr.endDate.slice(0, 10),
      reason: lr.reason || "",
      status: lr.status,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({
      employeeId: "",
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
      status: "PENDING",
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) return;

    try {
      await axiosClient.delete(`/leaveRequests/${id}`);
      toast.success("Leave request deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete leave request");
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>

      <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded-md shadow-sm space-y-4">
        <div>
          <Label htmlFor="employeeId">Employee</Label>
          <select
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstname} {emp.lastname}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="leaveTypeId">Leave Type</Label>
          <select
            id="leaveTypeId"
            name="leaveTypeId"
            value={formData.leaveTypeId}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>
                {lt.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <Button type="submit">{editing ? "Update" : "Create"}</Button>
          {editing && (
            <Button variant="outline" onClick={cancelEdit} type="button">
              Cancel
            </Button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading leave requests...</p>
      ) : leaveRequests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.map((lr) => (
              <TableRow key={lr.id}>
                <TableCell>{lr.employee.firstname} {lr.employee.lastname}</TableCell>
                <TableCell>{lr.leaveType.name}</TableCell>
                <TableCell>{new Date(lr.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(lr.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{lr.reason || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold
                      ${lr.status === "APPROVED" ? "bg-green-100 text-green-700" : ""}
                      ${lr.status === "REJECTED" ? "bg-red-100 text-red-700" : ""}
                      ${lr.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : ""}
                    `}
                  >
                    {lr.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(lr.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(lr)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(lr.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
