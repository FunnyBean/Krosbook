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
var cars_admin_component_1 = require('./cars/cars.admin.component');
var equipment_admin_component_1 = require('./equipment/equipment.admin.component');
var offices_admin_component_1 = require('./offices/offices.admin.component');
var roles_admin_component_1 = require('./roles/roles.admin.component');
var users_admin_component_1 = require('./users/users.admin.component');
var AdminComponent = (function () {
    function AdminComponent() {
        this.contentHeight = (window.innerHeight - 78).toString() + 'px';
    }
    AdminComponent.prototype.ngOnInit = function () {
        $(window).unbind("resize");
        window.addEventListener("resize", function () {
            this.contentHeight = (window.innerHeight - 78).toString() + 'px';
            document.getElementById("content").style.minHeight = this.contentHeight;
        });
    };
    AdminComponent.prototype.ngAfterContentInit = function () {
        $("#leftMenu a:nth-child(1)").addClass("active");
        $("#leftMenu a").on("click", function () {
            $("a.active").removeClass("active");
            $(this).addClass("active");
        });
    };
    AdminComponent = __decorate([
        core_1.Component({
            selector: 'admin',
            templateUrl: 'app/components/admin/admin.component.html',
            styleUrls: ['app/components/admin/admin.component.css'],
            directives: [router_1.ROUTER_DIRECTIVES],
            precompile: [cars_admin_component_1.CarsAdminComponent, equipment_admin_component_1.EquipmentAdminComponent, offices_admin_component_1.OfficesAdminComponent, roles_admin_component_1.RolesAdminComponent, users_admin_component_1.UsersAdminComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AdminComponent);
    return AdminComponent;
}());
exports.AdminComponent = AdminComponent;

//# sourceMappingURL=admin.component.js.map
