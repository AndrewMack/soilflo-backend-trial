import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket } from '../../entities/ticket.entity';

@Injectable()
export class TicketFetchingService {
  constructor(
    @InjectModel(Ticket)
    private readonly ticketRepository: typeof Ticket,
  ) {}

  fetchAllByTruckId(truckId: number) {
    return this.ticketRepository.findAll({
      where: {
        truckId,
      },
    });
  }

  /**
   * Checks for the existence of Tickets based on Truck & Dispatch timestamp.
   * @param truckId Truck Id.
   * @param dispatch Dispatched-At timestamp.
   * @returns True if existing Tickets are found. Otherwise, False.
   */
  async existsByTruckIdAndDispatch(truckId: number, dispatch: Date) {
    // No Exists queries with Sequelize -- should revisit this to optimize. This is bad.

    const tickets = await this.ticketRepository.findAll({
      where: {
        truckId,
        dispatchedAt: dispatch,
      },
    });

    return tickets.length > 0;
  }

  /**
   * Fetches the number of Tickets found for a Site.
   * @param siteId Site Identifier
   * @returns 
   */
  async fetchNextTicketSiteCount(siteId: number) {
    const maxValOrNull = await this.ticketRepository.max<number, Ticket>(
      'siteCounter',
      {
        where: {
          siteId,
        },
      },
    );

    return (maxValOrNull ?? 0) + 1;
    /*
    return this.ticketRepository.count({
      where: {
        siteId,
      },
    });
    */
  }
}
