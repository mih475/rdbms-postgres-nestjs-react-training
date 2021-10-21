import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes } from "@nestjs/common";
import { registerSchema } from "class-validator";
import e from "cors";
import { catchError, from, map, Observable, tap } from "rxjs";
import { DeleteResult, UpdateResult } from "typeorm";
import { EmployeeInterface } from "../models/employees.interface";
import { EmployeeValidationDTO } from "../models/employees.validation.dto";
import { EmployeeService } from "../services/employees.service";
import { CustomValidationPipe } from "../services/employees.validation.service";

@Controller('employees')

export class EmployeeController {
    constructor(private employeeService: EmployeeService){}
    
    @Post('create')
    @UsePipes(new CustomValidationPipe())
    createEmployee(@Body() post: EmployeeValidationDTO): Observable<EmployeeInterface>{
        try {
            if(this.employeeService.doesEmployeeExist(post)){
                var message: string;
                message = "This employee already exists in database."
                throw new HttpException(message, HttpStatus.FORBIDDEN);
            }
            return from(this.employeeService.createEmployee(post))
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
        
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

    @Delete('delete/:id')
    @UsePipes(new CustomValidationPipe())
    deleteEmployee(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Observable<DeleteResult>{
        return from(this.employeeService.deleteEmployee(id))
    }
}