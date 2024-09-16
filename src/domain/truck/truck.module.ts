import { Module } from '@nestjs/common';
import { TruckService } from './truck.service';
import { TruckController } from './truck.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Truck } from './entities/truck.entity';

@Module({
  imports: [SequelizeModule.forFeature([Truck])],
  controllers: [TruckController],
  providers: [TruckService],
})
export class TruckModule {}
