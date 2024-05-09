import { PrismaClient } from "@prisma/client";
import argon2id from "argon2";

const prisma = new PrismaClient();

/**
 * Criação do usuário root
 */
const createRootUser = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@email.com",
        password: await argon2id.hash("123456"),
      },
    });
  }
};

createRootUser(prisma);

// Criação das roles padrão
enum PermissionTypeGroup {
  USER = "USER",
  USER_ADMIN = "USER_ADMIN",
}

enum Roles {
  IS_ADMIN = "IS_ADMIN",
  IS_SUPPORT = "IS_SUPPORT",
  IS_CLIENT = "IS_CLIENT",
}

const createRoles = async (prisma: PrismaClient) => {
  const allRoles = [
    {
      name: "Admin",
      type: PermissionTypeGroup.USER_ADMIN,
      role: Roles.IS_ADMIN,
    },
    {
      name: "Client",
      type: PermissionTypeGroup.USER,
      role: Roles.IS_CLIENT,
    },
    {
      name: "Support",
      type: PermissionTypeGroup.USER_ADMIN,
      role: Roles.IS_SUPPORT,
    },
  ];

  const roles = await prisma.permissionGroups.findMany();

  const nonexistentRoles: any = allRoles.filter(
    (role) => !roles.find((r) => r.role === role.role),
  );

  if (nonexistentRoles.length > 0) {
    nonexistentRoles.forEach(async (role: any) => {
      await prisma.permissionGroups.create({
        data: {
          name: role.name,
          type: role.type,
          role: role.role,
        },
      });
    });
  }
};

createRoles(prisma);

// Atribuição de roles a usuário específico
const assignSpecificRole = async (prisma: PrismaClient) => {
  const user = await prisma.user.findFirst({
    where: {
      email: "admin@email.com",
    },
  });

  let grantedPermission;
  if (user) {
    grantedPermission = await prisma.userPermissionGroups.findFirst({
      where: {
        userId: user.id,
      },
    });
  }

  const permissions = await prisma.permissionGroups.findMany();
  const permission = permissions.find(
    (permission) => permission.role === Roles.IS_ADMIN,
  );

  if (user && permission && !grantedPermission) {
    await prisma.userPermissionGroups.create({
      data: {
        userId: user.id,
        permissionGroupId: permission.id,
      },
    });
  }
};

assignSpecificRole(prisma);

// Criação de mensagem padrão
const createMessages = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();
  const messages = await prisma.message.findMany();
  const firstMessage = {
    title: "Bem vindo ao sistema",
    content:
      "Olá, seja bem vindo ao sistema de gestão de restaurantes foodExplorer.",
    type: "info",
  };

  const nonexistentUserFirstMessage = users.filter(
    (user) => !messages.find((m) => m.userId === user.id),
  );

  nonexistentUserFirstMessage.forEach(async (user) => {
    const userId = user.id;
    await prisma.message.create({
      data: {
        ...firstMessage,
        userId,
      },
    });
  });
};

createMessages(prisma);
