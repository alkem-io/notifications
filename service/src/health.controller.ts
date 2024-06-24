import { Controller, Get } from '@nestjs/common';

@Controller('/health')
export class HealthController {
  @Get('/')
  public healthCheck(): string {
    return 'healthy!';
  }
}
