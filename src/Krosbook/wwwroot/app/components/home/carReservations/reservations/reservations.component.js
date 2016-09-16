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
var car_service_1 = require('../../../../services/car.service');
var user_service_1 = require('../../../../services/user.service');
var user_admin_model_1 = require('../../../../models/user.admin.model');
var table_reservations_component_1 = require('./table/table.reservations.component');
var moment = require('moment');
var time_validator_1 = require("../../../../validators/time.validator");
var order_detail_component_1 = require('../order/order.detail.component');
var ReservationsComponent = (function () {
    function ReservationsComponent(route, carService, userService) {
        this.route = route;
        this.carService = carService;
        this.userService = userService;
        this.reservationType = "cars";
        this.times = JSON.parse('[]');
        this.loggedUser = new user_admin_model_1.User();
        this.usersList = [];
        this.length = 1;
        this.maxTime = 10.5;
        this.week = 0;
        this.now = moment();
        this.moveDate = this.now.format("YYYY-MM-DD");
        this.showOrderWindow = false;
        this.cars = new Array();
    }
    ReservationsComponent.prototype.ngOnInit = function () {
        this.loadUsersData();
        this.updateTime();
        this.updateWeek();
        $("li.active").removeClass("active");
        $("#liCars").addClass("active");
    };
    ReservationsComponent.prototype.ngOnDestroy = function () {
        $("#content").unbind("scroll");
    };
    ReservationsComponent.prototype.ngAfterViewInit = function () {
        var tables = this.tableReservationComponent.toArray();
        for (var i = 0; i < tables.length; i++) {
            tables[i].updateData(this.week);
        }
    };
    ReservationsComponent.prototype.ngAfterContentInit = function () {
        this.tableWidth = document.getElementById("reservationTable").clientWidth;
        $(window).on("resize", function () {
            this.tableWidth = document.getElementById("reservationTable").clientWidth;
            $("thead, #month").css({ "width": this.tableWidth });
        });
        $("#content").scroll(function () {
            var element = $("thead");
            var headHeight = document.getElementById("header").clientHeight;
            if (!element.hasClass("headFixed") && element.offset().top <= headHeight) {
                element.addClass("headFixed").css({ "top": headHeight });
                $("#contentHolder").show(0).css({ "height": element.height() });
            }
            if (element.hasClass("headFixed") && $("tbody h4").offset().top - element.height() > element.offset().top) {
                element.removeClass("headFixed");
                $("#contentHolder").hide(0).css({ "height": '0px' });
            }
        });
    };
    ReservationsComponent.prototype.updateMaxTime = function () {
        this.maxTime = (18 - moment(this.dateTime).hour()) * 60;
    };
    ReservationsComponent.prototype.loadUsersData = function () {
        var _this = this;
        this.userService.getUsers().subscribe(function (data) {
            var usersArray = data.json();
            for (var i = 0; i < usersArray.length; i++)
                _this.usersList[usersArray[i].id] = usersArray[i].name + ' ' + usersArray[i].surname;
        }, function (error) { return console.log(error); }, function () { _this.loadCarsData(); });
        this.userService.myProfile().subscribe(function (data) {
            _this.loggedUser = data.json();
        }, function (error) { return console.log(error); });
    };
    ReservationsComponent.prototype.loadCarsData = function () {
        var _this = this;
        this.carService.getCars().subscribe(function (data) {
            _this.data = data.json();
            for (var i = 0; i < _this.data.length; i++) {
                var row = _this.data[i];
                if (_this.cars.indexOf(row.name) == -1)
                    _this.cars.push(row.name);
            }
        }, function (error) { return console.log(error); });
    };
    ReservationsComponent.prototype.updateTime = function () {
        for (var i = 7; i < 19; i++) {
            var time = moment().hour(i).minute(0).format('HH:mm');
            this.times.push({ 'time': time });
        }
    };
    ReservationsComponent.prototype.moveFor = function () {
        this.week += 1;
        this.updateWeek();
        this.ngAfterViewInit();
    };
    ReservationsComponent.prototype.moveBack = function () {
        this.week -= 1;
        this.updateWeek();
        this.ngAfterViewInit();
    };
    ReservationsComponent.prototype.moveToday = function () {
        this.week = 0;
        this.updateWeek();
        this.ngAfterViewInit();
    };
    ReservationsComponent.prototype.moveToDate = function () {
        this.week = moment(this.moveDate).week() - moment().week() + 52 * (moment(this.moveDate).year() - moment().year());
        if (moment(this.moveDate).year() - moment().year() !== 0)
            this.week++;
        this.updateWeek();
        this.ngAfterViewInit();
    };
    ReservationsComponent.prototype.updateWeek = function () {
        this.month = moment().add(this.week, 'weeks').format("MMMM").toUpperCase();
        this.days = JSON.parse('[]');
        for (var i = 1; i < 6; i++) {
            var day = moment().add(this.week, 'weeks').weekday(i).format("dd DD.MM.YY");
            this.days.push(day);
        }
    };
    //opens order.detail.component window
    ReservationsComponent.prototype.windowOpen = function () {
        this.showOrderWindow = true;
    };
    //closes order.detail.component window
    ReservationsComponent.prototype.windowClose = function (action) {
        // this.showOrderWindow = action;
        this.showOrderWindow = false;
    };
    __decorate([
        core_1.ViewChildren(table_reservations_component_1.TableReservationComponent), 
        __metadata('design:type', core_1.QueryList)
    ], ReservationsComponent.prototype, "tableReservationComponent", void 0);
    ReservationsComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/home/carReservations/reservations/reservations.component.html',
            directives: [table_reservations_component_1.TableReservationComponent, time_validator_1.TimeValidator, time_validator_1.DateValidator, order_detail_component_1.OrderDetailComponent, router_1.ROUTER_DIRECTIVES],
            styles: ['.table-arrow {top: 0px;} #filter{background-color: #f2f2f2; padding: 10px}']
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, car_service_1.CarService, user_service_1.UserService])
    ], ReservationsComponent);
    return ReservationsComponent;
}());
exports.ReservationsComponent = ReservationsComponent;
