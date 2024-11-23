Hello, I've been trying to get angular web components working with module federation to allow for multiple angular versions to coexist. I've mostly followed [this guide](https://www.angulararchitects.io/en/blog/multi-framework-and-version-micro-frontends-with-module-federation-your-4-steps-guide/) which works in angular v12 but doesnt when I try to upgrade to v16/v17.

The error I'm getting is similar to [here](https://github.com/angular-architects/module-federation-plugin/issues/410) but I'm not sure how to fix it. I've tried to follow the steps in the comments but I'm not sure if I'm doing it correctly. Here are the relevant files and here is my example repo. Thank you.

https://github.com/ljmerza/angular-multi-mfe

# Shell Angular v17

```javascript
// webpack.config.js
module.exports = withModuleFederationPlugin({
  shared: {
    ...shareAll({ singleton: false, strictVersion: false, requiredVersion: 'auto' }),
  },
});
// ------------------------------------------------------------------------------
// bootstrap.ts
bootstrap(AppModule, {
  production: false,
  appType: 'shell'
});
// ------------------------------------------------------------------------------
// main.ts
 loadManifest("mf.manifest.json")
   .catch(err => console.error(err))
   .then(_ => import('./bootstrap'))
   .catch(err => console.error(err));
// ------------------------------------------------------------------------------
// mf.manifest.json
{
  "angular": {
    "routePath": "angular",
    "remoteEntry": "http://localhost:4202/remoteEntry.js",
    "remoteName": "angular",
    "exposedModule": "./web-components",
    "elementName": "angular-element"
  }
}
// ------------------------------------------------------------------------------
// utils/routes.ts
export function buildRoutes(options: CustomManifest): Routes {
    const lazyRoutes: Routes = Object.keys(options).map((key: string) => {
        const entry: CustomRemoteWebComponentConfig = options[key];

            return {
                matcher: startsWith(entry.routePath),
                component: WebComponentWrapper,
                data: {
                    type: 'module',
                    remoteEntry: entry.remoteEntry,
                    // remoteName: entry.remoteName,
                    exposedModule: entry.exposedModule,
                    elementName: entry.elementName
                } as any
            };
    });

    return [...APP_ROUTES, ...lazyRoutes, notFoundRoute];
}
// ------------------------------------------------------------------------------
// app.initializer.ts
export function initializeApp(router: Router): () => Promise<void> {
  return async () => {
    const manifest = getManifest<CustomManifest>();
    const routes = buildRoutes(manifest);
    router.resetConfig(routes);
  };
}
// ------------------------------------------------------------------------------
// app.module.ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([])
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Router],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

# Remote Angular v16


```javascript
// webpack.config.js
module.exports = {
  output: {
    publicPath: "auto",
    uniqueName: "angular"
  },
  optimization: {
    // Only needed to bypass a temporary bug
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "angular",
      library: { type: "var", name: 'angular' },
      filename: "remoteEntry.js",
      exposes: {
        './bootstrap': './src/bootstrap.ts',
      }
    })
  ],
};
// ------------------------------------------------------------------------------
// bootstrap.ts
bootstrap(AppModule, {
  production: environment.production,
  appType: 'microfrontend'
});
// ------------------------------------------------------------------------------
// main.ts
import('./bootstrap')
  .catch(err => console.error(err));
// ------------------------------------------------------------------------------
// app.module.ts
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'angular/a', component: AComponent },
      { path: 'angular/b', component: BComponent },
      { path: '**', component: EmptyComponent },

    ])
  ],
  declarations: [
    AComponent,
    BComponent,
    AppComponent,
    EmptyComponent
  ],
  providers: [],
})
export class AppModule { 
  constructor(private injector: Injector) {
    const ce = createCustomElement(AppComponent, {injector: this.injector});
    customElements.define('angular-element', ce);

    customElements.define('angular-a-element', createCustomElement(AComponent, {injector: this.injector}));
    customElements.define('angular-b-element', createCustomElement(BComponent, {injector: this.injector}));
  }

  ngDoBootstrap() { }
}

```

