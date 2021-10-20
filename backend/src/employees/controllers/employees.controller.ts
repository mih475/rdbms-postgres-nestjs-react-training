import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { from, Observable } from "rxjs";
import { DeleteResult, UpdateResult } from "typeorm";
import { EmployeeInterface } from "../models/employees.interface";
import { EmployeeService } from "../services/employees.service";

@Controller('employees')

export class EmployeeController {
    constructor(private employeeService: EmployeeService){}
    
    @Post('create')
    createEmployee(@Body() post: EmployeeInterface): Observable<EmployeeInterface>{
        return from(this.employeeService.createEmployee(post));
    }

    @Get('data')
    findall(): Observable<EmployeeInterface[]>{
        return from(this.employeeService.findAll());
    }

    @Put('update/:id')
    updateEmployee(@Param('id') id: number, @Body() post: EmployeeInterface): Observable<UpdateResult>{
        return from(this.employeeService.updateEmployee(id, post))
    }

    @Delete('delete/:id')
    deleteEmployee(@Param('id') id: number): Observable<DeleteResult>{
        return from(this.employeeService.deleteEmployee(id))
    }
}