import { Controller, Get, Param, Query } from '@nestjs/common';
import { SiteFetchingService } from './services/site-fetching.service';
import {
  Pagination,
  validateAndBuildPaginationParams,
} from 'src/utilities/paging/pagination.utils';

@Controller('sites')
export class SiteController {
  constructor(private readonly fetchingService: SiteFetchingService) {}

  @Get()
  getAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    const pagination: Pagination | null = validateAndBuildPaginationParams(
      page,
      pageSize,
    );

    return this.fetchingService.fetchAll(pagination);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.fetchingService.fetchOneById(id);
  }
}
