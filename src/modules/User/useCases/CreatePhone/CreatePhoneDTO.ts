import { User } from "@prisma/client";

export type CreatePhoneDTO = {
  type: string;
  number: string;
  user: User;
  userId: string;
};
