import { getPrisma } from "../../../../db_sqlite/prisma";
import PhoneRepository from "../../repositories/PhoneRepository";
import GetPhoneController from "./GetPhoneController";
import GetPhoneUseCase from "./GetPhoneUseCase";

export default async function GetPhone() {
  const prisma = await getPrisma();

  const phoneRepository = new PhoneRepository(prisma);

  const getPhoneUseCase = new GetPhoneUseCase(phoneRepository);
  const getPhoneController = new GetPhoneController(getPhoneUseCase);

  return { getPhoneUseCase, getPhoneController };
}
