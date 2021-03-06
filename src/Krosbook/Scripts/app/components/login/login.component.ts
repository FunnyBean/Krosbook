﻿import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {UserService} from '../../services/user.service';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import * as moment from 'moment';

@Component({
    selector: 'login',
    templateUrl: 'app/components/login/login.component.html',
    styleUrls: ['app/components/login/login.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class LoginComponent {
    private email: string;
    private password: string;
    private error: string;
    private year = moment().format("YYYY");
    private rememberActive: boolean = false;

    public saving: boolean = false;

    constructor(private router: Router, private userService: UserService) {
        if (Cookie.get("RememberMe") != null) {
            this.saving = true;
            var loginString = Cookie.get("RememberMe").split(":");
            this.userService.loginWithCookie(loginString[0], loginString[1]).subscribe(
                response => {
                    this.saving = false;
                    this.router.navigate(['/']);
                },
                error => {
                    this.saving = false;
                    Cookie.delete('RememberMe');
                    this.error = 'Nesprávne údaje na automatické prihlásenie';
                }
            );
        }
    }

    onSubmit() {
        this.saving = true;
        this.userService.login(this.email, this.password, this.rememberActive).subscribe(
            response => {
                this.saving = false;
                this.router.navigate(['/']);
            },
            error => {
                this.saving = false;
                this.error = 'Nesprávny email/heslo';
            }
        );
    }
}
