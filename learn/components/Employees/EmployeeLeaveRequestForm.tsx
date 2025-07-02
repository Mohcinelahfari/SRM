"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/lib/api/axiosClient";
import { toast } from "sonner";
import { CalendarDays, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LeaveType {
  id: number;
  name: string;
}

export default function EmployeeLeaveRequestForm() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    leaveType: false,
    startDate: false,
    endDate: false,
  });

  useEffect(() => {
    axiosClient
      .get<LeaveType[]>("/leaveTypes", { withCredentials: true })
      .then((res) => setLeaveTypes(res.data))
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load leave types");
      });
  }, []);

  const validateDates = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("End date must be after start date");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const errors = {
      leaveType: !leaveTypeId,
      startDate: !startDate,
      endDate: !endDate,
    };

    setFormErrors(errors);

    if (Object.values(errors).some(Boolean) || !validateDates()) {
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post(
        "/employerequest",
        {
          leaveTypeId: parseInt(leaveTypeId),
          startDate,
          endDate,
          reason,
        },
        { withCredentials: true }
      );

      toast.success("Leave request submitted successfully!");
      resetForm();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Server error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLeaveTypeId("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setFormErrors({
      leaveType: false,
      startDate: false,
      endDate: false,
    });
  };

  return (
    <Card className="max-w-2xl mx-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          New Leave Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leave Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={leaveTypeId}
                onValueChange={setLeaveTypeId}
                disabled={loading}
              >
                <SelectTrigger className={formErrors.leaveType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select leave type">
                    {leaveTypes.find((lt) => lt.id.toString() === leaveTypeId)?.name || "Select leave type"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((lt) => (
                    <SelectItem key={lt.id} value={lt.id.toString()}>
                      {lt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.leaveType && (
                <p className="text-sm text-red-500">Please select a leave type</p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={formErrors.startDate ? "border-red-500" : ""}
                disabled={loading}
              />
              {formErrors.startDate && (
                <p className="text-sm text-red-500">Please select a start date</p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                End Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={formErrors.endDate ? "border-red-500" : ""}
                disabled={loading}
                min={startDate}
              />
              {formErrors.endDate && (
                <p className="text-sm text-red-500">Please select an end date</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Reason (Optional)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave (optional)"
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}