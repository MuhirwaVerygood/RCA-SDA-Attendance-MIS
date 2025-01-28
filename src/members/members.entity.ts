import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Family } from "src/families/families.entity";
@Entity("members")
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    class: string;

    @ManyToOne(() => Family, (family) => family.members, { onDelete: "CASCADE" })
    family: Family;
}
