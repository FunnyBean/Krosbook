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
var car_order_model_1 = require('../../../../models/car.order.model');
var car_order_service_1 = require('../../../../services/car.order.service');
var OrderDetailComponent = (function () {
    function OrderDetailComponent(carOrderService) {
        this.carOrderService = carOrderService;
        this.orderData = new car_order_model_1.CarOrder();
        this.formReset = true;
        this.windowClose = new core_1.EventEmitter();
        this.updateList = new core_1.EventEmitter();
    }
    OrderDetailComponent.prototype.closeWindow = function () {
        this.windowClose.emit(false);
    };
    OrderDetailComponent.prototype.newOrder = function () {
        var _this = this;
        var beginOrder = this.orderData.beginOrder;
        var endOrder = this.orderData.endOrder;
        var destinationName = this.orderData.destinationName;
        var insurance = this.orderData.insurance;
        var gpsRequirement = this.orderData.gpsRequirement;
        var changeBussinesTrip = this.orderData.changeBussinesTrip;
        var otherRequirement = this.orderData.otherRequirement;
        var privateUse = this.orderData.privateUse;
        this.carOrderService.addOrder(JSON.stringify({ beginOrder: beginOrder, endOrder: endOrder, destinationName: destinationName, insurance: insurance, gpsRequirement: gpsRequirement, changeBussinesTrip: changeBussinesTrip, otherRequirement: otherRequirement, privateUse: privateUse })).subscribe(function (data) {
        }, function (error) {
            _this.error = error;
        }, function () {
            _this.success = 'Objedávka úspešne vytvorená.';
            _this.orderData = new car_order_model_1.CarOrder();
            _this.formReset = false;
            setTimeout(function () { return _this.formReset = true; }, 0);
            _this.updateList.emit(true);
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
            templateUrl: 'app/components/home/carReservations/order.detail/order.detail.component.html',
            styleUrls: ['lib/css/modalWindow.css'],
            providers: [car_order_service_1.CarOrderService]
        }), 
        __metadata('design:paramtypes', [car_order_service_1.CarOrderService])
    ], OrderDetailComponent);
    return OrderDetailComponent;
}());
exports.OrderDetailComponent = OrderDetailComponent;
