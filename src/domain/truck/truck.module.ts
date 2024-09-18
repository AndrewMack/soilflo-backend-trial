import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Truck } from './entities/truck.entity';

@Module({
  imports: [SequelizeModule.forFeature([Truck])],
})
export class TruckModule {}
