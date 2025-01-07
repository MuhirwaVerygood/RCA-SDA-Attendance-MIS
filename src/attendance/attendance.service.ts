import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Repository } from 'typeorm';
import { AddAttendanceByFamilyDto } from './attendance.dto';
import { FamiliesService } from 'src/families/families.service';

@Injectable()
export class AttendanceService {

    constructor(
        @InjectRepository(Attendance)
        private readonly attendanceRepository: Repository<Attendance>,
        private readonly familiesService: FamiliesService
    ) { }

    // Method to calculate total attendance for each category on a given day (Sabbath)
    async getTotalAttendance(date: string) {
        const result = await this.attendanceRepository
            .createQueryBuilder('attendance')
            .select([
                'SUM(attendance.abanditswe) AS abanditswe',
                'SUM(attendance.abaje) AS abaje',
                'SUM(attendance.abasuye) AS abasuye',
                'SUM(attendance.abasuwe) AS abasuwe',
                'SUM(attendance.abafashije) AS abafashije',
                'SUM(attendance.abafashijwe) AS abafashijwe',
                'SUM(attendance.abatangiyeIsabato) AS abatangiyeIsabato',
                'SUM(attendance.abarwayi) AS abarwayi',
                'SUM(attendance.abafiteImpamvu) AS abafiteImpamvu',
                'SUM(attendance.abashyitsi) AS abashyitsi',
            ])
            .where('attendance.date = :date', { date }) // Filter by the given date
            .getRawOne(); // Get the raw result

        return result;
    }


    async getGroupedAttendances(): Promise<any> {
        const result = await this.attendanceRepository.createQueryBuilder("attendance")
            .select([
                'attendance.date',
                'SUM(attendance.abanditswe) AS abanditswe',
                'SUM(attendance.abaje) AS abaje',
                'SUM(attendance.abasuye) AS abasuye',
                'SUM(attendance.abasuwe) AS abasuwe',
                'SUM(attendance.abafashije) AS abafashije',
                'SUM(attendance.abafashijwe) AS abafashijwe',
                'SUM(attendance.abatangiyeIsabato) AS abatangiyeIsabato',
                'SUM(attendance.abarwayi) AS abarwayi',
                'SUM(attendance.abafiteImpamvu) AS abafiteImpamvu'
            ])
            .groupBy("attendance.date")
            .orderBy("attendance.date", "DESC")
            .getRawMany()
        return result;
    }

    async addAttendanceByFamily( familyId: number, addAttendanceByFamilyDto: AddAttendanceByFamilyDto) :  Promise<{message: string}>{
        const {  date, attendanceDetails } = addAttendanceByFamilyDto;
        const family = await this.familiesService.getFamilyById(familyId);
        if (!family) {
            throw new NotFoundException(`Family with id: ${familyId} does not exist`)
        }

        await this.attendanceRepository.create({
            family,
            date,
            ...attendanceDetails
        });

        return { message: "Attendance added successfully" }
    }
}
