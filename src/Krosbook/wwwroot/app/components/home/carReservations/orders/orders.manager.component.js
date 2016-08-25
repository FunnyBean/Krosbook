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
        this.states = ['Nové', 'Vybavené', 'Žiada o vymazanie'];
        this.carService.getCars().subscribe(function (data) {
            var cars = data.json();
            for (var i = 0; i < cars.length; i++)
                _this.cars[cars[i].id] = cars[i].name + " : " + cars[i].plate;
        }, function (error) { return console.log(error); }, function () { _this.getUsers(); });
    }
    OrdersManagerComponent.prototype.getUsers = function () {
        var _this = this;
        this.userService.getUsers().subscribe(function (data) {
            var usersArray = data.json();
            for (var i = 0; i < usersArray.length; i++)
                _this.users[usersArray[i].id] = usersArray[i].name + ' ' + usersArray[i].surname;
        }, function (error) { return console.log(error); }, function () { _this.getOrders(); });
    };
    OrdersManagerComponent.prototype.editOrder = function (id) {
        this.router.navigate(['/home/reservations/cars/editreservation/', id]);
    };
    OrdersManagerComponent.prototype.removeOrder = function (id) {
        var _this = this;
        if (confirm("Naozaj chcete vymazať objednávku?")) {
            this.carOrderService.removeOrder(id).subscribe(function (data) {
            }, function (error) {
                alert(error);
            }, function () {
                _this.getOrders();
            });
        }
    };
    OrdersManagerComponent.prototype.approveOrder = function (id) {
        var _this = this;
        if (confirm("Naozaj chcete ulozit objednávku?")) {
            this.carOrderService.approveOrder(id).subscribe(function (data) {
            }, function (error) {
                alert(error);
            }, function () {
                _this.getOrders();
            });
        }
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
        return moment().format('DD.MM.YYYY HH:MM');
    };
    OrdersManagerComponent.prototype.getOrders = function () {
        var _this = this;
        this.carOrderService.getOrders()
            .subscribe(function (data) {
            _this.orders = data.json();
        }, function (error) { return console.error(error); });
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
