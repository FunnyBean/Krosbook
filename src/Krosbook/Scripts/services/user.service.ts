import {Injectable} from '@angular/core';
import {Http, Headers, Response, Jsonp} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'



@Injectable()
export class UserService {
    private token: string;


    constructor(private http: Http) {
    }

    public login(Email: string, Password: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('api/authentification/login', JSON.stringify({
            Email, Password
        }), { headers });
    }


    logout() {
        localStorage.removeItem('token');
    }
    

}
