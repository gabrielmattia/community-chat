import * as React from "react";
import { User, UserLoginType, UserType } from "./lib/types";

export class PostNotFoundError extends Error {}

export interface AuthContext {
  isAuthenticated: boolean;
  setUser: (username: string | null) => void;
  user: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(null);
  const isAuthenticated = !!user;
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const cadastro = async (newUser: UserType) => {
  await new Promise((r) => setTimeout(r, 500));
  const dictionariesString = localStorage.getItem("users");
  const users = JSON.parse(dictionariesString as string);
  const usuarioExistente = users.find(
    (user: UserType) => user.nome === newUser.nome
  );
  if (!usuarioExistente) {
    newUser.id = Math.random().toString();
    users.push(newUser);
    const usersString = JSON.stringify(users);
    localStorage.setItem("users", usersString);
    return true;
  } else {
    return false;
  }
};

export const logar = async (
  data: UserLoginType
): Promise<UserLoginType | undefined> => {
  await new Promise((r) => setTimeout(r, 500));
  const dictionariesString = localStorage.getItem("users");
  const users = JSON.parse(dictionariesString as string);
  return users.find(
    (user: UserType) =>
      (user.email === data.email || user.nome === data.email) &&
      user.senha === data.senha
  );
};

export const getUsers = async (nome: string) => {
  await new Promise((r) => setTimeout(r, 500));
  const dictionariesString = localStorage.getItem("users");
  const users = JSON.parse(dictionariesString as string);
  const usersWithoutMe = users
    .filter((user: UserType) => user.nome !== nome && user.email !== nome)
    .map(({ id, nome }: User) => ({ id, nome }));

  return usersWithoutMe;
};
