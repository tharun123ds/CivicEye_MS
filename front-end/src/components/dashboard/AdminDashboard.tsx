import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  LogOut,
  MapPin,
  CheckCircle,
  Clock,
  Camera,
  Shield,
  Trash2,
} from "lucide-react";

interface Issue {
  _id: string;
  title: string;
  description: string;
  location: string;
  photo?: string;
  status: string;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

// ✅ API Gateway (frontend → gateway only)
const GATEWAY_URL = "http://localhost:3000";

export default function AdminDashboard({
  token,
  onLogout,
}: AdminDashboardProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ================= FETCH ALL ISSUES =================
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${GATEWAY_URL}/admin/issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setIssues(data);
      } else {
        setError(data.message || "Failed to fetch issues");
      }
    } catch {
      setError("Server error while fetching issues");
    }

    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // ================= UPDATE ISSUE STATUS =================
  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    setError("");

    try {
      const res = await fetch(`${GATEWAY_URL}/admin/issues/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to update status");
      } else {
        await fetchIssues();
      }
    } catch {
      setError("Server error while updating status");
    }

    setUpdatingId(null);
  };

  // ================= DELETE ISSUE =================
  const deleteIssue = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(`${GATEWAY_URL}/admin/issues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to delete issue");
      } else {
        await fetchIssues();
      }
    } catch {
      setError("Server error while deleting issue");
    }

    setDeletingId(null);
  };

  // ================= HELPERS =================
  const getStatusVariant = (status: string) => {
    if (status?.toLowerCase() === "resolved") return "default";
    if (status?.toLowerCase() === "pending") return "secondary";
    return "outline";
  };

  const getStatusIcon = (status: string) =>
    status?.toLowerCase() === "resolved" ? (
      <CheckCircle className="h-4 w-4" />
    ) : (
      <Clock className="h-4 w-4" />
    );

  const pendingIssues = issues.filter(
    (i) => i.status?.toLowerCase() === "pending"
  );
  const resolvedIssues = issues.filter(
    (i) => i.status?.toLowerCase() === "resolved"
  );

  // ================= ISSUE CARD =================
  const renderIssue = (issue: Issue) => (
    <Card key={issue._id} className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{issue.title}</CardTitle>
          <Badge
            variant={getStatusVariant(issue.status)}
            className="flex items-center gap-1"
          >
            {getStatusIcon(issue.status)}
            {issue.status || "Pending"}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {issue.location}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm">{issue.description}</p>

        {issue.photo && (
          <div className="relative">
            <img
              src={`${GATEWAY_URL}${issue.photo}`}
              alt="Issue"
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => updateStatus(issue._id, "Resolved")}
            disabled={updatingId === issue._id || deletingId === issue._id}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Resolve
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => updateStatus(issue._id, "Pending")}
            disabled={updatingId === issue._id || deletingId === issue._id}
          >
            <Clock className="mr-1 h-4 w-4" />
            Pending
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteIssue(issue._id)}
            disabled={deletingId === issue._id}
          >
            {deletingId === issue._id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage and resolve community issues
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* Pending Issues */}
        <h2 className="text-2xl font-semibold text-orange-600">
          Pending Issues
        </h2>

        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingIssues.map(renderIssue)}
          </div>
        )}

        <Separator />

        {/* Resolved Issues */}
        <h2 className="text-2xl font-semibold text-green-600">
          Resolved Issues
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resolvedIssues.map(renderIssue)}
        </div>
      </div>
    </div>
  );
}
