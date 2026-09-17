import type { USER_ROLES } from "@/config/roles";

export type TUserRole = (typeof USER_ROLES)[number];

export interface IUser {
  id: string;
  companyId: string | null;
  // Only populated on the authenticated profile response
  companyName?: string | null;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: TUserRole;
  status: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUserFilters {
  search?: string;
  companyId?: string;
  role?: TUserRole;
  status?: boolean;
}

export interface IUserQueryParams extends IUserFilters {
  page: number;
  limit: number;
}

export interface ICreateUserPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyId?: string;
  role: TUserRole;
  status: boolean;
}

// password stays optional here — omit it to leave the password unchanged
export type IUpdateUserPayload = Omit<ICreateUserPayload, "password"> & {
  password?: string;
};

export type TSaveUserArgs =
  | { mode: "create"; payload: ICreateUserPayload }
  | { mode: "update"; id: string; payload: IUpdateUserPayload };

export interface IUserFormValues {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyId: string;
  role: TUserRole;
  status: boolean;
}
