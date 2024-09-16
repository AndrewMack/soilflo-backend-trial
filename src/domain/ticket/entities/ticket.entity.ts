import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

export enum MaterialType {
  Soil = 'Soil',
}

@Table({ tableName: 'tickets', timestamps: false })
export class Ticket extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column({ field: 'truck_id' })
  truckId: number;

  @Column({ field: 'site_id' })
  siteId: number;

  @Column({ type: DataType.ENUM({ values: Object.values(MaterialType) }) })
  material: MaterialType;
}
