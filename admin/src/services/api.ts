// admin/src/services/api.ts
import { Category, Chapter, Subtopic, Document, AppSettings, AdminStats, User } from '../types';

const API_BASE = '/api';

class ApiService {
  private token: string | null = localStorage.getItem('telugu_admin_token');

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('telugu_admin_token', token);
    } else {
      localStorage.removeItem('telugu_admin_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(isFormData = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(isFormData),
        ...(options.headers || {})
      }
    });

    if (res.status === 401) {
      this.setToken(null);
      window.dispatchEvent(new Event('auth_unauthorized'));
      throw new Error('Unauthorized or session expired');
    }

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }

    return data;
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await this.request<{ success: boolean; token: string; user: User }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(res.token);
    return res;
  }

  async getStats(): Promise<AdminStats> {
    const res = await this.request<{ success: boolean; data: AdminStats }>('/admin/stats');
    return res.data;
  }

  // Categories
  async getCategories(all = true): Promise<Category[]> {
    const res = await this.request<{ success: boolean; data: Category[] }>(`/categories?all=${all}`);
    return res.data;
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await this.request<{ success: boolean; data: Category }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const res = await this.request<{ success: boolean; data: Category }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  async reorderCategories(orders: { id: number; display_order: number }[]): Promise<void> {
    await this.request('/categories/reorder', {
      method: 'POST',
      body: JSON.stringify({ orders })
    });
  }

  // Chapters
  async getChapters(categoryId?: number, all = true): Promise<Chapter[]> {
    const q = new URLSearchParams();
    if (categoryId) q.append('category_id', categoryId.toString());
    if (all) q.append('all', 'true');
    const res = await this.request<{ success: boolean; data: Chapter[] }>(`/chapters?${q.toString()}`);
    return res.data;
  }

  async createChapter(data: Partial<Chapter>): Promise<Chapter> {
    const res = await this.request<{ success: boolean; data: Chapter }>('/chapters', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async updateChapter(id: number, data: Partial<Chapter>): Promise<Chapter> {
    const res = await this.request<{ success: boolean; data: Chapter }>(`/chapters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async deleteChapter(id: number): Promise<void> {
    await this.request(`/chapters/${id}`, { method: 'DELETE' });
  }

  async reorderChapters(orders: { id: number; display_order: number }[]): Promise<void> {
    await this.request('/chapters/reorder', {
      method: 'POST',
      body: JSON.stringify({ orders })
    });
  }

  // Subtopics
  async getSubtopics(chapterId?: number, all = true): Promise<Subtopic[]> {
    const q = new URLSearchParams();
    if (chapterId) q.append('chapter_id', chapterId.toString());
    if (all) q.append('all', 'true');
    const res = await this.request<{ success: boolean; data: Subtopic[] }>(`/subtopics?${q.toString()}`);
    return res.data;
  }

  async createSubtopic(data: Partial<Subtopic>): Promise<Subtopic> {
    const res = await this.request<{ success: boolean; data: Subtopic }>('/subtopics', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async updateSubtopic(id: number, data: Partial<Subtopic>): Promise<Subtopic> {
    const res = await this.request<{ success: boolean; data: Subtopic }>(`/subtopics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async deleteSubtopic(id: number): Promise<void> {
    await this.request(`/subtopics/${id}`, { method: 'DELETE' });
  }

  async reorderSubtopics(orders: { id: number; display_order: number }[]): Promise<void> {
    await this.request('/subtopics/reorder', {
      method: 'POST',
      body: JSON.stringify({ orders })
    });
  }

  // Documents
  async getDocuments(subtopicId?: number, all = true): Promise<Document[]> {
    const q = new URLSearchParams();
    if (subtopicId) q.append('subtopic_id', subtopicId.toString());
    if (all) q.append('all', 'true');
    const res = await this.request<{ success: boolean; data: Document[] }>(`/documents?${q.toString()}`);
    return res.data;
  }

  async uploadDocument(formData: FormData): Promise<Document> {
    const res = await this.request<{ success: boolean; data: Document }>('/documents/upload', {
      method: 'POST',
      body: formData
    });
    return res.data;
  }

  async updateDocument(id: number, data: Partial<Document>): Promise<Document> {
    const res = await this.request<{ success: boolean; data: Document }>(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  }

  async deleteDocument(id: number): Promise<void> {
    await this.request(`/documents/${id}`, { method: 'DELETE' });
  }

  // Settings
  async getSettings(): Promise<AppSettings> {
    const res = await this.request<{ success: boolean; data: AppSettings }>('/settings');
    return res.data;
  }

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const res = await this.request<{ success: boolean; data: AppSettings }>('/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
    return res.data;
  }

  async uploadBackground(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('background_image', file);
    const res = await this.request<{ success: boolean; background_image: string }>('/settings/upload-background', {
      method: 'POST',
      body: formData
    });
    return res.background_image;
  }

  getDocumentStreamUrl(id: number): string {
    return `${API_BASE}/documents/${id}/stream`;
  }

  getDocumentViewUrl(id: number): string {
    return `${API_BASE}/documents/${id}/view`;
  }
}

export const api = new ApiService();
