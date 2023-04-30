import { Component, VERSION } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;

  constructor(swUpdate: SwUpdate) {
    if (swUpdate.isEnabled){
      swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(evt => {
        swUpdate.activateUpdate().then(result => {
          if (result) {
            document.location.reload();
          }
        });
      });
    }
  }
}