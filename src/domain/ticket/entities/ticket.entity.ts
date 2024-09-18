import { Exclude, Expose, Transform } from 'class-transformer';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Site } from 'src/domain/site/entities/site.entity';
import { Truck } from 'src/domain/truck/entities/truck.entity';

export enum MaterialType {
  Soil = 'Soil',
}
@Exclude()
@Table({ tableName: 'tickets', timestamps: false })
export class Ticket extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number;

  @ForeignKey(() => Truck)
  @Column
  truckId: number;

  @Expose({ name: 'truckLicense' })
  @Transform(({ value }) => value?.license)
  @BelongsTo(() => Truck)
  truck: Truck;

  @ForeignKey(() => Site)
  @Column({ type: DataType.INTEGER })
  siteId: number;

  @Expose({ name: 'siteName' })
  @Transform(({ value }) => value?.name)
  @BelongsTo(() => Site)
  site: Site;

  @Expose({ name: 'ticketNumber' })
  @Column
  siteCounter: number;

  @Expose()
  @Column({ type: DataType.ENUM({ values: Object.values(MaterialType) }) })
  material: MaterialType;

  @Expose()
  @Column
  dispatchedAt: Date;
}
