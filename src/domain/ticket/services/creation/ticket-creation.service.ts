import { Injectable, Logger } from '@nestjs/common';
import { MaterialType, Ticket } from '../../entities/ticket.entity';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateTruckTicket,
  CreateTruckTickets,
} from '../../dto/create-truck-tickets.dto';
import { Truck } from 'src/domain/truck/entities/truck.entity';
import { TicketCreationError } from './errors/ticket-creation.error';
import { TicketFetchingService } from '../fetching/ticket-fetching.service';
import { Site } from 'src/domain/site/entities/site.entity';

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
  }

  /**
   * Creates Tickets for a Truck.
   * @param dto Request-Contract
   * @returns Array of the created Tickets.
   */
  async createTruckTicketsInBulk(dto: CreateTruckTickets) {
    let truck: Truck | null;
    try {
      truck = await this.truckRepository.findByPk(dto.truckId, {
        include: [Site],
      });
      if (truck == null) {
        throw new TicketCreationError(
          `Truck (id: ${dto.truckId}) not found.`,
          new Error().stack,
        );
      }
    } catch (err) {
      throw new TicketCreationError(err.message, err.stack, err);
    }

    this.validateTicketsOrThrow(dto.tickets);

    this.logger.debug(
      `Creating ${dto.tickets.length} Tickets for Site: ${truck.site.name}.`,
    );

    const createdTickets: Ticket[] = [];

    let siteCounter = await this.ticketFetchingService.fetchNextTicketSiteCount(
      truck.siteId,
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

      // Figure out a way to get Sequelize to load the Site & Truck relationship
      // in response of this 'create' call.
      // ** { include } is not the way! (tried)
      const newTicket: Ticket = await this.ticketRepository.create({
        truckId: truck.id,
        siteId: truck.siteId,
        siteCounter,
        material: MaterialType.Soil,
        dispatchedAt: ticket.dispatchedAt,
      });

      // below is not ideal; however, it seems necessary to avoid re-fetching the Ticket entity
      // -- ask for help to optimize!
      newTicket.site = truck.site;
      newTicket.truck = truck;

      createdTickets.push(newTicket);

      siteCounter += 1;
    }

    return createdTickets;
  }

  /**
   * Validates (shallow) the CreateTruckTicket dto's. This will throw a Ticket-Creation-Error if invalid dto's are found.
   * @param tickets Array of CreateTruckTicket
   */
  validateTicketsOrThrow(tickets: CreateTruckTicket[]) {
    const now = new Date();
    tickets.forEach((t) => {
      if (t.dispatchedAt > now) {
        throw new TicketCreationError(
          `Tickets cannot be dispatched at a future time. (${t.dispatchedAt}`
        );
      }
    });

    const duplicateDispatches = this.getDuplicateDispatchesInArray(tickets);
    if (duplicateDispatches.length > 0) {
      throw new TicketCreationError('Duplicate Dispatch timestamps found!');
    }
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
