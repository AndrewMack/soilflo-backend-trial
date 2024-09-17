import { Table, Column, Model, PrimaryKey, HasMany } from 'sequelize-typescript';
import { Truck } from 'src/domain/truck/entities/truck.entity';

@Table({ tableName: 'sites', timestamps: false })
export class Site extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  name: string;

  @Column
  address: string;

  @Column
  description: string;

  @HasMany(() => Truck, 'siteId')
  trucks: Truck[];
}
