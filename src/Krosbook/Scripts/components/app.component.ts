import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {UserService} from '../services/user.service';

@Component({
    selector: 'app',
    templateUrl: 'app/components/app.component.html',
    styleUrls: ['app/components/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        UserService
    ]
})
export class AppComponent { }