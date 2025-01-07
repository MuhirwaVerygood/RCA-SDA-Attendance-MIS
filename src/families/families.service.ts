import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './families.entity';

@Injectable()
export class FamiliesService {
    constructor(
        @InjectRepository(Family)
        private readonly familyRepository: Repository<Family>,
    ) { }

    // Create a new family
    async createFamily(
        familyName: string,
        father: string,
        mother: string,
    ): Promise<Family> {
        const family = this.familyRepository.create({ familyName, father, mother });
        return this.familyRepository.save(family);
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
