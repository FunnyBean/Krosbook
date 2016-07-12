/// <reference path="../typings/globals/es6-shim/index.d.ts" />

import {bootstrap}    from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import {APP_ROUTER_PROVIDERS} from './components/app.routes';

import {AppComponent} from './components/app.component';

bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS,
    HTTP_PROVIDERS
]);