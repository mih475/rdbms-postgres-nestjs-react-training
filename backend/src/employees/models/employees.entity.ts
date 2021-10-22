import { Exclude } from "class-transformer";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('employees_model')
export class EmployeeEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    firstname: string;

    @Column({ default: '' })
    lastname: string;

    @Column({ default: '' })
    role: string;

    @Column({ default: '' })
    email: string;

    @DeleteDateColumn()
    deletedAt: Date;
}