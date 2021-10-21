import { IsNotEmpty } from 'class-validator'


export class EmployeeValidationDTO {
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    role: string;

    @IsNotEmpty()
    email: string;
}