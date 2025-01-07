export class AttendanceSummaryDto {
    abanditswe: number;
    abaje: number;
    abasuye: number;
    abasuwe: number;
    abafashije: number;
    abafashijwe: number;
    abatangiyeIsabato: number;
    abarwayi: number;
    abafiteImpamvu: number;
}

export class GroupedAttendanceDto extends AttendanceSummaryDto {
    date: string;
}

export class AddAttendanceByFamilyDto {
    familyId: number;
    date: string;
    attendanceDetails: {
        abanditswe: number;
        abaje: number;
        abasuye: number;
        abasuwe: number;
        abafashije: number;
        abafashijwe: number;
        abatangiyeIsabato: number;
        abarwayi: number;
        abafiteImpamvu: number;
    };
}
