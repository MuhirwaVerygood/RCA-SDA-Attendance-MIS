import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './families.entity';
import { CreateFamilyDto } from './families.dto';
import * as argon2 from "argon2"
import { User } from 'src/auth/user.entity';
import { Member } from 'src/members/members.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Attendance } from 'src/attendance/attendance.entity';

@Injectable()
export class FamiliesService {
    constructor(
        @InjectRepository(Family)
        private readonly familyRepository: Repository<Family>,


        @InjectRepository(Attendance)
        private readonly attendanceRepository: Repository<Attendance>,

        @InjectRepository(Member)
        private readonly  memberRepository : Repository<Member> ,
            
        @InjectRepository(User)
        private readonly userRepository: Repository<User> , 

        private readonly mailerService: MailerService
        
    ) { }

    // Create a new family
    async createFamily(familyRequest: CreateFamilyDto, req: any): Promise<object> {
        const { father_email, mother_email, password, father, mother, familyName } = familyRequest;

        const adder = await this.userRepository.find({where:{id: req.user.id}})
        
        // Hash the password once
        const hashedPassword = await argon2.hash(password);

        // Reusable function for creating user accounts
        const createUserAccount = async (username: string, email: string, isFather: boolean, isMother: boolean , family: Family) => {
            const userAccount = this.userRepository.create({
                username,
                email,
                password: hashedPassword,
                isAdmin: false,
                isFather,
                isMother,
                family
            });


            return this.userRepository.save(userAccount);
        };

    

        // Create the family record
        const family = this.familyRepository.create({
            familyName,
            father,
            mother,
        });
        
        await this.familyRepository.save(family);

        

        // Create mother and father accounts
        await createUserAccount(mother, mother_email, false, true, family);
        await createUserAccount(father, father_email, true, false, family);

        const motherAsMember = await this.memberRepository.create({ name: father, class: familyRequest.father_class, family })
        await this.memberRepository.save(motherAsMember)
      const fatherAsMember =  await this.memberRepository.create({ name: mother, class: familyRequest.mother_class, family })
        await this.memberRepository.save(fatherAsMember)


        const allAdmins = await this.userRepository.find({where:{ isAdmin: true }})
        const otherAdmins = allAdmins.filter(admin => admin.email !== req.user.email);

        for (const admin of otherAdmins) {

            // Send an email to each admin about the new family and it's heads
            await this.mailerService.sendMail({
                to: admin.email,
                subject: 'New Family Added',
                text: `Dear ${admin.username}, \n\nThis is to inform you that the admin ${adder[0]?.username} has added ${family.familyName} with ${father} as a father and ${mother} as a mother  of the family. \n\nBest regards,\nYour Admin Team`,
            });
        }

        const familyWithRelations = await this.familyRepository.findOne({
            where: { id: family.id },
            relations: ['members', 'heads']
        });
    
        return familyWithRelations;
    }

   
    // Get a family by ID
    async getFamilyById(id: number): Promise<Family> {
        const family = await this.familyRepository.findOne({
            where: { id },
            relations: ['members'],
        });
        if (!family) {
            throw new NotFoundException(`Family with ID ${id} not found`);
        }
        return family;
    }

    // Update a family's details
    async updateFamily(
        id: number,
        familyName?: string,
        father?: string,
        mother?: string,
    ): Promise<Family> {
        const family = await this.getFamilyById(id); // Ensure family exists
        if (familyName) family.familyName = familyName;
        if (father) family.father = father;
        if (mother) family.mother = mother;
        return this.familyRepository.save(family);
    }

    // Delete a family
    async deleteFamily(id: number): Promise<{ message:string }> {
        const family = await this.familyRepository.findOne({ where: { id } });
        if (!family) {
            throw new NotFoundException(`Family with ID ${id} not found`);
        }   
        

        await this.familyRepository.delete(id);
        return {message:"Family Deleted Successfully"}
    }



     // Get all families
     async getAllFamilies(): Promise<Family[]> {
        const families = await this.familyRepository.find({ relations: ['members' , 'attendances'] });
        if(!families){
            throw new NotFoundException("Not families found")
        }
        
        const familiesWithActiveMembers = await Promise.all(families.map(async(family)=>{
            const activeMembers = await this.calculateActiveMembersForFamily(family);
            return {
                ...family, 
                activeMembers
            }
        }))
        
        return familiesWithActiveMembers;
    }   


    


    private async calculateActiveMembersForFamily(family: Family): Promise<number> {
        // Get the most recent attendance record for the family
        const recentAttendance = await this.attendanceRepository
            .createQueryBuilder('attendance')
            .where('attendance.familyId = :familyId', { familyId: family.id })
            .orderBy('attendance.date', 'DESC') // Sort by date in descending order to get the most recent
            .getOne();

        if (!recentAttendance) {
            return 0; // If no attendance record is found, return 0 active members
        }

        // Calculate active members based on the most recent attendance record
        let activeMembersCount = 0;

        // Check attendance status and count active members
        if (
            recentAttendance.abaje || // Those who attended
            recentAttendance.abarwayi || // Those marked as sick
            recentAttendance.abafiteImpamvu // Those with valid excuses
        ) {
            activeMembersCount++;
        }

        return activeMembersCount;
    }
}
