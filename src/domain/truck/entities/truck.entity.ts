import { Table } from 'sequelize-typescript';
import { Model, InferAttributes, InferCreationAttributes, ForeignKey, NonAttribute, CreationOptional } from 'sequelize';
import { Site } from 'src/domain/site/entities/site.entity';

@Table({ tableName: 'trucks', timestamps: false })
export class Truck extends Model<
  InferAttributes<Truck>,
  InferCreationAttributes<Truck>
> {
  declare id: CreationOptional<number>;

  declare license: string;

  declare siteId: ForeignKey<Site['id']>;

  declare site: NonAttribute<Site>;
}
