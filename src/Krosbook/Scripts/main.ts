import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {bootstrap}    from '@angular/platform-browser-dynamic';

import {AppComponent} from './components/app.component';

import 'rxjs/Rx';

bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms()] 
);