import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Site } from './entities/site.entity';

@Module({
  imports: [SequelizeModule.forFeature([Site])],
})
export class SiteModule {}
