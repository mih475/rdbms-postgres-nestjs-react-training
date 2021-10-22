import { ConflictException, ExceptionFilter, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { catchError, from, Observable } from "rxjs";
import { DeleteResult, Entity, Repository, UpdateResult } from "typeorm";
import { EmployeeEntity } from "../models/employees.entity";
import { EmployeeInterface } from "../models/employees.interface";
import { of } from "rxjs";
@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeesEntityRepository: Repository<EmployeeEntity>
    ) {}

    async createEmployee(employeePost: EmployeeInterface){
        try {
            if( await this.employeesEntityRepository.findOne({ 
                where: {firstname: employeePost.firstname, lastname: employeePost.lastname},
                withDeleted: true 
            })){
                throw new ConflictException(`Employee already exists!`)
            }
            else if( await this.employeesEntityRepository.findOne({ 
                where: {email: employeePost.email},
                withDeleted: true
            })){
                throw new ConflictException(`This email has already been taken!`)
            }
            else{
                return await this.employeesEntityRepository.save(employeePost);
            }
        } catch (error) {
            return error;
        }
    }

    findAll(): Observable<EmployeeInterface[]>{
        return from(this.employeesEntityRepository.find({ order: { id: 'ASC'}}));
    }

    findByID(id: number): Observable<EmployeeInterface>{
        return from(this.employeesEntityRepository.findOne({ id }));
    }

    async updateEmployee(id: number, employeePost: EmployeeInterface) {
        try {
            const empExistwFirstnLastName = await this.employeesEntityRepository.findOne({ 
                where: {firstname: employeePost.firstname, lastname: employeePost.lastname},
                withDeleted: true
            });
            const id_dupl_emp_name = this.employeesEntityRepository.getId(empExistwFirstnLastName);
            const empExistwEmail = await this.employeesEntityRepository.findOne({ 
                where: {email: employeePost.email},
                withDeleted: true 
            });
            const id_dupl_emp_email = this.employeesEntityRepository.getId(empExistwEmail);

            if((!id_dupl_emp_name) && (!id_dupl_emp_email)){
                return this.employeesEntityRepository.update(id, employeePost);
            }
            else if(id === id_dupl_emp_name && (!id_dupl_emp_email)){
                return this.employeesEntityRepository.update(id, employeePost);
            }
            else if((!id_dupl_emp_name) && id === id_dupl_emp_email){
                return this.employeesEntityRepository.update(id, employeePost);
            }
            else if(id === id_dupl_emp_name && id === id_dupl_emp_email){
                return this.employeesEntityRepository.update(id, employeePost);
            }
            else if((!id_dupl_emp_name) && id !== id_dupl_emp_email){
                throw new ConflictException(`Can't put other employee's email`)
            }
            else if(id === id_dupl_emp_name && id !== id_dupl_emp_email){
                throw new ConflictException(`Can't put other employee's email`)
            }
            else if(id !== id_dupl_emp_name && (!id_dupl_emp_email)){
                throw new ConflictException(`Can't put other employee's first and last name`)
            }
            else if(id !== id_dupl_emp_name && id === id_dupl_emp_email){
                throw new ConflictException(`Can't put other employee's first and last name`)
            }
            else{
                throw new ConflictException(`Can't put other employee's information`)
            }
        } catch (error) {
            return error;
        }
    }

    deleteEmployee(id: number): Observable<DeleteResult>{
        return from(this.employeesEntityRepository.delete(id));
    }

    softDeleteEmployee(id: number): Observable<DeleteResult>{
        this.employeesEntityRepository.softDelete({ id });
        return;
    }
}