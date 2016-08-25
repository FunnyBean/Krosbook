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
var carReservation_model_1 = require('../../../../models/carReservation.model');
var carReservation_service_1 = require('../../../../services/carReservation.service');
var moment = require('moment');
var OrderDetailComponent = (function () {
    function OrderDetailComponent(carOrderService) {
        this.carOrderService = carOrderService;
        this.reservationData = new carReservation_model_1.CarReservation();
        this.formReset = true;
        this.windowClose = new core_1.EventEmitter();
        this.updateList = new core_1.EventEmitter();
    }
    OrderDetailComponent.prototype.closeWindow = function () {
        this.windowClose.emit(false);
    };
    OrderDetailComponent.prototype.newOrder = function () {
        var _this = this;
        this.carOrderService.addOrder(8, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.GPSSystem, this.reservationData.privateUse, this.reservationData.requirements, this.reservationData.travelInsurance, 1).subscribe(function (data) {
        }, function (error) {
            _this.error = error;
        }, function () {
            _this.success = 'Objedávka úspešne vytvorená.';
            _this.reservationData = new carReservation_model_1.CarReservation();
            _this.formReset = false;
            setTimeout(function () { return _this.formReset = true; }, 0);
        });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], OrderDetailComponent.prototype, "windowClose", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], OrderDetailComponent.prototype, "updateList", void 0);
    OrderDetailComponent = __decorate([
        core_1.Component({
            selector: 'order',
            templateUrl: 'app/components/home/carReservations/order/order.detail.component.html',
            styleUrls: ['lib/css/modalWindow.css'],
            providers: [carReservation_service_1.CarOrderService]
        }), 
        __metadata('design:paramtypes', [carReservation_service_1.CarOrderService])
    ], OrderDetailComponent);
    return OrderDetailComponent;
}());
exports.OrderDetailComponent = OrderDetailComponent;
