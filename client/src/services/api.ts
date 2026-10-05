const API_BASE_URL = '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('fitpulse_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({ message: 'Server communication error' }));

    if (!response.ok) {
      const errorMsg = data.errors && data.errors.length > 0
        ? data.errors.map((e: any) => `${e.field ? `${e.field}: ` : ''}${e.message}`).join(', ')
        : data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  }

  // --- Auth Endpoints ---
  async login(credentials: { email: string; password: string }) {
    return this.request<{ success: boolean; data: { token: string; user: any }; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(payload: { name: string; email: string; password: string; role?: string }) {
    return this.request<{ success: boolean; data: { token: string; user: any }; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMe() {
    return this.request<{ success: boolean; data: any }>('/auth/me');
  }

  async updateProfile(updates: { name?: string; email?: string; profile_image?: string }) {
    return this.request<{ success: boolean; data: any; message: string }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(passwords: { currentPassword: string; newPassword: string }) {
    return this.request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  }

  // --- Workout Endpoints ---
  async getWorkouts(params?: { type?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ success: boolean; data: { workouts: any[]; pagination: any } }>(`/workouts${qs}`);
  }

  async getWorkoutAnalytics() {
    return this.request<{ success: boolean; data: any }>('/workouts/analytics');
  }

  async createWorkout(workout: {
    type: string;
    duration_minutes: number;
    intensity: string;
    calories_burned?: number;
    date?: string;
    notes?: string;
  }) {
    return this.request<{ success: boolean; data: any; message: string }>('/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    });
  }

  async updateWorkout(id: string, workout: any) {
    return this.request<{ success: boolean; data: any; message: string }>(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workout),
    });
  }

  async deleteWorkout(id: string) {
    return this.request<{ success: boolean; message: string }>(`/workouts/${id}`, {
      method: 'DELETE',
    });
  }

  async estimateCalories(type: string, duration_minutes: number, intensity: string) {
    return this.request<{ success: boolean; data: { estimated_calories: number } }>(
      `/workouts/estimate-calories?type=${encodeURIComponent(type)}&duration_minutes=${duration_minutes}&intensity=${intensity}`
    );
  }

  // --- Challenges Endpoints ---
  async getChallenges() {
    return this.request<{ success: boolean; data: any[] }>('/challenges');
  }

  async joinChallenge(challengeId: string) {
    return this.request<{ success: boolean; data: any; message: string }>(`/challenges/${challengeId}/join`, {
      method: 'POST',
    });
  }

  async getMyChallenges() {
    return this.request<{ success: boolean; data: { active: any[]; completed: any[]; total_badges_earned: number } }>(
      '/challenges/my/progress'
    );
  }

  async createChallengeAdmin(challenge: any) {
    return this.request<{ success: boolean; data: any; message: string }>('/challenges/admin/create', {
      method: 'POST',
      body: JSON.stringify(challenge),
    });
  }

  // --- Content Endpoints ---
  async getPublicContent(category?: string, search?: string) {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (search) query.append('search', search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ success: boolean; data: any[] }>(`/content${qs}`);
  }

  async createContent(content: { title: string; description: string; category: string; media_url?: string }) {
    return this.request<{ success: boolean; data: any; message: string }>('/content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async getAllContentAdmin(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<{ success: boolean; data: any[] }>(`/content/admin/all${query}`);
  }

  async moderateContentAdmin(id: string, status: 'APPROVED' | 'REJECTED', feedback?: string) {
    return this.request<{ success: boolean; data: any; message: string }>(`/content/admin/${id}/moderate`, {
      method: 'PATCH',
      body: JSON.stringify({ status, feedback }),
    });
  }

  // --- Admin Endpoints ---
  async getAdminDashboard() {
    return this.request<{ success: boolean; data: any }>('/admin/dashboard');
  }

  async getAdminUsers(params?: { search?: string; role?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.role) query.append('role', params.role);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ success: boolean; data: { users: any[]; pagination: any } }>(`/admin/users${qs}`);
  }

  async createAdminUser(user: { name: string; email: string; password: string; role: string }) {
    return this.request<{ success: boolean; data: any; message: string }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateAdminUser(id: string, updates: { name?: string; email?: string; role?: string; is_active?: boolean }) {
    return this.request<{ success: boolean; data: any; message: string }>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteAdminUser(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getSystemSettings() {
    return this.request<{ success: boolean; data: any[] }>('/admin/settings');
  }

  async updateSystemSetting(key: string, value: string, description?: string) {
    return this.request<{ success: boolean; data: any; message: string }>(`/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value, description }),
    });
  }

  async getAuditLogs(limit = 30) {
    return this.request<{ success: boolean; data: any[] }>(`/admin/audit-logs?limit=${limit}`);
  }
}

export const api = new ApiClient();
