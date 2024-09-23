import { InjectModel } from '@nestjs/sequelize';
import SitesData from './../../../data/sites.json';
import { Site } from '../entities/site.entity';
import { Injectable, Logger } from '@nestjs/common';

interface SiteJSON {
  id: number;
  name: string;
  address: string;
  description: string;
}

@Injectable()
export class SiteSeedingService {
  private readonly logger: Logger;
  constructor(
    @InjectModel(Site)
    private readonly siteRepository: typeof Site,
  ) {
    this.logger = new Logger(SiteSeedingService.name);
  }

  /**
   * Determines if the Sites table in the Database has any Records.
   * @returns True if there are records; otherwise, false.
   */
  async hasRecords() {
    return (await this.siteRepository.count()) > 0;
  }

  /**
   * Adds the Sites records found in the Sites-JSON data to the configured Database.
   * @returns Promise<Site[]>
   */
  seed() {
    this.logger.log('Running Sites-Seeder!');
    return this.siteRepository.bulkCreate(
      (SitesData as SiteJSON[]).map((siteData) => ({
        id: siteData.id,
        name: siteData.name,
        address: siteData.address,
        description: siteData.description,
      })),
    );
  }
}
