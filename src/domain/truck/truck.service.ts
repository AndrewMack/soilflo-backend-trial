import { Injectable } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Truck } from './entities/truck.entity';

@Injectable()
export class TruckService {
  constructor(
    @InjectModel(Truck)
    private truckRepository: typeof Truck,
  ) {}

  create(createTruckDto: CreateTruckDto) {
    return 'This action adds a new truck';
  }

  findAll() {
    return this.truckRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} truck`;
  }

  update(id: number, updateTruckDto: UpdateTruckDto) {
    return `This action updates a #${id} truck`;
  }

  remove(id: number) {
    return `This action removes a #${id} truck`;
  }
}
