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
var user_service_1 = require('../services/user.service');
var office_service_1 = require('../services/office.service');
var car_service_1 = require('../services/car.service');
var equipment_service_1 = require('../services/equipment.service');
var roles_service_1 = require('../services/roles.service');
var home_component_1 = require('./home/home.component');
var admin_component_1 = require('./admin/admin.component');
var login_component_1 = require('./login/login.component');
var passwordSet_component_1 = require('./login/passwordSet/passwordSet.component');
var passwordReset_component_1 = require('./login/passwordReset/passwordReset.component');
var my_reservations_component_1 = require('./home/carReservations/my/my.reservations.component');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            template: '<router-outlet></router-outlet>',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [
                user_service_1.UserService, office_service_1.OfficeService, car_service_1.CarService, equipment_service_1.EquipmentService, roles_service_1.RolesService
            ],
            precompile: [home_component_1.HomeComponent, admin_component_1.AdminComponent, login_component_1.LoginComponent, passwordSet_component_1.PasswordSetComponent, passwordReset_component_1.PasswordResetComponent, my_reservations_component_1.MyReservationsComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;

//# sourceMappingURL=app.component.js.map
