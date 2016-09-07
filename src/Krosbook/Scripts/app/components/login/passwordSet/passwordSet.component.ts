import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {UserService} from '../../../services/user.service';

@Component({
    templateUrl: 'app/components/login/passwordSet/passwordSet.component.html',
    styleUrls: ['app/components/login/login.component.css'],
    directives: [ROUTER_DIRECTIVES]
})

export class PasswordSetComponent
{
    private token:string = "";
    private password:Array<string> = ['', ''];

    public success:string;
    public error: string;
    public saving: boolean = false;

    constructor(private userService:UserService, private route:ActivatedRoute){
        this.route.params.subscribe(params => {
            this.token = params['token'];
        });
     }

    onSubmit()
    {
        this.error = "";
        if (this.password[0] == this.password[1]) {
            this.saving = true;
            this.userService.savePasswordReset(this.token, this.password[0]).subscribe(
                data => { this.success = "Heslo bolo úspešne zmenené."; this.password = ['', '']; this.saving = false; },
                error => { this.error = "Heslo sa nepodarilo upraviť. Nepltaný overovací link."; this.saving = false; }
            )
        }
        else this.error = "Heslá sa nezhodujú.";
    }
}