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
  Param,
} from '@nestjs/common';
import {
  CreateTruckTicket,
  CreateTruckTickets,
} from './dto/create-truck-tickets.dto';
import { TicketCreationService } from './services/creation/ticket-creation.service';
import { TicketFetchingService } from './services/fetching/ticket-fetching.service';
import { TicketFetchArgs } from './services/fetching/ticket-fetch.args';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class TicketController {
  constructor(
    private readonly ticketCreationService: TicketCreationService,
    private readonly ticketFetchingService: TicketFetchingService,
  ) {}

  @Get('tickets')
  async getAll(
    @Query(
      'siteIds',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
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

  @Post('trucks/:truckId/create-tickets')
  async createTruckTicketsInBulk(
    @Body(new ParseArrayPipe({ items: CreateTruckTicket }))
    dto: CreateTruckTicket[],
    @Param('truckId') truckId: number,
  ) {
    return await this.ticketCreationService.createTruckTicketsInBulk({
      truckId,
      tickets: dto,
    });
  }

  @Post('create-truck-tickets')
  async createInBulk(@Body() dto: CreateTruckTickets) {
    return await this.ticketCreationService.createTruckTicketsInBulk(dto);
  }
}
