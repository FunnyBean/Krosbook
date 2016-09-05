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
var reservation_service_1 = require('../../../../../services/reservation.service');
var user_service_1 = require('../../../../../services/user.service');
var reservation_model_1 = require('../../../../../models/reservation.model');
var time_validator_1 = require('../../../../../validators/time.validator');
var repeat_reservation_component_1 = require('./repeat/repeat.reservation.component');
var repetition_model_1 = require('../../../../../models/repetition.model');
var moment = require('moment');
var Observable_1 = require('rxjs/Observable');
var DetailReservationComponent = (function () {
    function DetailReservationComponent(reservationService, userService) {
        this.reservationService = reservationService;
        this.userService = userService;
        this.windowClose = new core_1.EventEmitter();
        this.saving = false;
        this.data = new reservation_model_1.Reservation();
        this.canEdit = false;
        this.emailInvitation = false;
        this.reserveGoToMeeting = false;
        this.repeating = false;
        this.repetitionData = new repetition_model_1.Repetition();
    }
    DetailReservationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.reservationService.getReservation(this.reservationType, this.reservationDetailId[0]).subscribe(function (data) {
            _this.data = data.json();
            _this.originDateTime = _this.data.dateTime;
            _this.reservationDetailId[4] = moment(_this.reservationDetailId[4], "DD.MM.YYYY").hour(moment(_this.data.dateTime).hours()).minute(moment(_this.data.dateTime).minutes()).seconds(0).format("DD.MM.YYYY HH:mm:ss");
            if (_this.data.roomReservationRepeaterId != null) {
                _this.reservationService.getRepeatingReservation(_this.reservationType, _this.data.roomReservationRepeaterId).subscribe(function (data) {
                    _this.repetitionData = data.json();
                    _this.repetitionData.endDate = moment(_this.repetitionData.endDate).format("YYYY-MM-DD");
                    _this.repetitionData.end = (_this.repetitionData.appearance == null) ? "date" : "appearance";
                    _this.repeating = true;
                    _this.data.dateTime = moment(_this.reservationDetailId[4], "DD.MM.YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss");
                    _this.updateEndTime();
                });
            }
            _this.dateTime = moment(_this.data.dateTime).format("DD.MM.YYYY HH:mm");
            _this.data.length = _this.data.length / 60;
            _this.authorizeActions();
            _this.updateMaxTime();
            _this.updateEndTime();
        }, function (error) { return console.log(error); });
    };
    DetailReservationComponent.prototype.updateMaxTime = function () {
        this.maxTime = ((18 - moment(this.data.dateTime).hour()) * 60 - moment(this.data.dateTime).minute()) / 60;
    };
    DetailReservationComponent.prototype.updateEndTime = function () {
        if (this.canEdit)
            this.endDateTime = moment(this.data.dateTime).add(this.data.length * 60, 'minutes').format("YYYY-MM-DDTHH:mm");
        else
            this.endDateTime = moment(this.data.dateTime).add(this.data.length * 60, 'minutes').format("DD.MM.YYYY HH:mm");
    };
    DetailReservationComponent.prototype.updateLength = function () {
        this.data.length = (moment(this.endDateTime).unix() - moment(this.data.dateTime).unix()) / 3600;
    };
    DetailReservationComponent.prototype.authorizeActions = function () {
        if (this.data.userId == this.loggedUser.id)
            this.canEdit = true;
        else {
            for (var i = 0; i < this.loggedUser.roles.length; i++) {
                if (this.loggedUser.roles[i].roleId == 1) {
                    this.canEdit = true;
                    break;
                }
            }
        }
    };
    DetailReservationComponent.prototype.editReservation = function (form) {
        var _this = this;
        if (form.pristine && !this.emailInvitation && !this.reserveGoToMeeting && !this.repeating && this.data.roomReservationRepeaterId == null) {
            this.windowClose.emit(true);
            return false;
        }
        this.saving = true;
        var elementId = this.data.roomId, dayData;
        if (this.data.roomReservationRepeaterId)
            this.data.dateTime = moment(this.data.dateTime).date(moment(this.originDateTime).date()).month(moment(this.originDateTime).month()).year(moment(this.originDateTime).year()).format("YYYY-MM-DDTHH:mm");
        if (this.repeating)
            if (!this.checkRepetitionFree())
                return false;
        this.reservationService.getReservations(this.reservationType, elementId, moment(this.data.dateTime).format("DD.MM.YYYY"), moment(this.data.dateTime).add(1, 'days').format("DD.MM.YYYY")).subscribe(function (data) { dayData = data.json(); }, function (error) { return console.log(error); }, function () {
            for (var i = 0; i < dayData.length; i++) {
                if (_this.data.id == dayData[i].id)
                    continue;
                var date = moment(dayData[i].dateTime), reservationTime = moment(_this.data.dateTime).format("HH:mm"), reservationTimeEnd = moment(_this.data.dateTime).add(_this.data.length * 60, 'minutes').format("HH:mm"), time = date.format("HH:mm"), endTime = date.add(dayData[i].length, 'minutes').format("HH:mm");
                if ((reservationTime >= time && reservationTime < endTime) || (time >= reservationTime && time < reservationTimeEnd)) {
                    _this.error = "Zvolený čas zasahuje do rezervácie iného používateľa.";
                    _this.saving = false;
                    return false;
                }
            }
            var repeaterId;
            if (!_this.repeating && _this.data.roomReservationRepeaterId != null)
                repeaterId = null;
            else
                repeaterId = _this.data.roomReservationRepeaterId;
            _this.reservationService.editReservation(_this.reservationType, _this.data.id, _this.data.name, elementId, _this.data.userId, _this.data.dateTime, _this.data.length * 60, repeaterId, _this.emailInvitation, _this.reserveGoToMeeting).subscribe(function (data) { }, function (error) {
                _this.error = 'Na daný termín je v GoToMeeting naplánovaná už iná rezervácia.';
                console.log("error " + error);
                _this.saving = false;
            }, function () {
                if (_this.repeating) {
                    if (_this.data.roomReservationRepeaterId == null) {
                        _this.reservationService.addRepeatingReservation(_this.reservationType, _this.data.id, _this.repetitionData.repetation, _this.repetitionData.interval, _this.repetitionData.end, _this.repetitionData.appearance, _this.repetitionData.endDate).subscribe(function (error) { _this.saving = false; });
                    }
                    else {
                        _this.reservationService.editRepeatingReservation(_this.reservationType, _this.data.roomReservationRepeaterId, _this.data.id, _this.repetitionData.repetation, _this.repetitionData.interval, _this.repetitionData.end, _this.repetitionData.appearance, _this.repetitionData.endDate).subscribe(function (error) { _this.saving = false; });
                    }
                }
                else if (!_this.repeating && _this.data.roomReservationRepeaterId != null) {
                    _this.reservationService.deleteRepeatingReservation(_this.reservationType, _this.data.roomReservationRepeaterId).subscribe(function (data) {
                        _this.data.roomReservationRepeaterId = null;
                    }, function (error) { _this.saving = false; });
                }
                setTimeout(function () { return _this.windowClose.emit(true); }, 1000);
                _this.saving = false;
            });
        });
    };
    DetailReservationComponent.prototype.addNewReservationFromRepeating = function () {
        var _this = this;
        this.reservationService.addReservation(this.reservationType, this.data.roomId, 1, 'Rezervácia', moment(this.data.dateTime).format("DD.MM.YYYY HH:mm"), this.data.length * 60).subscribe(function (data) {
            _this.reservationDetailId = [data.json().id, _this.reservationDetailId[1], _this.reservationDetailId[2], 0]; //okno na potvrdenie rezervacie      
        }, function (error) { alert(error); }, function () {
            _this.windowClose.emit(true);
        });
    };
    DetailReservationComponent.prototype.editOneRepeatingReservation = function (form) {
        var _this = this;
        if (form.pristine && !this.emailInvitation && !this.reserveGoToMeeting && !this.repeating && this.data.roomReservationRepeaterId == null) {
            this.windowClose.emit(true);
            return false;
        }
        this.saving = true;
        var elementId = this.data.roomId, dayData;
        this.reservationService.getReservations(this.reservationType, elementId, moment(this.data.dateTime).format("DD.MM.YYYY"), moment(this.data.dateTime).add(1, 'days').format("DD.MM.YYYY")).subscribe(function (data) { dayData = data.json(); }, function (error) { return console.log(error); }, function () {
            for (var i = 0; i < dayData.length; i++) {
                if (_this.data.id == dayData[i].id)
                    continue;
                var date = moment(dayData[i].dateTime), reservationTime = moment(_this.data.dateTime).format("HH:mm"), reservationTimeEnd = moment(_this.data.dateTime).add(_this.data.length * 60, 'minutes').format("HH:mm"), time = date.format("HH:mm"), endTime = date.add(dayData[i].length, 'minutes').format("HH:mm");
                if ((reservationTime >= time && reservationTime < endTime) || (time >= reservationTime && time < reservationTimeEnd)) {
                    _this.error = "Zvolený čas zasahuje do rezervácie iného používateľa.";
                    _this.saving = false;
                    return false;
                }
            }
            _this.reservationService.editOneRepeatingReservation(_this.data.id, _this.reservationDetailId[4]).subscribe(function () {
                _this.addNewReservationFromRepeating();
            });
        });
    };
    DetailReservationComponent.prototype.deleteOneRepatingReservaion = function () {
        var _this = this;
        this.saving = true;
        this.reservationService.editOneRepeatingReservation(this.data.id, this.reservationDetailId[4]).subscribe(function () { _this.windowClose.emit(true); });
    };
    DetailReservationComponent.prototype.deleteReservation = function () {
        var _this = this;
        this.reservationService.deleteReservation(this.reservationType, this.data.id).subscribe(function () { _this.windowClose.emit(true); }, function (error) { return console.log(error); });
    };
    DetailReservationComponent.prototype.closeWindow = function () {
        this.windowClose.emit(false);
    };
    DetailReservationComponent.prototype.checkRepetitionFree = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.reservationService.checkDupliciteRepeatingReservations(_this.data.id, _this.repetitionData.repetation, _this.repetitionData.interval, _this.repetitionData.appearance).subscribe(function (data) {
                observer.next(true);
                observer.complete();
            }, function (error) {
                _this.error = "Zvolený čas zasahuje do rezervácie iného používateľa.";
                _this.saving = false;
                observer.next(false);
                observer.complete();
            });
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DetailReservationComponent.prototype, "reservationDetailId", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DetailReservationComponent.prototype, "reservationType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DetailReservationComponent.prototype, "loggedUser", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DetailReservationComponent.prototype, "usersList", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DetailReservationComponent.prototype, "windowClose", void 0);
    DetailReservationComponent = __decorate([
        core_1.Component({
            selector: 'reservation-detail',
            templateUrl: 'app/components/home/roomReservations/table/detail/detail.reservation.component.html',
            styleUrls: ['app/components/home/roomReservations/table/detail/detail.reservation.component.css'],
            directives: [time_validator_1.TimeValidator, time_validator_1.DateValidator, repeat_reservation_component_1.RepeatReservationComponent],
            providers: [reservation_service_1.ReservationService]
        }), 
        __metadata('design:paramtypes', [reservation_service_1.ReservationService, user_service_1.UserService])
    ], DetailReservationComponent);
    return DetailReservationComponent;
}());
exports.DetailReservationComponent = DetailReservationComponent;
