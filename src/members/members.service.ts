import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './members.entity';
import { Family } from 'src/families/families.entity';
@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member) private memberRepository: Repository<Member>,
        @InjectRepository(Family) private familyRepository: Repository<Family>,
    ) { }

    // Add a new member to a family
    async addMemberToFamily(familyId: number, memberData: Partial<Member>): Promise<Member> {
        const family = await this.familyRepository.findOne({ where: { id: familyId } });
        if (!family) {
            throw new NotFoundException(`Family with ID ${familyId} not found.`);
        }

        const member = this.memberRepository.create({ ...memberData, family });
        return this.memberRepository.save(member);
    }

    // Get all members of a family
    async getMembersByFamily(familyId: number): Promise<Member[]> {
        const family = await this.familyRepository.findOne({ where: { id: familyId }, relations: ['members'] });
        if (!family) {
            throw new NotFoundException(`Family with ID ${familyId} not found.`);
        }

        return family.members;
    }

    async getAllMembers(): Promise<Member[]>{
        return this.memberRepository.find()
    }

    // Get a single member by ID
    async getMemberById(memberId: number): Promise<Member> {
        const member = await this.memberRepository.findOne({ where: { id: memberId }, relations: ['family'] });
        if (!member) {
            throw new NotFoundException(`Member with ID ${memberId} not found.`);
        }

        return member;
    }

    // Update a member's details
    async updateMember(memberId: number, updateData: Partial<Member>): Promise<Member> {
        const member = await this.getMemberById(memberId);
        Object.assign(member, updateData);
        return this.memberRepository.save(member);
    }

    // Delete a member
    async deleteMember(memberId: number): Promise<{ message: string }> {
        const member = await this.getMemberById(memberId);
        await this.memberRepository.remove(member);
        return { message: "Member deleted successfully"}
    }
}
