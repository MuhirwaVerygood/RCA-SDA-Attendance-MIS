import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Table name
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;
   
    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    isAdmin : boolean
}
