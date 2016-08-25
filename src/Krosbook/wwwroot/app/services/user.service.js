"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var ng2_cookies_1 = require('ng2-cookies/ng2-cookies');
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        var _build = http._backend._browserXHR.build;
        http._backend._browserXHR.build = function () {
            var _xhr = _build();
            _xhr.withCredentials = true;
            return _xhr;
        };
    }
    UserService.prototype.login = function (Email, Password, RememberMe) {
        var headers = new http_1.Headers(), selector, validator;
        headers.append('Content-Type', 'application/json');
        if (RememberMe) {
            selector = this.generateRandomString();
            validator = this.generateRandomString();
            ng2_cookies_1.Cookie.set('RememberMe', selector + ':' + validator, 30);
        }
        return this.http.post('http://funnybean.cloudapp.net/api/authentification/login', JSON.stringify({ Email: Email, Password: Password, RememberMe: RememberMe, selector: selector, validator: validator }), { headers: headers });
    };
    UserService.prototype.loginWithCookie = function (selector, validator) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://funnybean.cloudapp.net/api/authentification/loginWithCookie', JSON.stringify({ selector: selector, validator: validator }), { headers: headers });
    };
    UserService.prototype.logout = function () {
        ng2_cookies_1.Cookie.delete("RememberMe");
        return this.http.get('http://funnybean.cloudapp.net/api/authentification/logout');
    };
    UserService.prototype.isLoggedIn = function () {
        return this.http.get('http://funnybean.cloudapp.net/api/authentification/IsLoggedIn');
    };
    UserService.prototype.myProfile = function () {
        return this.http.get('http://funnybean.cloudapp.net/api/users/profile');
    };
    UserService.prototype.updatePassword = function (oldPassword, newPassword) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('http://funnybean.cloudapp.net/api/users/changePassword', JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword }), { headers: headers });
    };
    UserService.prototype.updateImage = function (photoBase64) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('http://funnybean.cloudapp.net/api/users/changeImage', JSON.stringify({ photoBase64: photoBase64 }), { headers: headers });
    };
    UserService.prototype.getUsers = function () {
        return this.http.get('http://funnybean.cloudapp.net/api/users');
    };
    UserService.prototype.getUser = function (id) {
        return this.http.get('http://funnybean.cloudapp.net/api/users/' + id);
    };
    UserService.prototype.addUser = function (user) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://funnybean.cloudapp.net/api/users/', user, { headers: headers });
    };
    UserService.prototype.editUser = function (id, user) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('http://funnybean.cloudapp.net/api/users/' + id, user, { headers: headers });
    };
    UserService.prototype.removeUser = function (id) {
        return this.http.delete('http://funnybean.cloudapp.net/api/users/' + id);
    };
    UserService.prototype.getRoles = function () {
        return this.http.get('http://funnybean.cloudapp.net/api/roles');
    };
    UserService.prototype.generateRandomString = function () {
        var randString = '';
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 21; i++)
            randString += possible.charAt(Math.floor(Math.random() * possible.length));
        return randString;
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
