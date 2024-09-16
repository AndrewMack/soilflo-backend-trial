import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SiteService {
  constructor(
    @InjectModel(Site)
    private siteRepository: typeof Site,
  ) {}

  create(createSiteDto: CreateSiteDto) {
    return 'This action adds a new site';
  }

  findAll() {
    return this.siteRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} site`;
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
  }
}
