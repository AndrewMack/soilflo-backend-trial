import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Truck } from './entities/truck.entity';
import { TruckController } from './truck.controller';
import { TruckFetchingService } from './services/truck-fetching.service';
import { TruckSeedingService } from './services/truck-seeding.service';

@Module({
  imports: [SequelizeModule.forFeature([Truck])],
  providers: [TruckFetchingService, TruckSeedingService],
  controllers: [TruckController],
  exports: [TruckSeedingService],
})
export class TruckModule {}
