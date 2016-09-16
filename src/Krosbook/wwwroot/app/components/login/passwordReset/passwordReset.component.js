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
var user_service_1 = require('../../../services/user.service');
var PasswordResetComponent = (function () {
    function PasswordResetComponent(userService) {
        this.userService = userService;
        this.saving = false;
    }
    PasswordResetComponent.prototype.onSubmit = function () {
        var _this = this;
        this.saving = true;
        this.userService.sendPasswordResetEmail(this.email).subscribe(function (data) { _this.success = "Obnovovací email bol odoslaný."; _this.saving = false; }, function (error) { _this.error = "Akcia sa nepodarila. Užívateľ možno neexistuje."; _this.saving = false; });
    };
    PasswordResetComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/login/passwordReset/passwordReset.component.html',
            styleUrls: ['app/components/login/login.component.css'],
            directives: [router_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService])
    ], PasswordResetComponent);
    return PasswordResetComponent;
}());
exports.PasswordResetComponent = PasswordResetComponent;

//# sourceMappingURL=passwordReset.component.js.map
