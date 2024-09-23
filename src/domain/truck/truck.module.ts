import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Truck } from './entities/truck.entity';
import { TruckController } from './truck.controller';
import { TruckFetchingService } from './services/truck-fetching.service';

@Module({
  imports: [SequelizeModule.forFeature([Truck])],
  providers: [TruckFetchingService],
  controllers: [TruckController],
})
export class TruckModule {}
