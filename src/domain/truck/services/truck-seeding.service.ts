import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Truck } from '../entities/truck.entity';
import TrucksData from './../../../data/trucks.json';

interface TruckJSON {
  id: number;
  siteId: number;
  license: string;
}

@Injectable()
export class TruckSeedingService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(Truck)
    private readonly truckRepository: typeof Truck,
  ) {
    this.logger = new Logger(TruckSeedingService.name);
  }

  /**
   * Determines if the Trucks table in the Database has any Records.
   * @returns True if there are records; otherwise, false.
   */
  async hasRecords() {
    return (await this.truckRepository.count()) > 0;
  }

  seed() {
    this.logger.log('Running Trucks-Seeder!');
    return this.truckRepository.bulkCreate(
      (TrucksData as TruckJSON[]).map((truck) => ({
        id: truck.id,
        siteId: truck.siteId,
        license: truck.license,
      })),
    );
  }
}
