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
var user_admin_model_1 = require('../../../models/user.admin.model');
var user_service_1 = require('../../../services/user.service');
var CarsReservationsComponent = (function () {
    function CarsReservationsComponent(router, userService) {
        this.router = router;
        this.userService = userService;
        this.prevadzkar = false;
        this.userData = new user_admin_model_1.User();
    }
    CarsReservationsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.myProfile().subscribe(function (data) {
            _this.userData = data.json();
            for (var i = 0; i < _this.userData.roles.length; i++) {
                if (_this.userData.roles[i].roleId == 2)
                    _this.prevadzkar = true;
            }
        }, function (error) { console.log(error); });
        $("li.active").removeClass("active");
        $("#liOrders").addClass("active");
    };
    CarsReservationsComponent.prototype.setActiveClass = function (element) {
        $("li.active").removeClass("active");
        $(element).parent("li").addClass("active");
    };
    CarsReservationsComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/components/home/carReservations/car.reservations.component.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            styles: ['.table-arrow {top: 0px;} #filter{background-color: #f2f2f2; padding: 10px;}']
        }), 
        __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService])
    ], CarsReservationsComponent);
    return CarsReservationsComponent;
}());
exports.CarsReservationsComponent = CarsReservationsComponent;
