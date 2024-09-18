import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket } from '../../entities/ticket.entity';
import { Truck } from 'src/domain/truck/entities/truck.entity';
import { Site } from 'src/domain/site/entities/site.entity';
import { TicketFetchArgs } from './ticket-fetch.args';
import { WhereOptions, Op } from 'sequelize';

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
      include: [Truck, Site],
    });
  }

  /**
   * Fetches Tickets using the arguments passed in.
   * @param args Ticket-Fetch Arguments
   * @returns An Array of Tickets, ordered by their Dispatched date and Site-Id.
   */
  fetchAllBy(args: TicketFetchArgs) {
    const where: WhereOptions<Ticket> = {};

    if (args.truckIds != null) {
      if (args.truckIds.length === 0) {
        throw new BadRequestException('Truck-Ids cannot be an empty array.');
      }
      where.truckId = {
        [Op.in]: args.truckIds,
      };
    }

    if (args.siteIds != null) {
      if (args.siteIds.length === 0) {
        throw new BadRequestException('Site-Ids cannot be an empty array.');
      }
      where.siteId = {
        [Op.in]: args.siteIds,
      };
    }

    if (args.dateRange != null) {
      where.dispatchedAt = {
        [Op.between]: [args.dateRange.start, args.dateRange.end],
      };
    }

    return this.ticketRepository.findAll({
      where,
      order: ['dispatchedAt', 'siteId'],
      include: [Site, Truck],
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
   * @returns The next Ticket-Site-Count (number) of the Site.
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
  }
}
