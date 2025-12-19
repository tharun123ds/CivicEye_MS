import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  LogOut,
  MapPin,
  FileText,
  Camera,
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

interface UserDashboardProps {
  token: string;
  onLogout: () => void;
}

// ✅ API Gateway base URL (FINAL & CORRECT)
const GATEWAY_URL = "http://localhost:3000";

export default function UserDashboard({ token, onLogout }: UserDashboardProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    photo: null as File | null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  // ================= FETCH USER ISSUES =================
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${GATEWAY_URL}/issues`, {
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

  // ================= CREATE ISSUE =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      if (form.photo) formData.append("photo", form.photo);

      const res = await fetch(`${GATEWAY_URL}/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setIssues((prev) => [data, ...prev]);
        setForm({ title: "", description: "", location: "", photo: null });
        setSuccess("Issue reported successfully!");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.message || "Failed to create issue");
      }
    } catch {
      setError("Server error while creating issue");
    }

    setSubmitting(false);
  };

  // ================= DELETE ISSUE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;

    try {
      setDeletingIds((prev) => [...prev, id]);

      const res = await fetch(`${GATEWAY_URL}/issues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIssues((prev) => prev.filter((i) => i._id !== id));
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete issue");
      }
    } catch {
      setError("Server error while deleting issue");
    } finally {
      setDeletingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // ================= HELPERS =================
  const getStatusVariant = (status: string) => {
    if (status?.toLowerCase() === "resolved") return "default";
    if (status?.toLowerCase() === "pending") return "secondary";
    return "outline";
  };

  const pendingIssues = issues.filter(
    (i) => i.status?.toLowerCase() === "pending"
  );
  const resolvedIssues = issues.filter(
    (i) => i.status?.toLowerCase() === "resolved"
  );

  // ================= ISSUE CARD =================
  const renderIssue = (issue: Issue) => (
    <Card key={issue._id}>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{issue.title}</CardTitle>
          <Badge variant={getStatusVariant(issue.status)}>
            {issue.status || "Pending"}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {issue.location}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p>{issue.description}</p>

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

        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(issue._id)}
          disabled={deletingIds.includes(issue._id)}
        >
          {deletingIds.includes(issue._id) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Report and track community issues
            </p>
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

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Report Issue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report New Issue
            </CardTitle>
            <CardDescription>
              Help improve your community by reporting issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Photo (optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      photo: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitting ? "Reporting..." : "Report Issue"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator />

        {/* Pending Issues */}
        <h2 className="text-2xl font-semibold text-orange-600">
          Pending Issues
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingIssues.map(renderIssue)}
        </div>

        <Separator />

        {/* Resolved Issues */}
        <h2 className="text-2xl font-semibold text-green-600">
          Resolved Issues
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resolvedIssues.map(renderIssue)}
        </div>
      </div>
    </div>
  );
}
