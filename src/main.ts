import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { DemoComponent } from './demo/component';

bootstrapApplication(DemoComponent)
  .catch(error => console.error('Calendar failed to start', error));
