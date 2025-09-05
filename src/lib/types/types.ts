export type CoachType = {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type ScheduleType = {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  duration: number;
};

type PaymentType = {
  amount: number;
  billingCycle: string;
  includesEquipment: boolean;
  notes?: string;
};

export type MeType = {
  _id: string;
  firstName: string;
  lastName: string;
  isMale: string;
  phoneNumber: string;
  email: string;
  roles: string[];
  studentNumber?: number;
  isStudent: boolean;
  department?: string;
  grade?: string;
  createdAt: Date;
  lastLoginAt: Date;
  skillLevel: number;
  isEmailVerified: boolean;
  memberships: {
    _id: string;
    joinDate: Date;
    group: GroupListType;
    status: string;
  }[];
};

export type GroupListType = Pick<
  GroupType,
  | "_id"
  | "name"
  | "description"
  | "coaches"
  | "schedule"
  | "membershipOpen"
  | "payment"
  | "notes"
>;

export type MySessionType = {
  _id: string;
  coaches: CoachType[];
  notes?: string;
  status: string;
  startTime: Date;
  endTime: Date;
  attendance: {
    status: string;
    note?: string;
  };
};

export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  isMale: string;
  phoneNumber: string;
  email: string;
  roles: string[];
  studentNumber?: number;
  isStudent: boolean;
  department?: string;
  grade?: string;
  createdAt: Date;
  lastLoginAt: Date;
  skillLevel: number;
  notes?: string;
  isEmailVerified: boolean;
  memberships: {
    _id: string;
    joinDate: Date;
    group: GroupType;
    status: string;
  }[];
};

export type GroupType = {
  _id: string;
  name: string;
  description: string;
  coaches: CoachType[];
  schedule: ScheduleType[];
  maxMembers: number;
  membershipOpen: boolean;
  payment: PaymentType;
  notes?: string;
};

export type SessionType = {
  _id: string;
  group: GroupType;
  coaches: CoachType[];
  status: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  attendance: {
    user: Pick<
      UserType,
      | "_id"
      | "firstName"
      | "lastName"
      | "isMale"
      | "phoneNumber"
      | "studentNumber"
    >;
    status: string;
    note?: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MembershipType = {
  _id: string;
  user: Pick<
    UserType,
    | "_id"
    | "firstName"
    | "lastName"
    | "isMale"
    | "phoneNumber"
    | "studentNumber"
  >;
  joinDate: Date;
  group: Pick<
    GroupType,
    | "_id"
    | "name"
    | "description"
    | "coaches"
    | "schedule"
    | "membershipOpen"
    | "payment"
    | "notes"
  >;
  status: string;
};

export type APIResponse<T> =
  | APISuccessfulResponse<T>
  | APIErrorResponse<T>;

type APISuccessfulResponse<T> = {
  data: T;
  message: string;
  code: number;
};

type APIErrorResponse<T> = {
  errors: T[];
  message: string;
  code: number;
};

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  errors?: string[];
  tokens?: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  studentNumber: string;
  department: string;
  grade: string;
  isMale: string;
  phoneNumber: string;
  skillLevel: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  errors?: string[];
  userId?: string;
}
