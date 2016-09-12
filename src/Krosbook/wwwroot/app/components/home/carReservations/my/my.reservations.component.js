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
var carReservation_service_1 = require('../../../../services/carReservation.service');
var car_service_1 = require('../../../../services/car.service');
var router_1 = require('@angular/router');
var moment = require('moment');
var MyReservationsComponent = (function () {
    function MyReservationsComponent(carReservationService, carService, router) {
        var _this = this;
        this.carReservationService = carReservationService;
        this.carService = carService;
        this.router = router;
        this.reservations = new Array();
        this.cars = new Array();
        this.states = ['Nespracovaná', 'Schválená', 'Zaradená na vymazanie'];
        this.carService.getCars().subscribe(function (data) {
            var cars = data.json();
            for (var i = 0; i < cars.length; i++)
                _this.cars[cars[i].id] = cars[i].name + " : " + cars[i].plate;
        }, function (error) { return console.log(error); }, function () { _this.updateReservationsData(); });
    }
    MyReservationsComponent.prototype.ngOnInit = function () {
        $("li.active").removeClass("active");
        $("#liMyreservation").addClass("active");
    };
    MyReservationsComponent.prototype.updateReservationsData = function () {
        var _this = this;
        this.carReservationService.getUserOrders().subscribe(function (data) {
            _this.reservations = data.json();
        }, function (error) { return console.log(error); });
    };
    MyReservationsComponent.prototype.editReservation = function (id) {
        this.router.navigate(['/home/reservations/cars/editreservation/', id]);
    };
    MyReservationsComponent.prototype.deleteReservation = function (id) {
        var _this = this;
        if (confirm("Naozaj chcete vymazať túto rezerváciu auta?")) {
            this.carReservationService.removeOrder(id).subscribe(function (data) { }, function (error) { alert(error); }, function () { _this.updateReservationsData(); });
        }
    };
    MyReservationsComponent.prototype.askForDeleteReservation = function (id) {
        var _this = this;
        if (confirm("Naozaj chcete požiadať o zrušenie tejto rezervácie auta?")) {
            this.carReservationService.safeRemoveOrder(id).subscribe(function (data) { }, function (error) { alert(error); }, function () { _this.updateReservationsData(); });
        }
    };
    MyReservationsComponent.prototype.formatDateTime = function (dateTime) {
        return moment(dateTime).format("DD.MM.YYYY HH:mm");
    };
    MyReservationsComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/home/carReservations/my/my.reservations.component.html',
            providers: [carReservation_service_1.CarOrderService],
        }), 
        __metadata('design:paramtypes', [carReservation_service_1.CarOrderService, car_service_1.CarService, router_1.Router])
    ], MyReservationsComponent);
    return MyReservationsComponent;
}());
exports.MyReservationsComponent = MyReservationsComponent;
