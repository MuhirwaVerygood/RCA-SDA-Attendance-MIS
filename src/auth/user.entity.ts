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


    @Column({ default: "" })
     post: string   

    @Column({default:""})
    profileName: string

    @Column({ default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" })
    image: string

    @Column({nullable: true})
    refreshToken: string 

    @ManyToOne(() => Family, (family) => family.heads, { nullable: true, onDelete: 'SET NULL' })
    family: Family;     
}

