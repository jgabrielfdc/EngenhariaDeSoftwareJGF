import { getPrisma } from "../../../../db_sqlite/prisma";
import UserRepository from "../../repositories/UserRepository";
import PhoneRepository from "../../repositories/PhoneRepository";
import UpdateUserController from "./UpdateUserController";
import UpdateUserUseCase from "./UpdateUserUseCase";

export default async function UpdateUser() {
  const prisma = await getPrisma();

  const userRepository = new UserRepository(prisma);
  const phoneRepository = new PhoneRepository(prisma);

  const updateUserUseCase = new UpdateUserUseCase(
    userRepository,
    phoneRepository,
  );
  const updateUserController = new UpdateUserController(updateUserUseCase);

  return { updateUserUseCase, updateUserController };
}
