import { ServiceDto } from "./service-type";

export interface UserDto {
  id?: number;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status?: number;
  enableTeamPortal?: number;
  schedules?: UserSchedule[];
  services?: ServiceDto[];
  role?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSchedule extends BaseSchedule {
  userId?: number;
}

export interface BaseSchedule {
  id?: number;
  status: number;
  dayOfWeek: number;
  toTime: string;
  fromTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignedTeamMember {
  id?: number;
  status: number;
  userId: number;
  serviceId: number;
  capacity: number;
  name: string;
  email: string;
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
}
