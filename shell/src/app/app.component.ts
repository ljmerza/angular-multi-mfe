import { Component } from '@angular/core';
import { getManifest } from '@angular-architects/module-federation';
import { CustomManifest } from './utils/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  manifest = getManifest<CustomManifest>();

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}