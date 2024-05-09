export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  birthday: Date;
  role?: string;
  createdBy: string;
};
