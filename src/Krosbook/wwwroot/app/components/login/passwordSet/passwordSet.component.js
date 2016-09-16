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
var PasswordSetComponent = (function () {
    function PasswordSetComponent(userService, route) {
        var _this = this;
        this.userService = userService;
        this.route = route;
        this.token = "";
        this.password = ['', ''];
        this.saving = false;
        this.route.params.subscribe(function (params) {
            _this.token = params['token'];
        });
    }
    PasswordSetComponent.prototype.onSubmit = function () {
        var _this = this;
        this.error = "";
        if (this.password[0] == this.password[1]) {
            this.saving = true;
            this.userService.savePasswordReset(this.token, this.password[0]).subscribe(function (data) { _this.success = "Heslo bolo úspešne zmenené."; _this.password = ['', '']; _this.saving = false; }, function (error) { _this.error = "Heslo sa nepodarilo upraviť. Neplatný overovací link."; _this.saving = false; });
        }
        else
            this.error = "Heslá sa nezhodujú.";
    };
    PasswordSetComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/login/passwordSet/passwordSet.component.html',
            styleUrls: ['app/components/login/login.component.css'],
            directives: [router_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, router_1.ActivatedRoute])
    ], PasswordSetComponent);
    return PasswordSetComponent;
}());
exports.PasswordSetComponent = PasswordSetComponent;

//# sourceMappingURL=passwordSet.component.js.map
