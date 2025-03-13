import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { CreateBoltResultInput } from './dto/create-boltResult.input';

export class CreateBoltResultsInput {
  @ArrayMinSize(1, { message: 'At least one bolt result is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateBoltResultInput)
  createBoltResultsInput: CreateBoltResultInput[]; // Updated name
}
