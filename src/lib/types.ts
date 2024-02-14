export type UserType = {
  id?: string;
  nome: string;
  email: string;
  senha: string;
};

export type UserLoginType = {
  email: string;
  senha: string;
};

export type User = {
  nome: string;
  id: string;
};
export type CommunityType = {
  nome: string;
  descricao?: string;
  privada: boolean;
  criador: string;
  id: string;
  users: { nome: string }[];
};
