import type { ReactNode } from "react";

export type UserRole = "ADMIN" | "USER" | "SUPPORT";

export interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: ReactNode;
  redirectTo?: string;
  unauthorizedTo?: string;
}