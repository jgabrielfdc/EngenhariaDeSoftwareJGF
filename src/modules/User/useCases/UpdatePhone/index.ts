import { getPrisma } from "../../../../db_sqlite/prisma";
import PhoneRepository from "../../repositories/PhoneRepository";
import UpdatePhoneController from "./UpdatePhoneController";
import UpdatePhoneUseCase from "./UpdatePhoneUseCase";

export default async function UpdatePhone() {
  const prisma = await getPrisma();

  const phoneRepository = new PhoneRepository(prisma);

  const updatePhoneUseCase = new UpdatePhoneUseCase(phoneRepository);
  const updatePhoneController = new UpdatePhoneController(updatePhoneUseCase);

  return { updatePhoneUseCase, updatePhoneController };
}
