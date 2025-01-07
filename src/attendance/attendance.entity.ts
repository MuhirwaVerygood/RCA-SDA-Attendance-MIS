import { Family } from "src/families/families.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('attendances')
export class Attendance{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    abanditswe: number
    @Column()
    abaje: number
    @Column()
    abasuye: number
    @Column()
    abasuwe: number
    @Column()
    abafashije: number
    @Column()
    abafashijwe: number
    @Column()
    abatangiyeIsabato: number
    @Column()
    abarwayi: number
    @Column()
    abafiteImpamvu: number

    @Column()
    abashyitsi: number

    @Column({ type: "date" })
    date: string   
        
    @ManyToOne(()=> Family , (family)=> family.attendances, {onDelete: "CASCADE"})
    family: Family
}