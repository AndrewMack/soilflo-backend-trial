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

@Exclude()
@Table({ tableName: 'trucks', timestamps: false })
export class Truck extends Model {
  @Expose()
  @PrimaryKey
  @Column
  id: number;

  @Expose()
  @Column
  license: string;

  @Expose()
  @ForeignKey(() => Site)
  @Column({ type: DataType.INTEGER })
  siteId: number;

  @Expose({ name: 'siteName' })
  @Transform(({ value }) => value?.name)
  @BelongsTo(() => Site)
  site: Site;
}
