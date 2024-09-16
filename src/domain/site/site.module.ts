import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Site } from './entities/site.entity';

@Module({
  imports: [SequelizeModule.forFeature([Site])],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
