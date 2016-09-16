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
var moment = require('moment');
var ReservationService = (function () {
    function ReservationService(http) {
        this.http = http;
        var _build = http._backend._browserXHR.build;
        http._backend._browserXHR.build = function () {
            var _xhr = _build();
            _xhr.withCredentials = true;
            return _xhr;
        };
    }
    ReservationService.prototype.getReservation = function (type, id) {
        return this.http.get('/api/reservations/' + type + '/' + id);
    };
    ReservationService.prototype.getReservations = function (type, id, from, to) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var by = (type == "rooms") ? "byroom" : "bycar";
        return this.http.post('/api/reservations/' + type + '/' + by + '/' + id, JSON.stringify({ from: from, to: to }), { headers: headers });
    };
    ReservationService.prototype.addReservation = function (type, elementId, userId, name, date, length) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        if (type == "rooms") {
            var roomId = elementId;
            return this.http.post('/api/reservations/' + type + '/', JSON.stringify({ roomId: roomId, name: name, date: date, length: length }), { headers: headers });
        }
        else {
            var carId = elementId;
            return this.http.post('/api/reservations/' + type + '/', JSON.stringify({ carId: carId, name: name, date: date, length: length }), { headers: headers });
        }
    };
    ReservationService.prototype.editReservation = function (type, id, name, elementId, userId, dateTime, length, roomReservationRepeaterId, emailInvitation, goToMeeting) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        if (type == "rooms") {
            var roomId = elementId;
            return this.http.put('/api/reservations/' + type + '/' + id, JSON.stringify({ id: id, name: name, roomId: roomId, dateTime: dateTime, userId: userId, length: length, roomReservationRepeaterId: roomReservationRepeaterId, emailInvitation: emailInvitation, goToMeeting: goToMeeting }), { headers: headers });
        }
        else {
            var carId = elementId;
            return this.http.put('/api/reservations/' + type + '/' + id, JSON.stringify({ id: id, name: name, carId: carId, dateTime: dateTime, userId: userId, length: length }), { headers: headers });
        }
    };
    ReservationService.prototype.deleteReservation = function (type, id) {
        return this.http.delete('/api/reservations/' + type + '/' + id);
    };
    ReservationService.prototype.getRepeatingReservation = function (type, repetitionId) {
        return this.http.get('/api/reservations/' + type + '/repetition/' + repetitionId);
    };
    ReservationService.prototype.addRepeatingReservation = function (type, reservationId, repetation, interval, endType, appearance, endingDate) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        appearance = (endType == 'appearance') ? appearance : null;
        endingDate = (endType == 'date') ? moment(endingDate).format("DD.MM.YYYY HH:mm:ss") : null;
        return this.http.post('/api/reservations/' + type + '/repetition', JSON.stringify({ reservationId: reservationId, repetation: repetation, interval: interval, appearance: appearance, endingDate: endingDate }), { headers: headers });
    };
    ReservationService.prototype.editRepeatingReservation = function (type, id, reservationId, repetation, interval, endType, appearance, endingDate) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        appearance = (endType == 'appearance') ? appearance : null;
        endingDate = (endType == 'date') ? moment(endingDate).format("DD.MM.YYYY HH:mm:ss") : null;
        return this.http.put('/api/reservations/' + type + '/repetition/' + id, JSON.stringify({ id: id, reservationId: reservationId, repetation: repetation, interval: interval, appearance: appearance, endingDate: endingDate }), { headers: headers });
    };
    ReservationService.prototype.editOneRepeatingReservation = function (roomReservationId, dateAndTime) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/reservations/rooms/changes/', JSON.stringify({ roomReservationId: roomReservationId, dateAndTime: dateAndTime }), { headers: headers });
    };
    ReservationService.prototype.deleteRepeatingReservation = function (type, repetitionId) {
        return this.http.delete('/api/reservations/' + type + '/repetition/' + repetitionId);
    };
    ReservationService.prototype.checkDupliciteRepeatingReservations = function (reservationId, repetation, interval, appearance, endType, endingDate) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        appearance = (endType == 'appearance') ? appearance : null;
        endingDate = (endType == 'date') ? moment(endingDate).format("DD.MM.YYYY HH:mm:ss") : null;
        return this.http.post('/api/reservations/rooms/checkForDuplicity/', JSON.stringify({ reservationId: reservationId, repetation: repetation, interval: interval, appearance: appearance, endingDate: endingDate }), { headers: headers });
    };
    ReservationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ReservationService);
    return ReservationService;
}());
exports.ReservationService = ReservationService;

//# sourceMappingURL=reservation.service.js.map
