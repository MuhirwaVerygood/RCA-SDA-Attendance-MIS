import { Permission } from "./shared.permission.enum";

export const RolesPermissions = {
    admin: [
        Permission.AddGeneralAttendance,
        Permission.ViewGeneralAttendance,
        Permission.EditGeneralAttendance,
        Permission.DeleteGeneralAttendance,
    ],
    father: [
        Permission.AddFamilyAttendance,
        Permission.ViewOwnAttendance,
        Permission.EditOwnAttendance,
        Permission.DeleteOwnAttendance
    ],
};
