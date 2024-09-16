import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres', // hardcoded **
        username: configService.getOrThrow('DB__USERNAME'),
        password: configService.getOrThrow('DB__PASSWORD'),
        host: configService.getOrThrow('DB__HOST'),
        port: configService.getOrThrow('DB__PORT'),
        database: configService.getOrThrow('DB__DATABASE'),
        synchronize: false,
        autoLoadModels: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
