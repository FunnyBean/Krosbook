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
/**
 * Created by Ondrej on 25.07.2016.
 */
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var car_service_1 = require('../../../services/car.service');
var office_service_1 = require('../../../services/office.service');
var user_service_1 = require('../../../services/user.service');
var user_admin_model_1 = require('../../../models/user.admin.model');
var table_reservations_component_1 = require('./table/table.reservations.component');
var moment = require('moment');
var time_validator_1 = require("../../../validators/time.validator");
var RoomReservationsComponent = (function () {
    function RoomReservationsComponent(route, carService, officeService, userService) {
        this.route = route;
        this.carService = carService;
        this.officeService = officeService;
        this.userService = userService;
        this.reservationType = 'rooms';
        this.times = JSON.parse('[]');
        this.loggedUser = new user_admin_model_1.User();
        this.usersList = [];
        this.length = 0.5;
        this.filterOfficeTypes = "";
        this.maxTime = 10.5;
        this.week = 0;
        this.now = moment();
        this.moveDate = this.now.format("YYYY-MM-DD");
        this.officeTypes = new Array();
    }
    RoomReservationsComponent.prototype.ngOnInit = function () {
        this.loadUsersData();
        this.updateTime();
        this.updateWeek();
    };
    RoomReservationsComponent.prototype.ngAfterViewInit = function () {
        var tables = this.tableReservationComponent.toArray();
        for (var i = 0; i < tables.length; i++) {
            tables[i].updateData(this.week);
        }
    };
    RoomReservationsComponent.prototype.ngAfterContentInit = function () {
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
        $("#left_menu a:nth-child(3)").addClass("active");
    };
    RoomReservationsComponent.prototype.ngOnDestroy = function () {
        $(window).unbind("resize");
        $(window).on("resize", function () {
            var height = window.innerHeight - document.getElementById("header").clientHeight;
            $("#content").css({ "height": height });
        });
    };
    RoomReservationsComponent.prototype.updateMaxTime = function () {
        this.maxTime = ((18 - moment(this.dateTime).hour()) * 60 - moment(this.dateTime).minute()) / 60;
    };
    RoomReservationsComponent.prototype.loadUsersData = function () {
        var _this = this;
        this.userService.getUsers().subscribe(function (data) {
            var usersArray = data.json();
            for (var i = 0; i < usersArray.length; i++)
                _this.usersList[usersArray[i].id] = usersArray[i].name + ' ' + usersArray[i].surname;
        }, function (error) { return console.log(error); }, function () {
            _this.loadOfficesData();
        });
        this.userService.myProfile().subscribe(function (data) {
            _this.loggedUser = data.json();
        }, function (error) { return console.log(error); });
    };
    RoomReservationsComponent.prototype.loadOfficesData = function () {
        var _this = this;
        this.officeService.getOffices().subscribe(function (data) {
            _this.data = data.json();
            for (var i = 0; i < _this.data.length; i++) {
                var row = _this.data[i];
                if (_this.officeTypes.indexOf(row.type) == -1)
                    _this.officeTypes.push(row.type);
            }
        }, function (error) { return console.log(error); });
    };
    RoomReservationsComponent.prototype.updateTime = function () {
        for (var i = 7; i < 18; i++) {
            for (var j = 0; j < 2; j++) {
                var time = moment().hour(i).minute(j * 30).format('HH:mm');
                this.times.push({ 'time': time });
            }
        }
    };
    RoomReservationsComponent.prototype.showFilterInput = function () {
        this.dateTime = moment().minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss");
        this.isShowedFilterInput = !this.isShowedFilterInput;
        if (this.isShowedFilterInput == false) {
            this.data = null;
            this.times = JSON.parse('[]');
            this.ngOnInit();
        }
        if (this.isShowedFilterInput) {
            document.getElementById("filterButton").innerHTML = "<span class='glyphicon glyphicon-filter'></span> Skryť filter";
        }
        else {
            document.getElementById("filterButton").innerHTML = "<span class='glyphicon glyphicon-filter'></span> Zobraziť filter";
        }
    };
    RoomReservationsComponent.prototype.filterReservation = function (element) {
        var _this = this;
        this.officeService.filterOffices(this.dateTime, this.length * 60, this.filterOfficeTypes).subscribe(function (data) {
            _this.data = data.json();
            _this.week = moment(_this.dateTime).week() - moment().week() + 52 * (moment(_this.dateTime).year() - moment().year());
            if (moment(_this.dateTime).year() - moment().year() !== 0)
                _this.week++;
            _this.updateWeek();
        }, function (error) { return console.log(error); });
    };
    RoomReservationsComponent.prototype.moveFor = function () {
        this.week += 1;
        this.updateWeek();
        this.ngAfterViewInit();
    };
    RoomReservationsComponent.prototype.moveBack = function () {
        this.week -= 1;
        this.updateWeek();
        this.ngAfterViewInit();
    };
    RoomReservationsComponent.prototype.moveToday = function () {
        this.week = 0;
        this.updateWeek();
        this.ngAfterViewInit();
    };
    RoomReservationsComponent.prototype.moveToDate = function () {
        this.week = moment(this.moveDate).week() - moment().week() + 52 * (moment(this.moveDate).year() - moment().year());
        if (moment(this.moveDate).year() - moment().year() !== 0)
            this.week++;
        this.updateWeek();
        this.ngAfterViewInit();
    };
    RoomReservationsComponent.prototype.updateWeek = function () {
        this.month = moment().add(this.week, 'weeks').format("MMMM").toUpperCase();
        this.days = JSON.parse('[]');
        for (var i = 1; i < 6; i++) {
            var day = moment().add(this.week, 'weeks').weekday(i).format("dd DD.MM.YY");
            this.days.push(day);
        }
    };
    __decorate([
        core_1.ViewChildren(table_reservations_component_1.TableReservationComponent), 
        __metadata('design:type', core_1.QueryList)
    ], RoomReservationsComponent.prototype, "tableReservationComponent", void 0);
    RoomReservationsComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/home/roomReservations/room.reservations.component.html',
            directives: [table_reservations_component_1.TableReservationComponent, time_validator_1.TimeValidator, time_validator_1.DateValidator],
            styles: ['.table-arrow {top: 0px;} #filter{background-color: #f2f2f2; padding: 10px}']
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, car_service_1.CarService, office_service_1.OfficeService, user_service_1.UserService])
    ], RoomReservationsComponent);
    return RoomReservationsComponent;
}());
exports.RoomReservationsComponent = RoomReservationsComponent;
