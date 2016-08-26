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
var carReservation_service_1 = require('../../../../services/carReservation.service');
var car_service_1 = require('../../../../services/car.service');
var user_service_1 = require('../../../../services/user.service');
var moment = require('moment');
var observable_1 = require('rxjs/observable');
var OrdersManagerComponent = (function () {
    function OrdersManagerComponent(router, carOrderService, carService, userService) {
        var _this = this;
        this.router = router;
        this.carOrderService = carOrderService;
        this.carService = carService;
        this.userService = userService;
        this.isShowedFilterInput = false;
        this.cars = new Array();
        this.users = new Array();
        this.states = ['Nespracovaná', 'Schválená', 'Žiada o vymazanie'];
        this.carService.getCars().subscribe(function (data) {
            var cars = data.json();
            _this.carsData = data.json();
            for (var i = 0; i < cars.length; i++)
                _this.cars[cars[i].id] = cars[i].name + " : " + cars[i].plate;
        }, function (error) { return console.log(error); }, function () { _this.getUsers(); });
    }
    OrdersManagerComponent.prototype.ngOnInit = function () {
        $("li.active").removeClass("active");
        ;
        $("#liOrders").addClass("active");
    };
    OrdersManagerComponent.prototype.getUsers = function () {
        var _this = this;
        this.userService.getUsers().subscribe(function (data) {
            var usersArray = data.json();
            _this.usersData = data.json();
            for (var i = 0; i < usersArray.length; i++)
                _this.users[usersArray[i].id] = usersArray[i].name + ' ' + usersArray[i].surname;
        }, function (error) { return console.log(error); }, function () { _this.getOrders(); });
    };
    OrdersManagerComponent.prototype.editOrder = function (id) {
        this.router.navigate(['/home/reservations/cars/editreservation/', id]);
    };
    OrdersManagerComponent.prototype.removeOrder = function (id) {
        var _this = this;
        if (confirm("Naozaj chcete vymazať rezerváciu?")) {
            this.carOrderService.removeOrder(id).subscribe(function (data) {
            }, function (error) {
                alert(error);
            }, function () {
                _this.getOrders();
            });
        }
    };
    OrdersManagerComponent.prototype.approveOrder = function (carId, id, from, to) {
        var _this = this;
        this.isFree(carId, id, from, to).subscribe(function (result) {
            if (result) {
                if (confirm("Schvaľujete túto rezerváciu?")) {
                    _this.carOrderService.approveOrder(id).subscribe(function (data) {
                    }, function (error) {
                        alert(error);
                    }, function () {
                        _this.getOrders();
                    });
                }
            }
            else
                return false;
        });
    };
    OrdersManagerComponent.prototype.showFilterInput = function () {
        this.isShowedFilterInput = !this.isShowedFilterInput;
        if (this.isShowedFilterInput) {
            document.getElementById("filterButton").innerHTML = "<span class='glyphicon glyphicon-filter'></span> Skryť filter";
        }
        else {
            document.getElementById("filterButton").innerHTML = "<span class='glyphicon glyphicon-filter'></span> Zobraziť filter";
        }
    };
    OrdersManagerComponent.prototype.formatDateTime = function (dateTime) {
        return moment(dateTime).format('DD.MM.YYYY HH:mm');
    };
    OrdersManagerComponent.prototype.getOrders = function () {
        var _this = this;
        this.carOrderService.getOrders()
            .subscribe(function (data) {
            _this.orders = data.json();
        }, function (error) { return console.error(error); });
    };
    OrdersManagerComponent.prototype.isFree = function (carId, reservationId, from, to) {
        var _this = this;
        return new observable_1.Observable(function (observer) {
            _this.carOrderService.getReservations(carId, moment(from).format("DD.MM.YYYY"), moment(to).add(1, 'days').format("DD.MM.YYYY")).subscribe(function (data) {
                var results = data.json();
                if (results == "") {
                    observer.next(true);
                    observer.complete();
                }
                else {
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        if (result.id == reservationId) {
                            observer.next(true);
                            observer.complete();
                        }
                        var reservationTime = moment(from).format("HH:mm"), reservationTimeEnd = moment(to).format("HH:mm"), time = moment(result.dateTimeStart).format("HH:mm"), endTime = moment(result.dateTimeEnd).format("HH:mm");
                        if ((reservationTime >= time && reservationTime < endTime) || (time >= reservationTime && time < reservationTimeEnd)) {
                            alert("Nájdený konflitk - " + result.destination + ": " + moment(result.dateTimeStart).format("DD.MM.YY HH:mm") + " - " + moment(result.dateTimeEnd).format("DD.MM.YY HH:mm"));
                            observer.next(false);
                            observer.complete();
                        }
                        else {
                            observer.next(true);
                            observer.complete();
                        }
                    }
                }
            });
        });
    };
    OrdersManagerComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/home/carReservations/orders/orders.manager.component.html',
            providers: [carReservation_service_1.CarOrderService],
            styles: [' #filter{background-color: #f2f2f2; padding: 10px}']
        }), 
        __metadata('design:paramtypes', [router_1.Router, carReservation_service_1.CarOrderService, car_service_1.CarService, user_service_1.UserService])
    ], OrdersManagerComponent);
    return OrdersManagerComponent;
}());
exports.OrdersManagerComponent = OrdersManagerComponent;
