import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ticket } from './entities/ticket.entity';
import { TicketCreationService } from './services/creation/ticket-creation.service';
import { Truck } from '../truck/entities/truck.entity';
import { TicketFetchingService } from './services/fetching/ticket-fetching.service';

@Module({
  imports: [SequelizeModule.forFeature([Ticket, Truck])], // ask for best-practice and/or company preference
  controllers: [TicketController],
  providers: [TicketService, TicketCreationService, TicketFetchingService],
})
export class TicketModule {}
