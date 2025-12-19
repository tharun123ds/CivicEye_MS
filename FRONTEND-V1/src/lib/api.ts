// API Base URL - points to API Gateway
const API_BASE_URL = 'http://localhost:8080/api';

// User API
export const userApi = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  },

  getUser: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },
};

// Complaint API
export const complaintApi = {
  create: async (data: {
    userId: number;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create complaint');
    return response.json();
  },

  getByUser: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/complaints/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch complaints');
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/complaints`);
    if (!response.ok) throw new Error('Failed to fetch complaints');
    return response.json();
  },

  updateStatus: async (id: number, status: string) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
  },
};

// Media API
export const mediaApi = {
  upload: async (file: File, complaintId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('complaintId', complaintId.toString());

    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  },

  getByComplaint: async (complaintId: number) => {
    const response = await fetch(`${API_BASE_URL}/media/complaint/${complaintId}`);
    if (!response.ok) throw new Error('Failed to fetch media');
    return response.json();
  },

  download: async (mediaId: number) => {
    return `${API_BASE_URL}/media/${mediaId}/download`;
  },
};

// Notification API
export const notificationApi = {
  getByUser: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  markAsRead: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to mark as read');
    return response.json();
  },
};
