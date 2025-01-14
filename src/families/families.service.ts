import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './families.entity';
import { CreateFamilyDto } from './families.dto';
import * as argon2 from "argon2"
import { User } from 'src/auth/user.entity';
import { Member } from 'src/members/members.entity';

@Injectable()
export class FamiliesService {
    constructor(
        @InjectRepository(Family)
        private readonly familyRepository: Repository<Family>,

        @InjectRepository(Member)
        private readonly  memberRepository : Repository<Member> ,
            
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    // Create a new family
    async createFamily(familyRequest: CreateFamilyDto): Promise<object> {
        const { father_email, mother_email, password, father, mother, familyName } = familyRequest;

        
        // Hash the password once
        const hashedPassword = await argon2.hash(password);

        // Reusable function for creating user accounts
        const createUserAccount = async (username: string, email: string, isFather: boolean, isMother: boolean) => {
            const userAccount = this.userRepository.create({
                username,
                email,
                password: hashedPassword,
                isAdmin: false,
                isFather,
                isMother,
            });


            return this.userRepository.save(userAccount);
        };

        // Create mother and father accounts
        await createUserAccount(mother, mother_email, false, true);
        await createUserAccount(father, father_email, true, false);

        // Create the family record
        const family = this.familyRepository.create({
            familyName,
            father,
            mother,
        });
        
        await this.familyRepository.save(family);

        const motherAsMember = await this.memberRepository.create({ name: father, class: familyRequest.father_class, family })
        await this.memberRepository.save(motherAsMember)
      const fatherAsMember =   await this.memberRepository.create({ name: mother, class: familyRequest.mother_class, family })
        await this.memberRepository.save(fatherAsMember)
        return family;
    }

    // Get all families
    async getAllFamilies(): Promise<Family[]> {
        return this.familyRepository.find({ relations: ['members'] });
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
}
