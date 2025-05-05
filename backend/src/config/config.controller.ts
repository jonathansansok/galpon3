// backend/src/config/config.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('google-maps-api-key')
  getGoogleMapsApiKey() {
    return this.configService.getGoogleMapsApiKey();
  }

  @Get('backend-url')
  getBackendUrl() {
    return this.configService.getBackendUrl();
  }
}
