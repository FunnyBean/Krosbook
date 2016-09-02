import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {UserService} from '../../../services/user.service';

@Component({
    templateUrl: 'app/components/login/passwordReset/passwordReset.component.html',
    styleUrls: ['app/components/login/login.component.css'],
    directives: [ROUTER_DIRECTIVES]
})

export class PasswordResetComponent
{
    private email:string;

    public success:string;
    public error:string;

    constructor(private userService:UserService){}

    onSubmit()
    {
        this.userService.sendPasswordResetEmail(this.email).subscribe(
            data => { this.success = "Obnovovací email bol odoslaný." },
            error => { this.error = "Akcia sa nepodarila. Užívateľ možno neexistuje."}
        )
    }

}