import { getPrisma } from "../../../../db_sqlite/prisma";
import UserRepository from "../../repositories/UserRepository";
import GetUsersController from "./GetUsersController";
import GetUsersUseCase from "./GetUsersUseCase";

export default async function GetUsers() {
  const prisma = await getPrisma();

  const userRepository = new UserRepository(prisma);

  const getUsersUseCase = new GetUsersUseCase(userRepository);
  const getUsersController = new GetUsersController(getUsersUseCase);

  return { getUsersUseCase, getUsersController };
}
