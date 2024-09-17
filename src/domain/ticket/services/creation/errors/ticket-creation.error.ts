import { BadRequestException } from '@nestjs/common';

export class TicketCreationError extends BadRequestException {
  message: string;
  stack: string;

  constructor(message: string, stack?: string, cause?: any) {
    super(message);
    this.message = message;
    this.stack = stack ?? '';
    this.cause = cause;
  }
}
