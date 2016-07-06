import {provideRouter, RouterConfig}  from '@angular/router';

import {LoginComponent} from './login/login.component';

const routes: RouterConfig = [
    {
        path: 'login',
        component: LoginComponent
    },
    //{
    //    path: '',
    //    redirectTo: '/login',
    //    pathMatch: 'full'
    //},
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];