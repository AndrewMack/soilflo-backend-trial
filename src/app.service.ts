import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Gets the Port configured for the Application or a Default Value if no valid value is found.
   * @returns Application Port
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
