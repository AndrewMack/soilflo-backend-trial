import { Catch, ArgumentsHost, Logger, HttpServer } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class GlobalErrorObserverFilter extends BaseExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalErrorObserverFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    try {
      this.logger.debug(exception);
    } catch (err) {
      this.logger.error('Global-Error-Observer failed to log an Error:');
      this.logger.error(err);
    }

    super.catch(exception, host);
  }

  handleUnknownError(
    exception: any,
    host: ArgumentsHost,
    applicationRef: AbstractHttpAdapter | HttpServer,
  ): void {
    try {
      this.logger.error('An Unknown Error occurred:');
      this.logger.error(exception);
    } catch (err) {
      this.logger.error('Error logging Unknown Error:');
      this.logger.error(err);
    }

    super.handleUnknownError(exception, host, applicationRef);
  }
}
