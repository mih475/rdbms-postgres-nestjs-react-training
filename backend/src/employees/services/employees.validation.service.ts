import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { any, ObjectSchema } from 'joi';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
@Injectable()
export class CustomValidationPipe implements PipeTransform {
  // constructor(private schema: ObjectSchema) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if(this.isEmpty(value)){
      throw new HttpException('Validation failed: No payload provided', HttpStatus.BAD_REQUEST)
    }
     const object = plainToClass(metadata.metatype, value);
     const errors = await validate(object);

     if(errors.length > 0){
       var message: string;
       message = this.formatErrors(errors)
       throw new HttpException('Validation failed: '+message, HttpStatus.BAD_REQUEST);
     }
     return value;
  }

  private isEmpty(value: any){
       if(Object.keys(value).length < 1){
         return true;
       }
       return false;
  }

  private formatErrors(errors: any[]){
    return errors.map( error => {
      for(let key in error.constraints){
        return error.constraints[key]
      }
    }).join(', ')
  }
}
