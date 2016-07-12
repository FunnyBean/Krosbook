import {Component} from  '@angular/core'

@Component({
    selector: 'admin',
    templateUrl: 'app/components/admin/admin.component.html',
    styleUrls: ['app/components/admin/admin.component.html']
})

export class AdminComponent {
    private admin: boolean = true;
}