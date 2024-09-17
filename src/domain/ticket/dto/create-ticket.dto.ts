import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  truckId: number;

  @IsNotEmpty()
  @IsDate()
  dispatchedAt: Date;
}
