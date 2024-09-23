import { Exclude, Expose } from 'class-transformer';
import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Exclude()
@Table({ tableName: 'sites', timestamps: false })
export class Site extends Model {
  @Expose()
  @PrimaryKey
  @Column
  id: number;

  @Expose()
  @Column
  name: string;

  @Expose()
  @Column
  address: string;

  @Expose()
  @Column
  description: string;
}
