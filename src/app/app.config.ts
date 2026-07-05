import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { DataService } from './services/data.service';

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
      const dataService = inject(DataService);
      return firstValueFrom(dataService.fetchContentList());
    })
  ]
};
