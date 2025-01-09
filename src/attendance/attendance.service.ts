import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Repository } from 'typeorm';
import { AddAttendanceByFamilyDto, AttendanceSummaryDto } from './attendance.dto';
import { FamiliesService } from 'src/families/families.service';
import { getPreviousSabbathDate, getSaturdayOccurrence,  } from './sabbathAttendance.utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AttendanceService {

    constructor(
        @InjectRepository(Attendance)
        private readonly attendanceRepository: Repository<Attendance>,
        private readonly familiesService: FamiliesService,
        private readonly userService : UserService
    ) { }

    // Method to calculate total attendance for each category on a given day (Sabbath)
    async getTotalAttendance(date: string) : Promise<any> {
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

        
        // check if all fields in the result are null
        const allNull = Object.values(result).every(value => value === null)
        return allNull ? [] : result;
    }


    async getGroupedAttendances(): Promise<any> {
        // Get raw attendance data grouped by date
        const rawAttendances = await this.attendanceRepository.createQueryBuilder("attendance")
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
            .getRawMany();

        const sabbathNames = ["Ubutabazi", "Umuryango", "JA", "Mifem", "Abana"];

        // Process and enrich data
    
        const enrichedData = rawAttendances.map((attendance) => {            
            if (!attendance.attendance_date) {
                throw new Error(`Missing or invalid date in attendance record: ${JSON.stringify(attendance)}`);
            }

            const sabbathDate = getPreviousSabbathDate(attendance.attendance_date);
            const sabbathDateString = sabbathDate.toISOString();

            const occurrence = getSaturdayOccurrence(sabbathDateString)
            const sabbathName = sabbathNames[(occurrence - 1) % sabbathNames.length]; // Use modulo for cyclic mapping

            return {
                ...attendance,
                sabbathDate,
                sabbathName
            };
        });
        
        // Group attendances by Sabbath date
        const groupedAttendances = enrichedData.reduce((group: Record<string, any[]>, record) => {
            const sabbath = record.sabbathDate;
            group[sabbath] = group[sabbath] || [];
            group[sabbath].push(record);
            return group;
        }, {});

        return groupedAttendances;
    } 

    async addAttendanceByFamily( familyId: number, addAttendanceByFamilyDto: AddAttendanceByFamilyDto, req: any) :  Promise<{message: string}>{
        
        const user = await this.userService.getProfile(req);
            
        if (!user) {
            throw new NotFoundException("User not found");
        }

        if ( user.family.id!= familyId) {
            throw new BadRequestException("You are not authorized to add attendance for this family");
        }

        const family = await this. familiesService.getFamilyById(familyId);
        const { attendanceDetails } = addAttendanceByFamilyDto;

        const abanditswe = family.members.length;
        if (!family) {
            throw new NotFoundException(`Family with id: ${familyId} does not exist`)
        }

        const { abashyitsi, ...withoutAbashyitsi } = attendanceDetails;

        // Validate attendanceDetails against abanditswe
        for (const [key, value] of Object.entries(withoutAbashyitsi)) {
            if (value > abanditswe) {
                throw new BadRequestException(
                    `Invalid value for '${key}': ${value}. It cannot exceed the total family members (${abanditswe}).`,
                );
            }
        }

        const date = new Date(Date.now())
        const sabbathDate = getPreviousSabbathDate(date);

        const existingAttendance = await this.attendanceRepository.findOne({
            where: { family: { id: familyId }, date: sabbathDate },
        });

        if (existingAttendance) {
            await this.attendanceRepository.remove(existingAttendance);
        }

        const attendance = this.attendanceRepository.create({
            abanditswe,
            family,
            ...withoutAbashyitsi,
            abashyitsi,
            date: sabbathDate
        });

        await this.attendanceRepository.save(attendance);

        return { message: "Attendance added successfully" }
    }


    async addGeneralAttendanceByForm(attendanceSummary: AttendanceSummaryDto) : Promise <{message: string}>{
        
        const families = await this.familiesService.getAllFamilies();
        
        const validatedAttendance = {
            abaje: attendanceSummary.abaje || 0,
            abasuye: attendanceSummary.abasuye || 0,
            abasuwe: attendanceSummary.abasuwe || 0,
            abafashije: attendanceSummary.abafashije || 0,
            abafashijwe: attendanceSummary.abafashijwe || 0,
            abatangiyeIsabato: attendanceSummary.abatangiyeIsabato || 0,
            abarwayi: attendanceSummary.abarwayi || 0,
            abafiteImpamvu: attendanceSummary.abafiteImpamvu || 0,
        };
        const abashyitsi = attendanceSummary.abashyitsi || 0;

        const totalChurchMembers = families.reduce((total, family) => total + family.members.length, 0)
        for (const [key, value] of Object.entries(validatedAttendance)) {
            if (value > totalChurchMembers) {
                throw new BadRequestException(
                    `Invalid value for '${key}': ${value}. It cannot exceed the total church members (${totalChurchMembers}).`,
                );
            }
        }

        // Create a new general attendance record without a family
        await this.attendanceRepository.save({
            ...validatedAttendance, 
            abanditswe: totalChurchMembers,
            abashyitsi,
            date: new Date().toISOString().split('T')[0], // Current date in 'YYYY-MM-DD' format
            family: null, // No family associated with this record
        });

        return {message : "Attendance added successfully"}
    }


    async getAttendancesByDate(date: Date): Promise<Attendance[]> {
        return await this.attendanceRepository.find({ where: { date }, relations:["family"] });
    }
}
