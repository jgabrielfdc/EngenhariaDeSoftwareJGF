import { IPhoneRepository } from "../../repositories/interfaces/IPhoneRepository";

export default class GetPhonesUseCase {
  private phoneRepository: IPhoneRepository;

  constructor(phoneRepository: IPhoneRepository) {
    this.phoneRepository = phoneRepository;
  }

  async execute(userId: string) {
    return this.phoneRepository.getByUserId(userId);
  }
}
