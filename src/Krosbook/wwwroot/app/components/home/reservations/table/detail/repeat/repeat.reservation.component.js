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
var time_validator_1 = require('../../../../../../validators/time.validator');
var RepeatReservationComponent = (function () {
    function RepeatReservationComponent() {
        this.slovakIntervalSG = { days: "deň", weeks: "týždeň", months: "mesiac", years: "rok" };
        this.slovakIntervalPLN = { days: "dni", weeks: "týždne", months: "mesiace", years: "roky" };
        this.slovakIntervalPLG = { days: "dní", weeks: "týždňov", months: "mesiacov", years: "rokov" };
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RepeatReservationComponent.prototype, "repetitionData", void 0);
    RepeatReservationComponent = __decorate([
        core_1.Component({
            selector: "repeater",
            templateUrl: 'app/components/home/reservations/table/detail/repeat/repeat.reservation.component.html',
            styles: ['.one-line{display: inline-flex; line-height: 34px;} .one-line input{margin-left: 5px; margin-right: 5px} input[type="radio"]{margin-top: 10px;} .radio{margin-top: 0px} .control-label{line-height: 34px;}'],
            directives: [time_validator_1.DateValidator]
        }), 
        __metadata('design:paramtypes', [])
    ], RepeatReservationComponent);
    return RepeatReservationComponent;
}());
exports.RepeatReservationComponent = RepeatReservationComponent;
