import { ApiProperty } from "@nestjs/swagger";
import { IsInt,  IsOptional, Min } from "class-validator";

export class AttendanceSummaryDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    abanditswe?: number;

    @IsInt()
    @Min(0)
    abaje: number;

    @IsInt()
    @Min(0)
    abasuye: number;

    @IsInt()
    @Min(0)
    abasuwe: number;

    @IsInt()
    @Min(0)
    abafashije: number;

    @IsInt()
    @Min(0)
    abafashijwe: number;

    @IsInt()
    @Min(0)
    abatangiyeIsabato: number;

    @IsInt()
    @Min(0)
    abarwayi: number;

    @IsInt()
    @Min(0)
    abafiteImpamvu: number;

    @IsInt()
    @Min(0)
    abashyitsi: number; 
}
export class GroupedAttendanceDto extends AttendanceSummaryDto {
    date: string;
}

export class AddAttendanceByFamilyDto {
    @ApiProperty({ example: "YYYY-mm-DD" })
    
    @ApiProperty({
        example: {
            abaje: 10, 
            abasuye: 10, 
            abasuwe: 10, 
            abafashije: 10, 
            abafashijwe: 10, 
            abatangiyeIsabato: 10, 
            abarwayi: 10, 
            abafiteImpamvu: 10,      
            abashyitsi: 4
        }
    })
        
    attendanceDetails: {
        abaje: number;
        abasuye: number;
        abasuwe: number;
        abafashije: number;
        abafashijwe: number;
        abatangiyeIsabato: number;
        abarwayi: number;
        abafiteImpamvu: number;
        abashyitsi: number;
    };
}
