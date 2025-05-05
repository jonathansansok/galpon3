// backend/src/config/config.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getGoogleMapsApiKey() {
    return { apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY };
  }

  getBackendUrl() {
    return { backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL };
  }
}
