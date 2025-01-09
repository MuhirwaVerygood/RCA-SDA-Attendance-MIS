import { Family } from 'src/families/families.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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

    @ManyToOne(() => Family, (family) => family.heads, { nullable: true, onDelete: 'SET NULL' })
    family: Family;     
}

