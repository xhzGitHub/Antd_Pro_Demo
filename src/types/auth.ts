declare namespace Auth {
  interface Admin {
    id: string;
    name: string;
    email: string;
  }

  type PermissionID = number;

  interface Permission {
    id: PermissionID;
    name: string;
    description: string;
  }

  type AllPermissions = Permission[];

  type AdminPermissions = PermissionID[];
}