import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeController } from "./controllers/employees.controller";
import { EmployeeEntity } from "./models/employees.entity";
import { EmployeeService } from "./services/employees.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([EmployeeEntity])
    ],
    providers: [EmployeeService],
    controllers: [EmployeeController]
})
export class EmployeeModule {}