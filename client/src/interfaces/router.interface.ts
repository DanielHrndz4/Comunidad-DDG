import type { ReactNode } from "react";

export type UserRole = "admin" | "normal" | "vigilant";

export interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: ReactNode;
  redirectTo?: string;
  unauthorizedTo?: string;
}