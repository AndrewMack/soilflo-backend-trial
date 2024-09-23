import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { TruckFetchingService } from './services/truck-fetching.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('trucks')
export class TruckController {
  constructor(private readonly fetchingService: TruckFetchingService) {}

  @Get()
  getAll() {
    return this.fetchingService.fetchAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.fetchingService.fetchOneById(id);
  }
}
