import { getPrisma } from "../../../../db_sqlite/prisma";
import UserRepository from "../../repositories/UserRepository";
import DeleteUserController from "./DeleteUserController";
import DeleteUserUseCase from "./DeleteUserUseCase";

export default async function DeleteUser() {
  const prisma = await getPrisma();

  const userRepository = new UserRepository(prisma);

  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  return { deleteUserUseCase, deleteUserController };
}
