import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@common/enums';

@Injectable()
export class WinstonConfigService {
  constructor(private configService: ConfigService) {}

  async createWinstonModuleOptions() {
    const consoleEnabled: boolean = this.configService.get(
      ConfigurationTypes.MONITORING
    )?.logging?.console_logging_enabled;
    const transports: any[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike()
        ),
        level: this.configService
          .get(ConfigurationTypes.MONITORING)
          ?.logging?.level.toLowerCase(),
        silent: !consoleEnabled,
      }),
    ];

    return {
      transports: transports,
    };
  }
}
