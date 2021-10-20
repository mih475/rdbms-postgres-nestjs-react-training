import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { from, Observable } from "rxjs";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { EmployeeEntity } from "../models/employees.entity";
import { EmployeeInterface } from "../models/employees.interface";

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeesEntityRepository: Repository<EmployeeEntity>
    ) {}

    createEmployee(employeePost: EmployeeInterface): Observable<EmployeeInterface>{
        return from(this.employeesEntityRepository.save(employeePost));
    }

    findAll(): Observable<EmployeeInterface[]>{
        return from(this.employeesEntityRepository.find());
    }

    updateEmployee(id: number, employeePost: EmployeeInterface): Observable<UpdateResult>{
        return from(this.employeesEntityRepository.update(id, employeePost));
    }

    deleteEmployee(id: number): Observable<DeleteResult>{
        return from(this.employeesEntityRepository.delete(id));
    }
}