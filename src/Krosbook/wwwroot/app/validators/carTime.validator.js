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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var holiday_service_1 = require('../services/holiday.service');
var moment = require('moment');
var TimeValidator = (function () {
    function TimeValidator() {
    }
    TimeValidator.prototype.validate = function (c) {
        //  if(c.value % 30 == 0 && c.value != 0)
        if (c.value % 0.5 == 0 && c.value <= 11 && c.value > 0)
            return null;
        else
            return { validateTime: true };
    };
    TimeValidator = __decorate([
        core_1.Directive({
            selector: '[validateTime][ngModel],[validateTime][formControl]',
            providers: [
                { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return TimeValidator; }), multi: true }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], TimeValidator);
    return TimeValidator;
}());
exports.TimeValidator = TimeValidator;
var DateValidator = (function () {
    function DateValidator(holidayService) {
        this.holidayService = holidayService;
    }
    DateValidator.prototype.validate = function (c) {
        var date = moment(c.value);
        if (date.minute() == 0)
            return null;
        else
            return { validateDate: true };
    };
    DateValidator = __decorate([
        core_1.Directive({
            selector: '[validateDate][ngModel],[validateDate][formControl]',
            providers: [holiday_service_1.HolidayService,
                { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return DateValidator; }), multi: true }
            ]
        }), 
        __metadata('design:paramtypes', [holiday_service_1.HolidayService])
    ], DateValidator);
    return DateValidator;
}());
exports.DateValidator = DateValidator;
var DatesValidator = (function () {
    function DatesValidator(validateDates) {
        this.validateDates = validateDates;
    }
    DatesValidator.prototype.validate = function (c) {
        // self value
        var v = c.value;
        // control value
        var e = c.root.find(this.validateDates);
        // value not equal
        if (e && v <= e.value) {
            return {
                validateDates: false
            };
        }
        return null;
    };
    DatesValidator = __decorate([
        core_1.Directive({
            selector: '[validateDates][formControlName],[validateDates][formControl],[validateDates][ngModel]',
            providers: [
                { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return DatesValidator; }), multi: true }
            ]
        }),
        __param(0, core_1.Attribute('validateDates')), 
        __metadata('design:paramtypes', [String])
    ], DatesValidator);
    return DatesValidator;
}());
exports.DatesValidator = DatesValidator;

//# sourceMappingURL=carTime.validator.js.map
