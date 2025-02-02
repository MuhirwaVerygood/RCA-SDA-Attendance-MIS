import { Family } from "src/families/families.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('attendances')
export class Attendance{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    abanditswe: number
    @Column( {default: 0} )
    abaje: number
    @Column({default: 0} )
    
    abasuye: number
    @Column({default: 0} )
    abasuwe: number
    @Column({default: 0} )
    abafashije: number
    @Column({default: 0} )
    abafashijwe: number
    @Column({default: 0} )
    abatangiyeIsabato: number
    @Column({default: 0} )
    abarwayi: number
    @Column({default: 0} )
    abafiteImpamvu: number

    @Column({default: 0} )
    abize7: number
    
    @Column({default: 0} )
    abashyitsi: number

    @Column({ type: "date" })
    date: Date   
        
    @ManyToOne(()=> Family , (family)=> family.attendances, {onDelete: "CASCADE"})
    family: Family
}