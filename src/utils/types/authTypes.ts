import type { User } from "../../api/userTypes";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  loginAction: (data: LoginCredentials) => Promise<User>;
  logOut: () => void;
};