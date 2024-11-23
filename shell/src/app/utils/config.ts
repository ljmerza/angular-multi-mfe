import { Manifest, RemoteConfig } from "@angular-architects/module-federation";

export type CustomRemoteWebComponentConfig = RemoteConfig & {
    routePath: string;
    remoteEntry: string;
    remoteName: string;
    exposedModule: string;
    elementName: string;
};

export type CustomManifest = Manifest<CustomRemoteWebComponentConfig>;