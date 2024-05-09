import { getPrisma } from "../../../../db_sqlite/prisma";
import PhoneRepository from "../../repositories/PhoneRepository";
import GetPhonesController from "./GetPhonesController";
import GetPhonesUseCase from "./GetPhonesUseCase";

export default async function GetPhones() {
  const prisma = await getPrisma();

  const phoneRepository = new PhoneRepository(prisma);

  const getPhonesUseCase = new GetPhonesUseCase(phoneRepository);
  const getPhonesController = new GetPhonesController(getPhonesUseCase);

  return { getPhonesUseCase, getPhonesController };
}
