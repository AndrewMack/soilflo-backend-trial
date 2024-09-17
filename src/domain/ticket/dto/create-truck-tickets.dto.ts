import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class CreateTruckTicket {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dispatchedAt: Date;
}

export class CreateTruckTickets {
  @IsNumber()
  truckId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateTruckTicket)
  tickets: CreateTruckTicket[];
}
