import {
    Controller,
    Get,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
    Body,
    Post,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AuthGuard } from 'src/user/auth.guard';
import { AddAttendanceByFamilyDto, AttendanceSummaryDto, GroupedAttendanceDto } from './attendance.dto';
import { RolesGuard } from 'src/shared/shared.roleguard';
import { Permission } from 'src/shared/shared.permission.enum';
import { Permissions } from 'src/shared/shared.permissions.decorator';

@ApiTags('Attendances')
@ApiBearerAuth()
@Controller('attendances')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Permissions(Permission.ViewGeneralAttendance)
    @Get('total/:date')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get total attendance for a specific date' })
    @ApiParam({
        name: 'date',
        description: 'The date to filter attendance records by (format: YYYY-MM-DD)',
        example: '2024-01-01',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Total attendance for the specified date.',
        type: AttendanceSummaryDto,
    })
    async getTotalAttendance(@Param('date') date: string): Promise<AttendanceSummaryDto> {
        return await this.attendanceService.getTotalAttendance(date);
    }



    @UseGuards(AuthGuard)
    @Get('grouped')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get grouped attendance data by date' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Grouped attendance data by date.',
        type: [GroupedAttendanceDto],
    })
    async getGroupedAttendances(): Promise<GroupedAttendanceDto[]> {
        return await this.attendanceService.getGroupedAttendances();
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Permissions(Permission.AddFamilyAttendance)
    @Post("/:familyId")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Add attendance for a specific family' })
    @ApiParam({
        name: 'familyId',
        description: 'The unique ID of the family',
        required: true,
        example: '2',
    })
       
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Attendance successfully added for the specified family.',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Attendance added successfully.' },
            },
        },
    })

    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request payload.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.',
    }) 
    async addAttendanceByFamily(
        @Param("familyId") familyId: number,
        @Body() addAttendanceByFamilyDto: AddAttendanceByFamilyDto,
        @Req() req
    ): Promise<{ message: string }> {
        return this.attendanceService.addAttendanceByFamily(familyId,addAttendanceByFamilyDto, req);
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Permissions(Permission.AddGeneralAttendance)    
    @Post("general/form")
    async addGeneralAttendanceByForm(@Body() generalAttendance: AttendanceSummaryDto): Promise<{message: string}> {
        return this.attendanceService.addGeneralAttendanceByForm(generalAttendance);
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Permissions(Permission.ViewGeneralAttendance)    
    @Get("/:date")
    async getAttendancesByDate(
        @Param('date') date: Date
    ) {
    return this.attendanceService.getAttendancesByDate(date)
    }
}
