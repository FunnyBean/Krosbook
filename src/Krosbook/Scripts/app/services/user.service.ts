﻿import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';

@Injectable()
export class UserService {
  constructor(private http:Http) {
    let _build = (<any>http)._backend._browserXHR.build;
    (<any>http)._backend._browserXHR.build = () => {
      let _xhr = _build();
      _xhr.withCredentials = true;
      return _xhr;
    };
  }

  public login(Email:string, Password:string, RememberMe:boolean) {
    let headers = new Headers(), selector, validator;
    headers.append('Content-Type', 'application/json');
    if(RememberMe){
      selector = this.generateRandomString();
      validator = this.generateRandomString();
      Cookie.set('RememberMe', selector+':'+validator, 30);
    }
    return this.http.post('http://funnybean.cloudapp.net/api/authentification/login', JSON.stringify({ Email, Password, RememberMe, selector, validator }), {headers});
  }

  public loginWithCookie(selector:string, validator:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://funnybean.cloudapp.net/api/authentification/loginWithCookie', JSON.stringify({ selector, validator }), {headers});
  }

  public logout() {
    Cookie.delete("RememberMe");
    return this.http.get('http://funnybean.cloudapp.net/api/authentification/logout');
  }

  public isLoggedIn() {
    return this.http.get('http://funnybean.cloudapp.net/api/authentification/IsLoggedIn');
  }

  public myProfile() {
    return this.http.get('http://funnybean.cloudapp.net/api/users/profile');
  }

  public updatePassword(oldPassword:string, newPassword:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://funnybean.cloudapp.net/api/users/changePassword', JSON.stringify({oldPassword, newPassword}), { headers  } );
  }

  public updateImage(photoBase64:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://funnybean.cloudapp.net/api/users/changeImage', JSON.stringify({photoBase64}), { headers  } );
  }

  public getUsers() {
    return this.http.get('http://funnybean.cloudapp.net/api/users');
  }

  public getUser(id:number) {
    return this.http.get('http://funnybean.cloudapp.net/api/users/' + id);
  }

  public addUser(user:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://funnybean.cloudapp.net/api/users/', user, {headers});
  }

  public editUser(id:string, user:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://funnybean.cloudapp.net/api/users/' + id, user, {headers});
  }

  public removeUser(id:string) {
    return this.http.delete('http://funnybean.cloudapp.net/api/users/' + id);
  }

  public getRoles() {
    return this.http.get('http://funnybean.cloudapp.net/api/roles');
  }

  public sendPasswordResetEmail(email:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://funnybean.cloudapp.net/api/authentification/forgottenPassword', JSON.stringify(email), {headers});
  }

  public savePasswordReset(token:string, newPassword:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://funnybean.cloudapp.net/api/authentification/savePasswordReset', JSON.stringify({newPassword, token}), {headers});
  }

  private generateRandomString() {
    var randString:string = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 21; i++ )
      randString += possible.charAt(Math.floor(Math.random() * possible.length));

    return randString;
  }

}
