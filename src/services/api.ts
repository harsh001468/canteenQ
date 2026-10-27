import {
  User,
  FoodItem,
  Order,
  TimetableEntry,
  CollegeEvent,
  CrowdPredictionResponse,
  DashboardAnalytics,
  AppNotification,
  HistoricalStats,
  OrderStatus,
} from '../types.ts';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(email: string): Promise<{ success: boolean; token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to login');
    }
    return res.json();
  },

  async register(data: Partial<User>): Promise<{ success: boolean; token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`);
    const data = await res.json();
    return data.user;
  },

  // Menu
  async getMenu(): Promise<FoodItem[]> {
    const res = await fetch(`${API_BASE}/menu`);
    return res.json();
  },

  async addMenuItem(item: Partial<FoodItem>): Promise<FoodItem> {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },

  async updateMenuItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem> {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async toggleItemStock(id: string): Promise<{ success: boolean; item: FoodItem }> {
    const res = await fetch(`${API_BASE}/menu/${id}/toggle-stock`, { method: 'PUT' });
    return res.json();
  },

  // Orders
  async getOrders(userId?: string, role?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (role) params.append('role', role);
    const res = await fetch(`${API_BASE}/orders?${params.toString()}`);
    return res.json();
  },

  async createOrder(orderData: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async cancelOrder(id: string): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Predictions
  async getCrowdPredictions(): Promise<CrowdPredictionResponse> {
    const res = await fetch(`${API_BASE}/predictions/crowd`);
    return res.json();
  },

  async getStudentRecommendation(studentId?: string, department?: string): Promise<{
    recommendedSlot: string;
    crowdPercentage: number;
    waitMinutes: number;
    reason: string;
    alternateSlot: string;
    classContext: string;
    studentRecommendationText: string;
  }> {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (department) params.append('department', department);
    const res = await fetch(`${API_BASE}/predictions/recommendation?${params.toString()}`);
    return res.json();
  },

  // Timetable
  async getTimetable(): Promise<TimetableEntry[]> {
    const res = await fetch(`${API_BASE}/timetable`);
    return res.json();
  },

  async addTimetableEntry(entry: Partial<TimetableEntry>): Promise<TimetableEntry> {
    const res = await fetch(`${API_BASE}/timetable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return res.json();
  },

  async deleteTimetableEntry(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/timetable/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Events
  async getEvents(): Promise<CollegeEvent[]> {
    const res = await fetch(`${API_BASE}/events`);
    return res.json();
  },

  async addEvent(event: Partial<CollegeEvent>): Promise<CollegeEvent> {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return res.json();
  },

  async toggleEvent(id: string): Promise<{ success: boolean; event: CollegeEvent }> {
    const res = await fetch(`${API_BASE}/events/${id}/toggle`, { method: 'PUT' });
    return res.json();
  },

  // Analytics
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    return res.json();
  },

  async getForecastAccuracy(): Promise<{
    comparison: { item: string; predicted: number; actual: number; error: number }[];
    stats: HistoricalStats;
    mape: number;
    mae: number;
    rmse: number;
  }> {
    const res = await fetch(`${API_BASE}/analytics/forecast`);
    return res.json();
  },

  // Historical CSV Upload
  async getHistoricalStats(): Promise<HistoricalStats> {
    const res = await fetch(`${API_BASE}/historical/stats`);
    return res.json();
  },

  async uploadHistoricalCSV(csvContent: string): Promise<{ success: boolean; message: string; stats: HistoricalStats }> {
    const res = await fetch(`${API_BASE}/historical/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvContent }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload CSV');
    }
    return res.json();
  },

  // Gemini AI Operations Assistant
  async getGeminiInsights(query?: string): Promise<{
    insights: string[];
    actionableDirectives: string[];
    batchFryerSchedule: { time: string; item: string; batchQuantity: number; reason: string }[];
    eventImpactAnalysis: string;
  }> {
    const res = await fetch(`${API_BASE}/gemini/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return res.json();
  },

  // Configuration
  async updateConfig(config: { safetyBufferPercent?: number; activeDay?: string; maxSlotCapacity?: number }): Promise<any> {
    const res = await fetch(`${API_BASE}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.json();
  },

  // Notifications
  async getNotifications(role?: string): Promise<AppNotification[]> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    const res = await fetch(`${API_BASE}/notifications?${params.toString()}`);
    return res.json();
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
    return res.ok;
  },
};
