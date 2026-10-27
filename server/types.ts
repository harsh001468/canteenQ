export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  year?: string;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Snacks' | 'Beverages' | 'Quick Meals' | 'Desserts';
  image: string;
  available: boolean;
  preparationTime: number; // minutes
  stock: number;
  isPopular?: boolean;
  dietary: 'Veg' | 'Non-Veg';
}

export type OrderStatus = 'Placed' | 'Accepted' | 'Preparing' | 'Ready' | 'Picked Up' | 'Cancelled';

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. CQ-1024
  pickupToken: string; // e.g. CQ-4821
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  department?: string;
  items: OrderItem[];
  totalAmount: number;
  pickupSlot: string; // e.g. "12:15 PM - 12:30 PM"
  timeSlotId: string; // e.g. "12:00 PM - 01:00 PM"
  status: OrderStatus;
  paymentMethod: 'Cash at Pickup' | 'Demo UPI';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  createdAt: string;
  readyAt?: string;
  completedAt?: string;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // "10:00"
  endTime: string;   // "11:00"
  timeLabel: string; // "10:00 AM - 11:00 AM"
  subject: string;
  department: string;
  year: string;
  section: string;
  isBreak?: boolean;
  breakType?: 'Chai Break' | 'Lunch Break' | 'Evening Break';
  studentsCount: number;
}

export interface CollegeEvent {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  timeSlot: string;
  expectedAttendance: number;
  eventType: 'Hackathon' | 'Cultural Fest' | 'Tech Expo' | 'Exam Week' | 'Sports Meet';
  canteenImpact: 'High Walk-in Drop (Occupied in Aud)' | 'Evening Snack Spike' | 'Bulk Lunch Catering' | 'Exam Rush Post-Noon';
  crowdMultiplier: number; // e.g. 0.65 for Hackathon (fewer drop-ins), 1.4 for Fest
  active: boolean;
  description: string;
}

export interface SlotCrowdPrediction {
  time_slot: string;
  crowd_percentage: number;
  crowd_level: 'Low' | 'Medium' | 'High' | 'Very High';
  estimated_wait_minutes: number;
  recommended_pickup: boolean;
  max_capacity: number;
  booked_orders: number;
  remaining_capacity: number;
  confidence: number;
  free_students_estimate: number;
  is_break: boolean;
  break_name?: string;
  item_demand: Record<string, number>;
  recommended_preparation?: Record<string, {
    predicted: number;
    buffer: number;
    currentInventory: number;
    recommended: number;
  }>;
}

export interface WasteRecord {
  id: string;
  date: string;
  item: string;
  preparedQuantity: number;
  soldQuantity: number;
  wastedQuantity: number;
  wastePercentage: number;
  reason?: string;
}

export interface HistoricalLog {
  timestamp: string;
  item: string;
  quantity: number;
  order_id: string;
  day_of_week: string;
  hour: number;
  was_break: boolean;
}

export interface HistoricalStats {
  totalRecords: number;
  uniqueOrders: number;
  dateRange: string;
  isDemoData: boolean;
  accuracyMAPE: number; // Mean Absolute Percentage Error e.g. 5.8%
  accuracyMAE: number;  // Mean Absolute Error in units
  rmse: number;
  lastRetrained: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'crowd' | 'waste' | 'event' | 'system';
  read: boolean;
}
