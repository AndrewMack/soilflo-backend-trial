import { Injectable } from '@nestjs/common';
import { Truck } from '../entities/truck.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Site } from 'src/domain/site/entities/site.entity';

@Injectable()
export class TruckFetchingService {
  constructor(
    @InjectModel(Truck)
    private readonly truckRepository: typeof Truck,
  ) {}

  /**
   * Fetches a Truck from the Database using an Id.
   * @param id A Truck's Identifier.
   * @returns Truck | null
   */
  fetchOneById(id: number) {
    return this.truckRepository.findByPk(id, { include: [Site] });
  }

  /**
   * Fetches a Truck from the Database using a License.
   * @param license Truck License.
   * @returns Truck | null
   */
  fetchOneByLicense(license: string) {
    return this.truckRepository.findOne({
      where: { license },
      include: [Site],
    });
  }

  /**
   * Fetches Trucks from the Database.
   * @returns Truck[] ordered by License.
   */
  fetchAll() {
    return this.truckRepository.findAll({
      order: ['license'],
      include: [Site],
    });
  }
}
