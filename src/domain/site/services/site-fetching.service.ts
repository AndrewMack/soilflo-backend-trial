import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Site } from '../entities/site.entity';
import { Pagination } from 'src/utilities/paging/pagination.utils';
import { FindOptions } from 'sequelize';

@Injectable()
export class SiteFetchingService {
  constructor(
    @InjectModel(Site)
    private readonly siteRepository: typeof Site,
  ) {}

  /**
   * Fetches a Site by its Id.
   * @param id Site Id.
   * @returns Site | null
   */
  fetchOneById(id: number) {
    return this.siteRepository.findByPk(id);
  }

  /**
   * Fetches all of the Sites.
   * @returns Site[] ordered by Name and Id.
   */
  fetchAll(pagination?: Pagination) {
    const options: FindOptions<Site> = { order: ['name', 'id'] };

    if (pagination != null) {
      options.limit = pagination.size;
      options.offset = (pagination.page - 1) * pagination.size;
    }
    return this.siteRepository.findAll(options);
  }
}
