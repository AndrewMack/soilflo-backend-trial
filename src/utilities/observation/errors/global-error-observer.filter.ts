import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

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
}
