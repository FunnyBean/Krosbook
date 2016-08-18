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
/**
 * Created by Tibor Poštek on 14.07.2016.
 */
var user_service_1 = require('../services/user.service');
var router_1 = require('@angular/router');
var core_1 = require("@angular/core");
var Observable_1 = require('rxjs/Observable');
var AuthGuard = (function () {
    function AuthGuard(userService, router) {
        this.userService = userService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function () {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            _this.userService.isLoggedIn().map(function (res) { return res; }).subscribe(function (result) {
                if (result)
                    observer.next(true);
                else {
                    observer.next(false);
                    _this.router.navigate(['/login']);
                }
                observer.complete();
            }, function (error) {
                observer.next(false);
                observer.complete();
                _this.router.navigate(['/login']);
            });
        });
        ;
    };
    AuthGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [user_service_1.UserService, router_1.Router])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
