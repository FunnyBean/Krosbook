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
var carReservation_model_1 = require('../../../../models/carReservation.model');
var carReservation_service_1 = require('../../../../services/carReservation.service');
var car_service_1 = require('../../../../services/car.service');
var moment = require('moment');
var OrderDetailComponent = (function () {
    function OrderDetailComponent(route, carOrderService, carService) {
        this.route = route;
        this.carOrderService = carOrderService;
        this.carService = carService;
        this.reservationData = new carReservation_model_1.CarReservation();
        this.cars = new Array();
        this.formReset = true;
        this.reservationId = undefined;
    }
    OrderDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.reservationId = params['id'];
            _this.carService.getCars().subscribe(function (data) {
                _this.cars = data.json();
                if (_this.reservationId !== undefined)
                    _this.getReservationData();
            }, function (error) { return console.log(error); });
        });
    };
    OrderDetailComponent.prototype.newOrder = function () {
        var _this = this;
        this.carOrderService.addOrder(this.reservationData.carId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse, this.reservationData.requirements, this.reservationData.travelInsurance, 1).subscribe(function (data) {
        }, function (error) {
            _this.error = error;
        }, function () {
            _this.success = 'Objedávka úspešne vytvorená.';
            _this.reservationData = new carReservation_model_1.CarReservation();
            _this.formReset = false;
            setTimeout(function () { return _this.formReset = true; }, 0);
        });
    };
    OrderDetailComponent.prototype.editOrder = function () {
        var _this = this;
        this.carOrderService.editOrder(this.reservationData.id, this.reservationData.carId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse, this.reservationData.requirements, this.reservationData.travelInsurance, this.reservationData.reservationState).subscribe(function (data) {
            _this.success = "Zmeny boli uložené.";
        });
    };
    OrderDetailComponent.prototype.editAndApproveOrder = function () {
        var _this = this;
        this.carOrderService.editOrder(this.reservationData.id, this.reservationData.carId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse, this.reservationData.requirements, this.reservationData.travelInsurance, this.reservationData.reservationState).subscribe(function (data) {
            _this.carOrderService.approveOrder(_this.reservationData.id).subscribe(function (data) { _this.success = "Zmeny boli uložené."; });
        });
    };
    OrderDetailComponent.prototype.getReservationData = function () {
        var _this = this;
        this.carOrderService.getOrder(this.reservationId).subscribe(function (data) { _this.reservationData = data.json(); }, function (error) { return console.log(error); });
    };
    OrderDetailComponent = __decorate([
        core_1.Component({
            selector: 'order',
            templateUrl: 'app/components/home/carReservations/order/order.detail.component.html',
            styleUrls: ['lib/css/modalWindow.css'],
            providers: [carReservation_service_1.CarOrderService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, carReservation_service_1.CarOrderService, car_service_1.CarService])
    ], OrderDetailComponent);
    return OrderDetailComponent;
}());
exports.OrderDetailComponent = OrderDetailComponent;
