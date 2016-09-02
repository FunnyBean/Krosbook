"use strict";
var profile_component_1 = require('./home/profile/profile.component');
var router_1 = require('@angular/router');
var login_component_1 = require('./login/login.component');
var home_component_1 = require('./home/home.component');
var admin_component_1 = require('./admin/admin.component');
var login_routes_1 = require('./login.routes');
var AuthGuard_1 = require("./AuthGuard");
var AdminGuard_1 = require("./AdminGuard");
var OperatorGuard_1 = require('./OperatorGuard');
var passwordReset_component_1 = require('./login/passwordReset/passwordReset.component');
var passwordSet_component_1 = require('./login/passwordSet/passwordSet.component');
var users_admin_component_1 = require('./admin/users/users.admin.component');
var offices_admin_component_1 = require('./admin/offices/offices.admin.component');
var cars_admin_component_1 = require("./admin/cars/cars.admin.component");
var equipment_admin_component_1 = require("./admin/equipment/equipment.admin.component");
var roles_admin_component_1 = require('./admin/roles/roles.admin.component');
var orders_manager_component_1 = require('./home/carReservations/orders/orders.manager.component');
var reservations_component_1 = require('./home/carReservations/reservations/reservations.component');
var myReservations_component_1 = require('./home/carReservations/myreservations/myReservations.component');
var order_detail_component_1 = require('./home/carReservations/order/order.detail.component');
var room_reservations_component_1 = require('./home/roomReservations/room.reservations.component');
var car_reservations_component_1 = require('./home/carReservations/car.reservations.component');
var avatar_component_1 = require("./home/profile/avatar/avatar.component");
var password_component_1 = require("./home/profile/password/password.component");
var routes = [
    { path: '', redirectTo: 'home', terminal: true },
    {
        path: 'home', component: home_component_1.HomeComponent, canActivate: [AuthGuard_1.AuthGuard],
        children: [
            {
                path: 'profile', component: profile_component_1.ProfileComponent,
                children: [
                    {
                        path: '', component: avatar_component_1.AvatarComponent
                    },
                    {
                        path: 'avatar', component: avatar_component_1.AvatarComponent
                    },
                    {
                        path: 'password', component: password_component_1.PasswordComponent
                    }
                ]
            },
            {
                path: '',
                component: room_reservations_component_1.RoomReservationsComponent
            },
            {
                path: 'reservations/cars',
                component: car_reservations_component_1.CarsReservationsComponent,
                children: [
                    {
                        path: '', component: reservations_component_1.ReservationsComponent
                    },
                    {
                        path: 'newreservation', component: order_detail_component_1.OrderDetailComponent
                    },
                    {
                        path: 'editreservation/:id', component: order_detail_component_1.OrderDetailComponent
                    },
                    {
                        path: 'myreservations', component: myReservations_component_1.MyReservationsComponent,
                    },
                    {
                        path: 'orders', component: orders_manager_component_1.OrdersManagerComponent, canActivate: [OperatorGuard_1.OperatorGuard]
                    }
                ]
            },
            {
                path: 'reservations/rooms',
                component: room_reservations_component_1.RoomReservationsComponent
            }
        ]
    },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'passwordReset', component: passwordReset_component_1.PasswordResetComponent },
    { path: 'passwordReset/:token', component: passwordSet_component_1.PasswordSetComponent },
    {
        path: 'admin', component: admin_component_1.AdminComponent, canActivate: [AuthGuard_1.AuthGuard, AdminGuard_1.AdminGuard],
        children: [
            {
                path: '',
                component: users_admin_component_1.UsersAdminComponent
            },
            {
                path: 'offices',
                component: offices_admin_component_1.OfficesAdminComponent
            },
            {
                path: 'cars',
                component: cars_admin_component_1.CarsAdminComponent
            },
            {
                path: 'users',
                component: users_admin_component_1.UsersAdminComponent
            },
            {
                path: 'equipment',
                component: equipment_admin_component_1.EquipmentAdminComponent
            },
            {
                path: 'roles',
                component: roles_admin_component_1.RolesAdminComponent
            }
        ]
    }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(routes), login_routes_1.authProviders
];
