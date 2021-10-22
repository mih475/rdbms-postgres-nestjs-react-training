import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes, ArgumentsHost, NotFoundException, Res, UseFilters, Catch, ConflictException } from "@nestjs/common";
import { catchError, from, map, Observable, tap } from "rxjs";
import { DeleteResult, UpdateResult } from "typeorm";
import { EmployeeInterface } from "../models/employees.interface";
import { EmployeeValidationDTO } from "../models/employees.validation.dto";
import { EmployeeService } from "../services/employees.service";
import { CustomValidationPipe } from "../services/employees.validation.service";
import { HttpExceptionFilter } from "../models/employees.exceptionFilter";
import { Response } from "express";
@Controller('employees')

export class EmployeeController {
    constructor(private employeeService: EmployeeService){}
    
    @Post('create')
    @UsePipes(new CustomValidationPipe())
    @UseFilters(new HttpExceptionFilter())
    async createEmployee(@Body() post: EmployeeValidationDTO){        
        return await this.employeeService.createEmployee(post);      
    }

    @Get('data')
    @UsePipes(new CustomValidationPipe())
    findall(): Observable<EmployeeInterface[]>{
        return from(this.employeeService.findAll());
    }

    @Get('data/:id')
    @UsePipes(new CustomValidationPipe())
    findByID(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Observable<EmployeeInterface>{
        return from(this.employeeService.findByID(id));
    }

    @Put('update/:id')
    @UsePipes(new CustomValidationPipe())
    updateEmployee(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() post: EmployeeInterface): Observable<UpdateResult>{
        console.log(id);
        console.log(post);
        return from(this.employeeService.updateEmployee(id, post))
    }

    // This function is to delete data permanently
    // @Delete('delete/:id')
    // @UsePipes(new CustomValidationPipe())
    // deleteEmployee(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Observable<DeleteResult>{
    //     return from(this.employeeService.deleteEmployee(id))
    // }

    // This function is to soft delete data
    @Delete('delete/:id')
    @UsePipes(new CustomValidationPipe())
    async softDeleteEmployee(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number){
        return await(this.employeeService.softDeleteEmployee(id))
    }

}