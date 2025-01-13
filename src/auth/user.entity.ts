import { Expose } from 'class-transformer';
import { Family } from 'src/families/families.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, IsNull } from 'typeorm';

@Entity('users') // Table name
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    isAdmin: boolean
    
    @Column()
    isFather: boolean
    
    @Column()
    isMother: boolean

    @Column({default:""})
    refreshToken: string 

    @ManyToOne(() => Family, (family) => family.heads, { nullable: true, onDelete: 'SET NULL' })
    family: Family;     
}
