import { Injectable, Logger } from '@nestjs/common';
import { MaterialType, Ticket } from '../../entities/ticket.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTruckTicket, CreateTruckTickets } from '../../dto/create-truck-tickets.dto';
import { Truck } from 'src/domain/truck/entities/truck.entity';
import { TicketCreationError } from './errors/ticket-creation.error';
import { TicketFetchingService } from '../fetching/ticket-fetching.service';

@Injectable()
export class TicketCreationService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(Ticket)
    private readonly ticketRepository: typeof Ticket,
    @InjectModel(Truck)
    private readonly truckRepository: typeof Truck,
    private readonly ticketFetchingService: TicketFetchingService,
  ) {
    this.logger = new Logger(TicketCreationService.name);

    this.logger.log('I have been constructed!');
  }

  async createTruckTicketsInBulk(dto: CreateTruckTickets) {
    let truck: Truck | null;
    try {
      truck = await this.truckRepository.findByPk(dto.truckId);
      if (truck == null) {
        throw new TicketCreationError(
          `Truck (id: ${dto.truckId}) not found.`,
          new Error().stack,
        );
      }
    } catch (err) {
      throw new TicketCreationError(err.message, err.stack, err);
    }

    const duplicateDispatches = this.getDuplicateDispatchesInArray(dto.tickets);
    if (duplicateDispatches.length > 0) {
      throw new TicketCreationError('Duplicate Dispatch timestamps found!');
    }

    const createdTickets: Ticket[] = [];

    let siteCounter = await this.ticketFetchingService.fetchNextTicketSiteCount(
      truck.site_id,
    );

    // use for-loop to avoid spawning many Threads
    for (let i = 0; i < dto.tickets.length; i++) {
      const ticket: CreateTruckTicket = dto.tickets[i];
      const exists =
        await this.ticketFetchingService.existsByTruckIdAndDispatch(
          dto.truckId,
          ticket.dispatchedAt,
        );
      if (exists) {
        throw new TicketCreationError('Duplicate Dispatch timestamps found!');
      }

      const newTicket: Ticket = await this.ticketRepository.create({
        truckId: truck.id,
        siteId: truck.site_id,
        siteCounter,
        material: MaterialType.Soil,
        dispatchedAt: ticket.dispatchedAt,
      });

      siteCounter += 1;

      createdTickets.push(newTicket);
    }

    return createdTickets;
  }

  /**
   * Finds and returns duplicate moments found in a collection of ${CreateTruckTicket}.
   * @param tickets An Array of CreateTruckTicket
   */
  getDuplicateDispatchesInArray(tickets: CreateTruckTicket[]) {
    const dispatches: Map<number, number> = new Map();
    tickets.forEach((t) => {
      const dispatchedValue = t.dispatchedAt.valueOf(); // to protect form differing time-zones representing the same moment

      if (!dispatches.has(dispatchedValue)) {
        dispatches.set(dispatchedValue, 0);
      }

      dispatches.set(dispatchedValue, dispatches.get(dispatchedValue) + 1);
    });

    const duplicates: Date[] = [];

    dispatches.forEach((occurrences, dateValue) => {
      if (occurrences > 1) {
        duplicates.push(new Date(dateValue));
      }
    });

    return duplicates;
  }
}
