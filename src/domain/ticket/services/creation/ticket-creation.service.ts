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
    const truck: Truck = await this.fetchTruckOrFail(dto.truckId);

    this.logger.debug(
      `Creating ${dto.tickets.length} Tickets for Site: ${truck.site.name}...`,
    );

    this.validateTicketsOrThrow(dto.tickets);

    const createdTickets: Ticket[] = [];

    let siteCounter = await this.ticketFetchingService.fetchNextTicketSiteCount(
      truck.siteId,
    );

    // use for-loop to avoid spawning many Threads (unnecessary).
    for (let i = 0; i < dto.tickets.length; i++) {
      const newTicket = await this.createAndPersistNewTicket(
        dto.tickets[i],
        truck,
        siteCounter,
      );

      createdTickets.push(newTicket);

      siteCounter += 1;
    }

    if (createdTickets.length === 0) {
      this.logger.warn('No Tickets were created:');
      this.logger.warn(dto);
    } else {
      this.logger.debug(
        `${createdTickets.length} Tickets were created for Site: ${truck.site.name}!`,
      );
    }

    return createdTickets;
  }

  /**
   * Creates a Ticket for the Truck & persists to the Database.
   * @param ticketDto CreateTruckTicket
   * @param truck Truck
   * @param siteCounter Next Ticket-Count for the Ticket's Site.
   * @returns The new Ticket.
   */
  private async createAndPersistNewTicket(
    ticketDto: CreateTruckTicket,
    truck: Truck,
    siteCounter: number,
  ) {
    const exists = await this.ticketFetchingService.existsByTruckIdAndDispatch(
      truck.id,
      ticketDto.dispatchedAt,
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
      dispatchedAt: ticketDto.dispatchedAt,
    });

    // below is not ideal; however, it seems necessary to avoid re-fetching the Ticket entity
    // -- ask for help to optimize!
    newTicket.site = truck.site;
    newTicket.truck = truck;

    return newTicket;
  }

  /**
   * Fetches a Truck from the Database or throws a TicketCreationError.
   * @param truckId ID of the Truck to fetch.
   * @returns Truck
   */
  private async fetchTruckOrFail(truckId: number) {
    let truck: Truck | null;
    try {
      truck = await this.truckRepository.findByPk(truckId, {
        include: [Site],
      });
    } catch (err) {
      throw new TicketCreationError(err.message, err.stack, err);
    }

    if (truck == null) {
      throw new TicketCreationError(
        `Truck (id: ${truckId}) not found.`,
        new Error().stack,
      );
    }

    return truck;
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
          `Tickets cannot be dispatched at a future time. (${t.dispatchedAt}`,
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
