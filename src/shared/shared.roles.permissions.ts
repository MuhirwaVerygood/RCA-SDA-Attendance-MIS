import { Permission } from "./shared.permission.enum";

export const RolesPermissions = {
    admin: [
        Permission.AddAttendance,
        Permission.ViewAllAttendance,
        Permission.EditAttendance,
        Permission.DeleteAttendance,
    ],
    father: [
        Permission.AddAttendance,
        Permission.ViewOwnAttendance,
    ],
};
