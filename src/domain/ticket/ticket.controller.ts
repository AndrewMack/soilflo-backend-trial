import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  BadRequestException,
  ParseArrayPipe,
} from '@nestjs/common';
import { CreateTruckTickets } from './dto/create-truck-tickets.dto';
import { TicketCreationService } from './services/creation/ticket-creation.service';
import { TicketFetchingService } from './services/fetching/ticket-fetching.service';
import { TicketFetchArgs } from './services/fetching/ticket-fetch.args';

@Controller()
export class TicketController {
  constructor(
    private readonly ticketCreationService: TicketCreationService,
    private readonly ticketFetchingService: TicketFetchingService,
  ) {}

  @Get('tickets')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll(
    @Query('siteIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    siteIds: number[],
    @Query('startDate')
    startDate: Date,
    @Query('endDate')
    endDate: Date,
  ) {
    const fetchParams: TicketFetchArgs = {};
    if (siteIds != null) {
      fetchParams.siteIds = siteIds;
    }

    if (startDate != null || endDate != null) {
      if (startDate == null || endDate == null) {
        throw new BadRequestException(
          'Both Start-Date & End-Date must by provided.',
        );
      }

      fetchParams.dateRange = {
        start: startDate,
        end: endDate,
      };
    }

    return await this.ticketFetchingService.fetchAllBy(fetchParams);
  }

  @Post('create-truck-tickets')
  @UseInterceptors(ClassSerializerInterceptor)
  async createInBulk(@Body() dto: CreateTruckTickets) {
    return await this.ticketCreationService.createTruckTicketsInBulk(dto);
  }
}
