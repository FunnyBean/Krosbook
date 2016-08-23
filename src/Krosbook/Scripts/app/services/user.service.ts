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
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    Cookie.delete("RememberMe");
    return this.http.get('http://funnybean.cloudapp.net/api/authentification/logout', { headers  } );
  }

  public isLoggedIn() {
    if(Cookie.get('KrosbookAuth')!=null){
      return true;
    }
    else {
      return false;
    }
    //return this.http.get('http://funnybean.cloudapp.net/api/authentification/IsLoggedIn');
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
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://funnybean.cloudapp.net/api/users', {headers});
  }

  public getUser(id:number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://funnybean.cloudapp.net/api/users/' + id, {headers});
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
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://funnybean.cloudapp.net/api/roles', {headers});
  }

  private generateRandomString() {
    var randString:string = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 21; i++ )
      randString += possible.charAt(Math.floor(Math.random() * possible.length));

    return randString;
  }

}
