import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Site } from './entities/site.entity';
import { SiteController } from './site.controller';
import { SiteFetchingService } from './services/site-fetching.service';

@Module({
  imports: [SequelizeModule.forFeature([Site])],
  providers: [SiteFetchingService],
  controllers: [SiteController],
})
export class SiteModule {}
