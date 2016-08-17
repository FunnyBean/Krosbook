﻿import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map'
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {Observable} from "rxjs/Rx";


@Injectable()
export class UserService {
  hasRoleAdmin:boolean = false;

  constructor(private http:Http) {
    let _build = (<any>http)._backend._browserXHR.build;
    (<any>http)._backend._browserXHR.build = () => {
      let _xhr = _build();
      _xhr.withCredentials = true;
      return _xhr;
    };
  }

  public login(Email:string, Password:string, RememberMe:boolean) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(RememberMe){
      var selector = this.generateRandomString(), validator = this.generateRandomString();
      Cookie.set('RememberMe', selector + ':' + validator, 30);
      return this.http.post('http://localhost:50909/api/authentification/login', JSON.stringify({ Email, Password, RememberMe, selector, validator }), { headers });
    }
    return this.http.post('http://localhost:50909/api/authentification/login', JSON.stringify({ Email, Password, RememberMe }), { headers });
  }

  public loginWithCookie(selector:string, validator:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:50909/api/authentification/loginWithCookie', JSON.stringify({ selector, validator }), {headers});
  }

  public logout() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    Cookie.delete("RememberMe");
    return this.http.get('http://localhost:50909/api/authentification/logout', { headers  } );
  }

  public isLoggedIn() {
    if(Cookie.get('KrosbookAuth')!=null){
      return true;
    }
    else {
      return false;}
  }

  public myProfile() {
    return this.http.get('http://localhost:50909/api/users/profile');
  }

  public updatePassword(oldPassword:string, newPassword:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:50909/api/users/changePassword', JSON.stringify({oldPassword, newPassword}), { headers  } );
  }

  public updateImage(photoBase64:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:50909/api/users/changeImage', JSON.stringify({photoBase64}), { headers  } );
  }

  public getUsers() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:50909/api/users', {headers});
  }

  public getUser(id:number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:50909/api/users/' + id, {headers});
  }

  public addUser(user:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:50909/api/users/', user, {headers});
  }

  public editUser(id:string, user:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:50909/api/users/' + id, user, {headers});
  }

  public removeUser(id:string) {
    return this.http.delete('http://localhost:50909/api/users/' + id);
  }

  public getRoles() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:50909/api/roles', {headers});
  }

  private generateRandomString() {
    var randString:string = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 21; i++ )
      randString += possible.charAt(Math.floor(Math.random() * possible.length));

    return randString;
  }

}
