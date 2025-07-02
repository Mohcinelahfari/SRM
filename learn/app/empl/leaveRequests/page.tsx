"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/api/axiosClient";
import { toast } from "sonner";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Button 
} from "@/components/ui/button";
import { 
  CalendarDays, 
  ClipboardList, 
  Clock,
  CheckCircle2, 
  XCircle,
  Plus,
  Filter,
  ChevronDown,
  ChevronUp,
  Search
} from "lucide-react";
import { 
  Skeleton 
} from "@/components/ui/skeleton";
import { 
  Input 
} from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface MyRequest {
  id: number;
  leaveType: { name: string };
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function MyLeaveRequestsPage() {
  const [requests, setRequests] = useState<MyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<{key: string; direction: string} | null>(null);

  useEffect(() => {
    axiosClient.get<MyRequest[]>("/leaveRequests/me", { withCredentials: true })
      .then(res => setRequests(res.data))
      .catch(err => {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load requests");
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredRequests = requests
    .filter(request => 
      request.leaveType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.reason && request.reason.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(request => 
      statusFilter === "ALL" || request.status === statusFilter
    );

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key as keyof MyRequest] < b[sortConfig.key as keyof MyRequest]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof MyRequest] > b[sortConfig.key as keyof MyRequest]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="ml-1 h-3 w-3" /> : 
      <ChevronDown className="ml-1 h-3 w-3" />;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="h-5 w-5" />
              My Leave Requests
            </CardTitle>

          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sortedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <ClipboardList className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <h3 className="text-lg font-medium">No requests found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== "ALL" 
                    ? "Try adjusting your search or filter" 
                    : "You haven't made any leave requests yet"}
                </p>
              </div>

            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => requestSort('leaveType.name')}
                  >
                    <div className="flex items-center">
                      Type
                      {getSortIcon('leaveType.name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => requestSort('startDate')}
                  >
                    <div className="flex items-center">
                      Dates
                      {getSortIcon('startDate')}
                    </div>
                  </TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => requestSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Requested
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRequests.map(request => (
                  <TableRow key={request.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">
                      {request.leaveType.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span>{formatDate(request.startDate)}</span>
                          <span className="text-xs text-muted-foreground">
                            to {formatDate(request.endDate)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {request.days} day{request.days !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="line-clamp-1 max-w-[200px]">
                            {request.reason || "-"}
                          </span>
                        </TooltipTrigger>
                        {request.reason && (
                          <TooltipContent>
                            <p className="max-w-[300px] break-words">
                              {request.reason}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      {formatDate(request.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{sortedRequests.length}</span> of{' '}
            <span className="font-medium">{requests.length}</span> requests
          </div>
          {/* Pagination would go here */}
        </CardFooter>
      </Card>
    </div>
  );
}