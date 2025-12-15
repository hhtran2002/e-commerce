export type User = {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  //Những trường thuộc tính có hoặc không
  username?: string;
  phone?: string;
  avatarUrl?: string;
  roleId?: number;
};

export type UserInput = {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  username?: string;
  avatarUrl?: string;
  roleId?: number;
};