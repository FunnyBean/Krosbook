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
var forms_1 = require('@angular/forms');
var user_service_1 = require('../services/user.service');
var EmailNameValidator = (function () {
    function EmailNameValidator(userService) {
        var _this = this;
        this.userService = userService;
        this.initialCValue = null;
        this.userService.getUsers().subscribe(function (data) { _this.users = data.json(); }, function (error) { return console.log(error); });
    }
    EmailNameValidator.prototype.validate = function (c) {
        if (this.users) {
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].email == c.value)
                    return { validateEmailName: true };
            }
        }
        return null;
    };
    EmailNameValidator = __decorate([
        core_1.Directive({
            selector: '[validateEmailName][ngModel],[validateEmailName][formControl]',
            providers: [
                { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return EmailNameValidator; }), multi: true }, user_service_1.UserService
            ]
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService])
    ], EmailNameValidator);
    return EmailNameValidator;
}());
exports.EmailNameValidator = EmailNameValidator;

//# sourceMappingURL=emailName.validator.js.map
