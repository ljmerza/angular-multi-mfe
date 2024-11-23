import { getManifest } from '@angular-architects/module-federation';
import { Router } from '@angular/router';

import { CustomManifest } from './utils/config';
import { buildRoutes } from './utils/routes';

// force the routes to load before app initialization to allow for deep linking
export function initializeApp(router: Router): () => Promise<void> {
  return async () => {
    const manifest = getManifest<CustomManifest>();
    const routes = buildRoutes(manifest);
    router.resetConfig(routes);
  };
}