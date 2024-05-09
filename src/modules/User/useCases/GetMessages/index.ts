import { getPrisma } from "../../../../db_sqlite/prisma";
import MessageRepository from "../../repositories/MessageRepository";
import GetMessagesController from "./GetMessagesController";
import GetMessagesUseCase from "./GetMessagesUseCase";

export default async function GetMessages() {
  const prisma = await getPrisma();

  const messageRepository = new MessageRepository(prisma);

  const getMessagesUseCase = new GetMessagesUseCase(messageRepository);
  const getMessagesController = new GetMessagesController(getMessagesUseCase);

  return { getMessagesUseCase, getMessagesController };
}
