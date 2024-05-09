import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { CreateUserDTO } from "./CreateUserDTO";

export default class CreateUserUseCase {
  private userRepository: IUserRepository;
  private prisma: PrismaClient;

  constructor(userRepository: IUserRepository, prisma: PrismaClient) {
    this.userRepository = userRepository;
    this.prisma = prisma;
  }

  async execute({
    name,
    email,
    password,
    isActive,
    birthday,
    role,
    createdBy,
  }: CreateUserDTO) {
    if (role) {
      const roleExists = await this.prisma.permissionGroups.findFirst({
        where: {
          role,
        },
      });

      if (!roleExists) {
        throw new Error("Categoria de usuário não existe");
      }

      const existentUser = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (existentUser) {
        throw new Error("Usuário já existe");
      }

      let newUser: any = await this.userRepository.create({
        name,
        email,
        password,
        isActive,
        birthday,
        createdBy,
      });

      if (newUser) {
        // Atribuição de role ao usuário
        const permissions = await this.prisma.permissionGroups.findMany();
        const permission = permissions.find(
          (permission) => permission.role === role,
        );

        let user_permission;
        if (permission) {
          user_permission = await this.prisma.userPermissionGroups.create({
            data: {
              userId: newUser.id,
              permissionGroupId: permission.id,
            },
          });
        }

        const firstMessage = {
          title: "Bem vindo ao sistema",
          content: "Olá, seja bem vindo ao sistema.",
          type: "info",
        };

        const newMessage = await this.prisma.message.create({
          data: {
            ...firstMessage,
            userId: newUser.id,
          },
        });

        return newUser;
      }
    } else {
      const existentUser = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (existentUser) {
        throw new Error("Usuário já existe");
      }

      let newUser: any = await this.userRepository.create({
        name,
        email,
        password,
        isActive,
        birthday,
        createdBy,
      });

      if (newUser) {
        // Atribuição de role ao usuário
        const permission = await this.prisma.permissionGroups.findFirst({
          where: {
            role: "IS_CLIENT",
          },
        });

        let user_permission;
        if (permission) {
          user_permission = await this.prisma.userPermissionGroups.create({
            data: {
              userId: newUser.id,
              permissionGroupId: permission.id,
            },
          });
        }

        const firstMessage = {
          title: "Bem vindo ao sistema",
          content: "Olá, seja bem vindo ao sistema.",
          type: "info",
        };

        const newMessage = await this.prisma.message.create({
          data: {
            ...firstMessage,
            userId: newUser.id,
          },
        });

        return newUser;
      }
    }

    return null;
  }
}
