import { Routes } from '@angular/router';
import { startsWith, WebComponentWrapper, WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';

import { APP_ROUTES, notFoundRoute } from '../app.routes';
import { CustomManifest, CustomRemoteWebComponentConfig } from './config';

// dynamically builds the dynamic routes from the manifest file
export function buildRoutes(options: CustomManifest): Routes {
    const lazyRoutes: Routes = Object.keys(options).map((key: string) => {
        const entry: CustomRemoteWebComponentConfig = options[key];

            return {
                matcher: startsWith(entry.routePath),
                component: WebComponentWrapper,
                data: {
                    type: 'module',
                    remoteEntry: entry.remoteEntry,
                    exposedModule: entry.exposedModule,
                    elementName: entry.elementName
                } as WebComponentWrapperOptions
            };
    });

    console.log({lazyRoutes})
    return [...APP_ROUTES, ...lazyRoutes, notFoundRoute];
}