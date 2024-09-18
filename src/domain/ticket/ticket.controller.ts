import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateTruckTickets } from './dto/create-truck-tickets.dto';
import { TicketCreationService } from './services/creation/ticket-creation.service';
import { TicketFetchingService } from './services/fetching/ticket-fetching.service';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketCreationService: TicketCreationService,
    private readonly ticketFetchingService: TicketFetchingService,
  ) {}

  @Post('create-truck-tickets')
  @UseInterceptors(ClassSerializerInterceptor)
  async createInBulk(@Body() dto: CreateTruckTickets) {
    return await this.ticketCreationService.createTruckTicketsInBulk(dto);
  }
}
