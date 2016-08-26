"use strict";
var moment = require('moment');
var CarReservation = (function () {
    function CarReservation() {
        this.dateTimeStart = moment().minutes(0).format("YYYY-MM-DDTHH:mm");
        this.dateTimeEnd = moment().add(1, 'hour').minutes(0).format("YYYY-MM-DDTHH:mm");
        this.gpsSystem = false;
        this.privateUse = false;
        this.reservationState = 1;
    }
    return CarReservation;
}());
exports.CarReservation = CarReservation;
