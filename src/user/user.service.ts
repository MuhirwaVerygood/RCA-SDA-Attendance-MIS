import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { FamiliesService } from 'src/families/families.service';
import { MailerService } from '@nestjs-modules/mailer';
import { InviteFamilyHeadDto } from 'src/auth/user.dto';
@Injectable()
export class UserService {
  
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly familyService: FamiliesService,
        private readonly mailerService: MailerService
    ) { }

    

    async findById(id: number): Promise<User>{
        return this.userRepository.findOne({where:{id}})
    }


    async update(userId: number, updateData: any) {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new NotFoundException("User not found");
        }
        Object.assign(user, updateData)
        return await this.userRepository.save(user);
    }

    async create(data: Partial<User>): Promise<any> {
        if (!data.isAdmin) {
            throw new HttpException('Not allowed', HttpStatus.BAD_REQUEST);
        }

        const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
        if (existingUser) {
            throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
        }

        const user = this.userRepository.create({
            ...data,
            password: await bcrypt.hash(data.password, 10),
        });
        const savedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = savedUser; 
        return { message:"User registered successfully", user:userWithoutPassword};
    }


    async login(data: Partial<User>): Promise<{message: string, token: string, user: object}>{
        const userExists = await this.userRepository.findOne({ where: { email: data.email } })
        if (!userExists) throw new HttpException("Invalid password or email", HttpStatus.UNAUTHORIZED);
        const passwordMatches = await bcrypt.compare(data.password, userExists.password);
        if (!passwordMatches)throw new HttpException("Invalid  password or email", HttpStatus.UNAUTHORIZED)
        const payload = { id: userExists.id, isAdmin: userExists.isAdmin }
        const {password, ...result} = userExists
        return {
            message: "Logged in successfuly",
            user: result,
            token: await this.jwtService.signAsync(payload)
        }
    }

    async getProfile(req: any) {
        const userExists = await this.userRepository.findOne({ where: { id: req.user.id } , relations: ["family"] });
        const { password, ...result } = userExists;
        return result;
    }

  
    async addFamilyHeads(invitation: InviteFamilyHeadDto, req: any): Promise<{ message: string }> {
        const family = await this.familyService.getFamilyById(invitation.familyId);
        if (!family) {
            throw new HttpException('Family not found', HttpStatus.NOT_FOUND);
        }

        console.log(invitation.email);
        
        // Check if the user with this email already exists
        const existingUser = await this.userRepository.findOne({ where: { email: invitation.email } });
        if (existingUser) {
            throw new HttpException('Family leader with this email already exists', HttpStatus.CONFLICT);
        }

        // Create the new user with the role (father or mother)
        const newUser = await this.userRepository.create({
            username: invitation.username,
            email: invitation.email,
            password: await bcrypt.hash(invitation.password, 10),
            isFather: invitation.role === 'father',
            isMother: invitation.role === 'mother',
            isAdmin: false,
            family: family,
        });

        // Save the new user
        await this.userRepository.save(newUser);

        // Get all admins
        
        const allAdmins = await this.userRepository.find({ where: { isAdmin: true } });
        const otherAdmins = allAdmins.filter(admin => admin.email !== req.user.email);

        // Send email notifications to other admins
        for (const admin of otherAdmins) {
            const role = invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1);

            // Send an email to each admin about the new family head
            await this.mailerService.sendMail({
                to: admin.email,
                subject: 'New Family Head Added',
                text: `Dear ${admin.username}, \n\nThis is to inform you that the admin ${req.user.username} has added ${invitation.username} as a ${role} of the family: ${family.familyName}. \n\nBest regards,\nYour Admin Team`,
            });
        }

        return {
            message: `${invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)} added successfully`,
        };
    }

}
