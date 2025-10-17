export type StatisticType = {
  title: string;
  description?: string;
  statistic: number;
  growth?: number;
  prefix?: string;
  suffix?: string;
};

export type StatisticCardType = {
  icon: string;
  variant: string;
  background?: {
    color?: string;
    icon?: string;
    image?: string;
  };
} & StatisticType;

export type SessionStatus = 'active' | 'completed' | 'cancelled';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface SessionAttendance {
  user: string; // ObjectId reference to User
  status: AttendanceStatus;
  note?: string;
}

export interface Session {
  // Identifier
  _id: string;
  // Group reference
  group: string; // ObjectId reference to Group

  // Coaches array
  coaches: string[]; // Array of ObjectId references to User

  // Session status
  status?: SessionStatus;

  // Time information
  startTime: Date;
  endTime?: Date;

  // Additional information
  notes?: string;

  // Attendance records
  attendance: SessionAttendance[];

  // Active status
  isActive: boolean;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for creating a new session
export type CreateSessionInput = Omit<Session, '_id' | 'createdAt' | 'updatedAt'> & {
  group: string;
  coaches: string[];
  startTime: Date;
};

// Type for updating a session
export type UpdateSessionInput = Partial<Omit<Session, 'createdAt' | 'updatedAt'>>;

// Type for session filters/queries
export interface SessionFilters {
  groupId?: string;
  coachId?: string;
  status?: SessionStatus;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  userId?: string; // For filtering sessions where user is in attendance
  attendanceStatus?: AttendanceStatus;
}

// Type for attendance update
export interface UpdateAttendanceInput {
  userId: string;
  status: AttendanceStatus;
  note?: string;
}

// Type for session with populated references
export interface SessionWithPopulatedRefs extends Omit<Session, 'group' | 'coaches' | 'attendance'> {
  group: {
    _id: string;
    name: string;
    // Add other group fields as needed
  };
  coaches: Array<{
    _id: string;
    email: string;
    name: string;
    // Add other user fields as needed
  }>;
  attendance: Array<{
    user: {
      _id: string;
      email: string;
      name: string;
      // Add other user fields as needed
    };
    status: AttendanceStatus;
    note?: string;
  }>;
}

export type CoachType = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
};

export type GroupType = {
  _id: string;
  name: string;
  description: string;
  coaches: CoachType[];
  schedule: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    duration: number;
  }>;
  maxMembers: number;
  membershipOpen: boolean;
  payment: {
    amount: number;
    billingCycle: string;
    includesEquipment: boolean;
    notes?: string;
  };
  notes?: string;
};

export type UserType = {
  _id: string;
  firstName?: string;
  lastName?: string;
  isMale?: string;
  phoneNumber?: string;
  email?: string;
  roles?: string[];
  studentNumber?: number;
  isStudent?: boolean;
  groupMemberships?: GroupMembershipType[];
  createdAt?: Date;
  lastLoginAt?: Date;
  skillLevel?: number;
  notes?: string;
  isEmailVerified?: boolean;
};

export interface RoleType {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  level: number;
  isDefault?: boolean;
}

export type GroupMembershipType = {
  _id: string;
  user: UserType;
  joinDate?: Date;
  group: GroupType;
  status: "approvementPending" | "active" | "paymentPending" | "rejected" | "expired";
};

type SessionTypeInternal = {
  count?: number;
  percentage?: number;
  trend?: string;
};

export type ReservationType = {
  id: string;
  sessions: SessionTypeInternal;
  prevPeriod: SessionTypeInternal;
  change: SessionTypeInternal;
};
