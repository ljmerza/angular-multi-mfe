import { Routes } from '@angular/router';
import { startsWith, WebComponentWrapper, WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    matcher: startsWith('angular'),
    component: WebComponentWrapper,
    data: {
      type: 'module',
      // remoteEntry: 'https://gray-river-0b8c23a10.azurestaticapps.net/remoteEntry.js',
      remoteEntry: 'http://localhost:4202/remoteEntry.js',
      // remoteName: 'angular3',
      exposedModule: './web-components',
      elementName: 'angular3-element'
    } as WebComponentWrapperOptions
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
