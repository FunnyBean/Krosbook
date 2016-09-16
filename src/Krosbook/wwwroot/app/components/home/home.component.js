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
var user_service_1 = require('../../services/user.service');
var router_1 = require('@angular/router');
var user_admin_model_1 = require('../../models/user.admin.model');
var car_reservations_component_1 = require('./carReservations/car.reservations.component');
var profile_component_1 = require('./profile/profile.component');
var room_reservations_component_1 = require('./roomReservations/room.reservations.component');
var userInfo_component_1 = require('./userInfo/userInfo.component');
var HomeComponent = (function () {
    function HomeComponent(userService) {
        this.userService = userService;
        this.openUserInfo = false;
        this.isAdmin = false;
        this.openReservations = true;
        this.userData = new user_admin_model_1.User();
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.myProfile().subscribe(function (data) {
            _this.userData = data.json();
            for (var i = 0; i < _this.userData.roles.length; i++) {
                if (_this.userData.roles[i].roleId == 1)
                    _this.isAdmin = true;
            }
        }, function (error) { console.log(error); });
    };
    HomeComponent.prototype.ngAfterContentInit = function () {
        this.height = window.innerHeight - document.getElementById("header").clientHeight;
        $(window).on("resize", function () {
            this.height = window.innerHeight - document.getElementById("header").clientHeight;
            $("#content").css({ "height": this.height });
        });
        $("#left_menu a").on("click", function () {
            $("a.active").removeClass("active");
            $(this).addClass("active");
        });
    };
    HomeComponent.prototype.showUserInfo = function () {
        //var str = (<HTMLTextAreaElement>document.getElementById("contentWindow"));
        // alert(str.toString()+"" + this.isViewed);
        //this.isViewed=!this.isViewed;
        document.getElementById('userInfo').style.display = 'block';
    };
    HomeComponent.prototype.toggleReservations = function () {
        this.openReservations = this.openReservations ? false : true;
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: 'app/components/home/home.component.html',
            styleUrls: ['app/components/home/home.component.css'],
            directives: [router_1.ROUTER_DIRECTIVES, userInfo_component_1.UserInfoComponent],
            precompile: [car_reservations_component_1.CarsReservationsComponent, profile_component_1.ProfileComponent, room_reservations_component_1.RoomReservationsComponent, userInfo_component_1.UserInfoComponent]
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;

//# sourceMappingURL=home.component.js.map
