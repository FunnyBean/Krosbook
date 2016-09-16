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
var carTime_validator_1 = require('../../../../validators/carTime.validator');
var router_1 = require('@angular/router');
var carReservation_model_1 = require('../../../../models/carReservation.model');
var carReservation_service_1 = require('../../../../services/carReservation.service');
var car_service_1 = require('../../../../services/car.service');
var user_service_1 = require('../../../../services/user.service');
var moment = require('moment');
var formData_service_1 = require('../../../../services/formData.service');
var OrderDetailComponent = (function () {
    function OrderDetailComponent(formDataService, route, router, carOrderService, carService, userService) {
        this.formDataService = formDataService;
        this.route = route;
        this.router = router;
        this.carOrderService = carOrderService;
        this.carService = carService;
        this.userService = userService;
        this.reservationData = new carReservation_model_1.CarReservation();
        this.cars = new Array();
        this.formReset = true;
        this.reservationId = undefined;
        this.isOperator = false;
        this.free = true;
    }
    OrderDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        var inputData = this.formDataService.loadData();
        if (inputData[0] !== undefined && this.reservationId === undefined) {
            this.reservationData.dateTimeStart = inputData[0];
            this.reservationData.dateTimeEnd = inputData[1];
            this.reservationData.carId = inputData[2];
        }
        this.route.params.subscribe(function (params) {
            _this.reservationId = params['id'];
            _this.carService.getCars().subscribe(function (data) {
                _this.cars = data.json();
                if (_this.reservationId !== undefined) {
                    _this.getReservationData();
                    _this.getUserData();
                }
            }, function (error) { return console.log(error); });
        });
        $("li.active").removeClass("active");
        $("#liNewReservation").addClass("active");
    };
    OrderDetailComponent.prototype.newOrder = function () {
        var _this = this;
        if (this.free) {
            this.carOrderService.addOrder(this.reservationData.carId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse, this.reservationData.requirements, this.reservationData.travelInsurance, 1).subscribe(function (data) {
            }, function (error) {
                _this.error = error;
            }, function () {
                _this.success = 'Objedávka úspešne vytvorená.';
                _this.reservationData = new carReservation_model_1.CarReservation();
                _this.formReset = false;
                setTimeout(function () { return _this.formReset = true; }, 0);
            });
        }
        else
            return false;
    };
    OrderDetailComponent.prototype.editOrder = function () {
        var _this = this;
        if (this.free) {
            this.carOrderService.editOrder(this.reservationData.id, this.reservationData.carId, this.reservationData.userId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse, this.reservationData.requirements, this.reservationData.travelInsurance, this.reservationData.reservationState).subscribe(function (data) {
                _this.success = "Zmeny boli uložené.";
            });
        }
        else
            return false;
    };
    OrderDetailComponent.prototype.editAndApproveOrder = function () {
        var _this = this;
        if (this.free) {
            this.carOrderService.editOrder(this.reservationData.id, this.reservationData.carId, this.reservationData.userId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse, this.reservationData.requirements, this.reservationData.travelInsurance, this.reservationData.reservationState).subscribe(function (data) {
                _this.carOrderService.approveOrder(_this.reservationData.id).subscribe(function (data) { _this.success = "Zmeny boli uložené."; });
            });
        }
        else
            return false;
    };
    OrderDetailComponent.prototype.getReservationData = function () {
        var _this = this;
        this.carOrderService.getOrder(this.reservationId).subscribe(function (data) {
            _this.reservationData = data.json();
            _this.isFree(_this.reservationData.carId, _this.reservationData.dateTimeStart, _this.reservationData.dateTimeEnd);
        }, function (error) { _this.router.navigate(['/home/reservations/cars/myreservations']); });
    };
    OrderDetailComponent.prototype.getUserData = function () {
        var _this = this;
        this.userService.myProfile().subscribe(function (data) {
            var user = data.json();
            for (var i = 0; i < user.roles.length; i++) {
                if (user.roles[i].roleId == 2)
                    _this.isOperator = true;
            }
        }, function (error) { console.log(error); });
    };
    OrderDetailComponent.prototype.isFree = function (carId, from, to) {
        var _this = this;
        if (carId == null)
            return false;
        this.carOrderService.getReservations(carId, moment(from).format("DD.MM.YYYY"), moment(to).add(1, 'days').format("DD.MM.YYYY")).subscribe(function (data) {
            var results = data.json();
            if (results == "") {
                _this.error = "";
                _this.free = true;
                return true;
            }
            else {
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    if (result.id == _this.reservationData.id) {
                        _this.error = "";
                        _this.free = true;
                        return true;
                    }
                    var reservationTime = moment(from).format("YYYY-MM-DDTHH:mm"), reservationTimeEnd = moment(to).format("YYYY-MM-DDTHH:mm"), time = moment(result.dateTimeStart).format("YYYY-MM-DDTHH:mm"), endTime = moment(result.dateTimeEnd).format("YYYY-MM-DDTHH:mm");
                    if ((reservationTime >= time && reservationTime < endTime) || (time >= reservationTime && time < reservationTimeEnd)) {
                        _this.error = "Nájdený konflitk - " + result.destination + ": " + moment(result.dateTimeStart).format("DD.MM.YY HH:mm") + " - " + moment(result.dateTimeEnd).format("DD.MM.YY HH:mm");
                        _this.free = false;
                        return false;
                    }
                    else {
                        _this.error = "";
                        _this.free = true;
                    }
                }
            }
        });
    };
    OrderDetailComponent.prototype.updateEndTime = function () {
        if (this.reservationData.dateTimeEnd <= this.reservationData.dateTimeStart)
            this.reservationData.dateTimeEnd = moment(this.reservationData.dateTimeStart).add(1, 'hour').format("YYYY-MM-DDTHH:mm");
    };
    OrderDetailComponent.prototype.closeWindow = function () {
        if (this.reservationId)
            this.router.navigate(['/home/reservations/cars/orders']);
        else
            this.router.navigate(['/home/reservations/cars']);
    };
    OrderDetailComponent = __decorate([
        core_1.Component({
            selector: 'order',
            templateUrl: 'app/components/home/carReservations/order/order.detail.component.html',
            styleUrls: ['lib/css/modalWindow.css'],
            providers: [carReservation_service_1.CarOrderService],
            directives: [carTime_validator_1.DateValidator, carTime_validator_1.DatesValidator],
        }), 
        __metadata('design:paramtypes', [formData_service_1.FormDataService, router_1.ActivatedRoute, router_1.Router, carReservation_service_1.CarOrderService, car_service_1.CarService, user_service_1.UserService])
    ], OrderDetailComponent);
    return OrderDetailComponent;
}());
exports.OrderDetailComponent = OrderDetailComponent;

//# sourceMappingURL=order.detail.component.js.map
