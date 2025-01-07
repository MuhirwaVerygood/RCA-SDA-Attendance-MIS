import {
    Controller,
    Get,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
    Body,
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

@ApiTags('Attendances')
@ApiBearerAuth()
@Controller('attendances')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @UseGuards(AuthGuard)
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


    // Add attendance by family
    async addAttendanceByFamily(
        @Body() addAttendanceByFamilyDto: AddAttendanceByFamilyDto,
    ): Promise<{ message: string }> {
        return this.attendanceService.addAttendanceByFamily(addAttendanceByFamilyDto);
    }
}
