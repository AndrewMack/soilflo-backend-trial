import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

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
}
