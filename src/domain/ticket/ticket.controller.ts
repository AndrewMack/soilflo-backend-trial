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

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll() {
    const startDate = new Date('2024-09-17T14:40:18.000Z');
    const endDate = new Date('2024-09-17T14:47:18.000Z');
    return await this.ticketFetchingService.fetchAllBy({
      siteIds: [1, 11],
      dateRange: {
        start: startDate,
        end: endDate,
      },
    });
  }

  @Post('create-truck-tickets')
  @UseInterceptors(ClassSerializerInterceptor)
  async createInBulk(@Body() dto: CreateTruckTickets) {
    return await this.ticketCreationService.createTruckTicketsInBulk(dto);
  }
}
