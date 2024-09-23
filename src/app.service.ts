import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SiteSeedingService } from './domain/site/services/site-seeding.service';
import { TruckSeedingService } from './domain/truck/services/truck-seeding.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly siteSeedingService: SiteSeedingService,
    private readonly truckSeedingService: TruckSeedingService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.debug('Application has been boostrapped!');

    if (this.configService.get('DB__RUN_SEEDS') !== 'true') {
      this.checkForRecords();
      return;
    }

    this.runSeeds();
  }

  /**
   * Checks for necessary records in our Database and warns in the Logs if no records exist.
   */
  private async checkForRecords() {
    let hasMissingRecords = false;

    if (!(await this.siteSeedingService.hasRecords())) {
      hasMissingRecords = true;
      this.logger.warn('There are no Sites in our Database!');
    }

    if (!(await this.truckSeedingService.hasRecords())) {
      hasMissingRecords = true;
      this.logger.warn('There are no Trucks in our Database!');
    }

    if (hasMissingRecords) {
      this.logger.warn('Consider configuring the application with the Seeder:');
      this.logger.warn('.env :: DB__RUN_SEEDS=true');
    }
  }

  /**
   * Runs the Data-Seeds.
   */
  private async runSeeds() {
    this.logger.log('Running Data-Seeds!');

    await this.siteSeedingService.seed();
    await this.truckSeedingService.seed();

    this.logger.log('Data-Seeds have run!');
  }

  /**
   * Gets the Port configured for the Application or a Default Value if no valid value is found.
   * @returns Application Port (number)
   */
  getAppPort() {
    const PortConfigName = 'APP_PORT';
    const DefaultAppPort = 3000;

    let appPort: number | undefined;

    try {
      appPort = this.configService.getOrThrow(PortConfigName);
    } catch (err) {
      this.logger.error(err, err.stack);
    } finally {
      if (
        appPort == null ||
        typeof appPort !== 'number' ||
        Number.isNaN(appPort)
      ) {
        this.logger.warn(
          `Invalid App-Port configuration value (${appPort}) -- defaulting to ${DefaultAppPort}.`,
        );

        this.logger.warn(
          `Please review your configured ${PortConfigName} value.`,
        );

        appPort = DefaultAppPort;
      }
    }

    return appPort;
  }
}
