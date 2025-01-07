import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Member } from "src/members/members.entity";
import { Attendance } from "src/attendance/attendance.entity";

@Entity("families")
export class Family {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    familyName: string;

    @Column()
    father: string;
    
    @Column()
    mother: string;

    @OneToMany(() => Member, (member) => member.family, { cascade: true })
    members: Member[];

    @OneToMany(()=>Attendance, (attendance)=> attendance.family, {cascade: true} )
    attendances: Attendance[]
}
