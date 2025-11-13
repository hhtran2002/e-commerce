export type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
  description?: string;
};

export type UserInput = {
  username: string;
  email: string;
  phone: string;
  password: string;
  description?: string;
};