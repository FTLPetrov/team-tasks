export interface User {
  id: number;
  displayName: string;
  email: string;
  secret: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
