import { ISessionRepository } from "../../repositories/interfaces/ISessionRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { IPermissionsRepository } from "../../repositories/interfaces/IPermissionsRepository";
import { AuthExceptionEnum, HttpExceptionEnum } from "../../../../exceptions";
import ValidationException from "../../../../exceptions/ValidationException";

import generateJWT from "../../../../utils/jwt";
import { User } from "@prisma/client";
import argon2id from "argon2";
import { Lookup } from "geoip-lite";

export default class AuthUserUseCase {
  private userRepository: IUserRepository;
  private sessionRepository: ISessionRepository;
  private permissionsRepository: IPermissionsRepository;

  constructor(
    userRepository: IUserRepository,
    sessionRepository: ISessionRepository,
    permissionsRepository: IPermissionsRepository,
  ) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
    this.permissionsRepository = permissionsRepository;
  }

  async execute(login: string) {
    const user = await this.userRepository.authenticate(login);

    if (user) {
      const permissions = await this.permissionsRepository.getByUserId(user.id);

      return {
        user,
        permissions: permissions,
      };
    } else {
      return {
        user,
        permissions: null,
        restaurants: null,
        categories: null,
        dishes: null,
        orders: null,
      };
    }
  }

  public async matchUser(user: User | null, password: string) {
    if (!user) {
      throw new ValidationException(
        HttpExceptionEnum.NOT_FOUND,
        {
          message: `Usuário não encontrado.`,
        },
        404,
      );
    }

    const passMatch = await argon2id.verify(user.password, password);
    if (!passMatch) {
      throw new ValidationException(
        AuthExceptionEnum.INVALID_CREDENTIALS,
        {
          message: `Credenciais invalidas.`,
        },
        404,
      );
    }

    return generateJWT(user.id);
  }

  public async registerFirstLogin(userId: string, firstLogin: Date | null) {
    if (!firstLogin) {
      await this.userRepository.setFirstLoginDate(userId);
    }
  }

  public createSession(
    userId: string,
    ip: string,
    userAgent?: string,
    language?: string,
    geodata?: Lookup | null,
  ) {
    return this.sessionRepository.add(userId, ip, userAgent, language, geodata);
  }
}
