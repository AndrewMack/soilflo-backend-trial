import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Site } from 'src/domain/site/entities/site.entity';

@Table({ tableName: 'trucks', timestamps: false })
export class Truck extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  license: string;

  @ForeignKey(() => Site)
  @Column({ type: DataType.INTEGER })
  siteId: number;

  @BelongsTo(() => Site)
  site: Site;
}
