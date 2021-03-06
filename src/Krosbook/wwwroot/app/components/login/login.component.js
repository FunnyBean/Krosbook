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
var router_1 = require('@angular/router');
var user_service_1 = require('../../services/user.service');
var ng2_cookies_1 = require('ng2-cookies/ng2-cookies');
var moment = require('moment');
var LoginComponent = (function () {
    function LoginComponent(router, userService) {
        var _this = this;
        this.router = router;
        this.userService = userService;
        this.year = moment().format("YYYY");
        this.rememberActive = false;
        this.saving = false;
        if (ng2_cookies_1.Cookie.get("RememberMe") != null) {
            this.saving = true;
            var loginString = ng2_cookies_1.Cookie.get("RememberMe").split(":");
            this.userService.loginWithCookie(loginString[0], loginString[1]).subscribe(function (response) {
                _this.saving = false;
                _this.router.navigate(['/']);
            }, function (error) {
                _this.saving = false;
                ng2_cookies_1.Cookie.delete('RememberMe');
                _this.error = 'Nesprávne údaje na automatické prihlásenie';
            });
        }
    }
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        this.saving = true;
        this.userService.login(this.email, this.password, this.rememberActive).subscribe(function (response) {
            _this.saving = false;
            _this.router.navigate(['/']);
        }, function (error) {
            _this.saving = false;
            _this.error = 'Nesprávny email/heslo';
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: 'app/components/login/login.component.html',
            styleUrls: ['app/components/login/login.component.css'],
            directives: [router_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;

//# sourceMappingURL=login.component.js.map
