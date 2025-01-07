import { ApiProperty } from "@nestjs/swagger";
import { IsDate } from "class-validator";

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
    @ApiProperty({ example: "YYYY-mm-DD" })
     @IsDate()
    date: string;
    
    @ApiProperty({
        example: {
            abanditswe: 10, 
            abaje: 10, 
            abasuye: 10, 
            abasuwe: 10, 
            abafashije: 10, 
            abafashijwe: 10, 
            abatangiyeIsabato: 10, 
            abarwayi: 10, 
            abafiteImpamvu: 10,       
    }})
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
