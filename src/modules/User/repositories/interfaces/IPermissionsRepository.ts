import { UserPermissionGroups } from "@prisma/client";

interface PermissionTypeGroup {
  type: string;
}

export interface IPermissionsRepository {
  getById(id: string): Promise<{
    id: string;
    userId: string | null;
    permissionGroup: { role: string };
  }>;

  getByUserId(
    userId: string,
  ): Promise<Array<{ permissionGroup: { role: string } }>>;

  getAllByUserId(
    userId: string,
  ): Promise<Array<{ permissionGroup: { role: string } }>>;

  getRoles(type: PermissionTypeGroup): Promise<{ role: string }[]>;

  create(
    userId: string,
    roles: Array<string>,
  ): Promise<Array<UserPermissionGroups>>;

  addRole(
    userId: string,
    role: string,
  ): Promise<Array<UserPermissionGroups> | null>;

  removeRole(
    userId: string,
    role: string,
  ): Promise<UserPermissionGroups | null>;
}
