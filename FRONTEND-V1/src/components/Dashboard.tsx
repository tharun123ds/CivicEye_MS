import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { complaintApi, mediaApi, notificationApi } from '@/lib/api';
import { LogOut, Plus, Bell, MapPin, Loader2 } from 'lucide-react';

interface DashboardProps {
    user: any;
    onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'create' | 'complaints' | 'notifications'>('create');
    const [complaints, setComplaints] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Complaint form state
    const [complaintForm, setComplaintForm] = useState({
        title: '',
        description: '',
        category: 'POTHOLE',
        address: '',
        latitude: '',
        longitude: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (activeTab === 'complaints') {
            loadComplaints();
        } else if (activeTab === 'notifications') {
            loadNotifications();
        }
    }, [activeTab]);

    const loadComplaints = async () => {
        try {
            const data = await complaintApi.getByUser(user.id);
            setComplaints(data);
        } catch (err: any) {
            setError('Failed to load complaints');
        }
    };

    const loadNotifications = async () => {
        try {
            const data = await notificationApi.getByUser(user.id);
            setNotifications(data);
        } catch (err: any) {
            setError('Failed to load notifications');
        }
    };

    const handleComplaintSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Create complaint
            const complaint = await complaintApi.create({
                userId: user.id,
                title: complaintForm.title,
                description: complaintForm.description,
                category: complaintForm.category,
                address: complaintForm.address,
                latitude: parseFloat(complaintForm.latitude),
                longitude: parseFloat(complaintForm.longitude),
            });

            // Upload image if selected
            if (selectedFile) {
                await mediaApi.upload(selectedFile, complaint.id);
            }

            setSuccess('Complaint submitted successfully!');
            setComplaintForm({
                title: '',
                description: '',
                category: 'POTHOLE',
                address: '',
                latitude: '',
                longitude: '',
            });
            setSelectedFile(null);

            // Reload complaints
            if (activeTab === 'complaints') {
                loadComplaints();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['POTHOLE', 'ROAD_DAMAGE', 'STREET_LIGHT', 'DRAINAGE', 'GARBAGE', 'OTHER'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            Civic Eye
                        </h1>
                        <p className="text-sm text-muted-foreground">Welcome, {user.username}</p>
                    </div>
                    <Button variant="outline" onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={activeTab === 'create' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('create')}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Complaint
                    </Button>
                    <Button
                        variant={activeTab === 'complaints' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('complaints')}
                    >
                        <MapPin className="mr-2 h-4 w-4" />
                        My Complaints
                    </Button>
                    <Button
                        variant={activeTab === 'notifications' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                    </Button>
                </div>

                {/* Create Complaint Tab */}
                {activeTab === 'create' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Report an Issue</CardTitle>
                            <CardDescription>
                                Help improve your community by reporting infrastructure issues
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleComplaintSubmit} className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {success && (
                                    <Alert>
                                        <AlertDescription>{success}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Brief description"
                                            value={complaintForm.title}
                                            onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <select
                                            id="category"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                            value={complaintForm.category}
                                            onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                                            disabled={loading}
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Detailed description of the issue"
                                        value={complaintForm.description}
                                        onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                                        required
                                        disabled={loading}
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="Location of the issue"
                                        value={complaintForm.address}
                                        onChange={(e) => setComplaintForm({ ...complaintForm, address: e.target.value })}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="latitude">Latitude</Label>
                                        <Input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            placeholder="12.9716"
                                            value={complaintForm.latitude}
                                            onChange={(e) => setComplaintForm({ ...complaintForm, latitude: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">Longitude</Label>
                                        <Input
                                            id="longitude"
                                            type="number"
                                            step="any"
                                            placeholder="77.5946"
                                            value={complaintForm.longitude}
                                            onChange={(e) => setComplaintForm({ ...complaintForm, longitude: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Upload Image (Optional)</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        disabled={loading}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? 'Submitting...' : 'Submit Complaint'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* My Complaints Tab */}
                {activeTab === 'complaints' && (
                    <div className="space-y-4">
                        {complaints.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No complaints yet. Create your first complaint to get started!
                                </CardContent>
                            </Card>
                        ) : (
                            complaints.map((complaint) => (
                                <Card key={complaint.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{complaint.title}</CardTitle>
                                                <CardDescription>{complaint.category}</CardDescription>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                    complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {complaint.status}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                                        <p className="text-xs text-muted-foreground flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {complaint.address}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="space-y-4">
                        {notifications.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No notifications yet.
                                </CardContent>
                            </Card>
                        ) : (
                            notifications.map((notification) => (
                                <Card key={notification.id} className={!notification.isRead ? 'border-blue-500' : ''}>
                                    <CardContent className="py-4">
                                        <p className="text-sm">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
