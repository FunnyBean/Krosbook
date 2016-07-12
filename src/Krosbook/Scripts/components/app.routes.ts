import {provideRouter, RouterConfig}  from '@angular/router';

import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {AdminComponent} from './admin/admin.component';

const routes: RouterConfig = [
    { path: '', redirectTo: 'login', terminal: true },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent }
];



export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];