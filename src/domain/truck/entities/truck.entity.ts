import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'trucks', timestamps: false })
export class Truck extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  license: string;

  @Column
  site_id: number;
}
