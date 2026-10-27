export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  year?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Snacks' | 'Beverages' | 'Quick Meals' | 'Desserts';
  image: string;
  available: boolean;
  preparationTime: number;
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
  orderNumber: string;
  pickupToken: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  department?: string;
  items: OrderItem[];
  totalAmount: number;
  pickupSlot: string;
  timeSlotId: string;
  status: OrderStatus;
  paymentMethod: 'Cash at Pickup' | 'Demo UPI';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  createdAt: string;
  readyAt?: string;
  completedAt?: string;
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

export interface CrowdPredictionResponse {
  slots_json: {
    time_slot: string;
    crowd_percentage: number;
    crowd_level: 'Low' | 'Medium' | 'High' | 'Very High';
    estimated_wait_minutes: number;
    recommended_pickup: boolean;
    item_demand: Record<string, number>;
  }[];
  best_low_crowd_pickup_slot: string;
  peak_crowd_slot: string;
  expected_average_waiting_time: number;
  top_5_items_by_predicted_demand: { name: string; quantity: number }[];
  recommended_preparation_quantity_for_each_item: Record<string, {
    predicted: number;
    buffer: number;
    currentInventory: number;
    recommended: number;
  }>;
  estimated_food_waste_reduction: string;
  short_explanation: string;
  student_recommendation_format: string;
  is_demo_data: boolean;
  active_day: string;
  safety_buffer_percent: number;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  timeLabel: string;
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
  canteenImpact: string;
  crowdMultiplier: number;
  active: boolean;
  description: string;
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

export interface HistoricalStats {
  totalRecords: number;
  uniqueOrders: number;
  dateRange: string;
  isDemoData: boolean;
  accuracyMAPE: number;
  accuracyMAE: number;
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

export interface DashboardAnalytics {
  currentCrowdPercentage: number;
  currentCrowdStatus: string;
  estimatedWaitMinutes: number;
  todayOrdersCount: number;
  currentLiveQueueSize: number;
  todayRevenue: number;
  todayWastePercentage: number;
  aiRecommendedPickupSlot: string;
  peakCrowdSlot: string;
  wasteReductionAchievement: string;
  wasteRecords: WasteRecord[];
  predictionAccuracyMAPE: number;
  isDemoData: boolean;
}
