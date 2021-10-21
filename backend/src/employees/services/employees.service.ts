import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { from, Observable } from "rxjs";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { EmployeeEntity } from "../models/employees.entity";
import { EmployeeInterface } from "../models/employees.interface";
import { of } from "rxjs";
@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeesEntityRepository: Repository<EmployeeEntity>
    ) {}

    createEmployee(employeePost: EmployeeInterface): Observable<EmployeeInterface>{
        return from(this.employeesEntityRepository.save(employeePost));
    }

    doesEmployeeExist(employeePost: EmployeeInterface): Observable<boolean>{
        //const employee = this.employeesEntityRepository.findOne({ firstname: employeePost.firstname, lastname: employeePost.lastname })
        if(this.employeesEntityRepository.findOne({ firstname: employeePost.firstname, lastname: employeePost.lastname })){
            return of(true);
        }
        return of(false);
    }

    findAll(): Observable<EmployeeInterface[]>{
        return from(this.employeesEntityRepository.find());
    }

    findByID(id: number): Observable<EmployeeInterface>{
        return from(this.employeesEntityRepository.findOne({ id }));
    }

    updateEmployee(id: number, employeePost: EmployeeInterface): Observable<UpdateResult>{
        return from(this.employeesEntityRepository.update(id, employeePost));
    }

    deleteEmployee(id: number): Observable<DeleteResult>{
        return from(this.employeesEntityRepository.delete(id));
    }
}