import { Type } from 'class-transformer';
import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Site } from 'src/domain/site/entities/site.entity';

@Table({ tableName: 'trucks', timestamps: false })
export class Truck extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  declare id: number;

  @Column
  declare license: string;

  @ForeignKey(() => Site)
  @Column({ field: 'site_id' })
  declare siteId: number;

  @BelongsTo(() => Site, 'siteId')
  declare site: Site;
}
