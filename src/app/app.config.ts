import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject  
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { firstValueFrom } from 'rxjs';
import { DataFetchService } from './services/data-fetch.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    provideAppInitializer(() => {
      const dataFetchService = inject(DataFetchService);
      return firstValueFrom(dataFetchService.fetchContentList());
    })
  ]
};
