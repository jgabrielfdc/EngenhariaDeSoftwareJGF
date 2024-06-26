import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

export default class GetUsersUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    return this.userRepository.getAllUsers();
  }
}
