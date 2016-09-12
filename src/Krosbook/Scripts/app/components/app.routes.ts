import {ProfileComponent} from './home/profile/profile.component';
import {provideRouter, RouterConfig}  from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {AdminComponent} from './admin/admin.component';
import {authProviders }      from './login.routes';
import {AuthGuard} from "./AuthGuard";
import {AdminGuard} from "./AdminGuard";
import {OperatorGuard} from './OperatorGuard';
import {PasswordResetComponent} from './login/passwordReset/passwordReset.component';
import {PasswordSetComponent} from './login/passwordSet/passwordSet.component';

import {UsersAdminComponent} from './admin/users/users.admin.component';
import {OfficesAdminComponent} from './admin/offices/offices.admin.component';
import {CarsAdminComponent} from "./admin/cars/cars.admin.component";
import {EquipmentAdminComponent} from "./admin/equipment/equipment.admin.component";
import {RolesAdminComponent} from './admin/roles/roles.admin.component';

import {OrdersManagerComponent} from './home/carReservations/orders/orders.manager.component';
import {ReservationsComponent} from './home/carReservations/reservations/reservations.component';
import {MyReservationsComponent} from './home/carReservations/my/my.reservations.component';
import {OrderDetailComponent } from './home/carReservations/order/order.detail.component';
import {RoomReservationsComponent} from './home/roomReservations/room.reservations.component';
import {CarsReservationsComponent} from './home/carReservations/car.reservations.component';
import {AvatarComponent} from "./home/profile/avatar/avatar.component";
import {PasswordComponent} from "./home/profile/password/password.component";


const routes: RouterConfig = [
    { path: '', redirectTo: 'home', terminal: true },
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            {
                path: 'profile', component: ProfileComponent,
                children: [
                    {
                        path: '', component: AvatarComponent
                    },
                    {
                        path: 'avatar', component: AvatarComponent
                    },
                    {
                        path: 'password', component: PasswordComponent
                    }
                ]
            },
            {
                path: '',
                component: RoomReservationsComponent
            },
            {
                path: 'reservations/cars',
                component: CarsReservationsComponent,
                children: [
                    {
                        path: '', component: ReservationsComponent
                    },
                    {
                        path: 'newreservation', component: OrderDetailComponent
                    },
                    {
                        path: 'editreservation/:id', component: OrderDetailComponent
                    },
                    {
                        path: 'myreservations', component: MyReservationsComponent,
                    },
                    {
                        path: 'orders', component: OrdersManagerComponent, canActivate: [OperatorGuard]
                    }
                ]
            },
            {
                path: 'reservations/rooms',
                component: RoomReservationsComponent
            }

        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'passwordReset', component: PasswordResetComponent },
    { path: 'passwordReset/:token', component: PasswordSetComponent },
    {
        path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard],
        children: [
            {
                path: '',
                component: UsersAdminComponent
            },
            {
                path: 'offices',
                component: OfficesAdminComponent
            },
            {
                path: 'cars',
                component: CarsAdminComponent
            },
            {
                path: 'users',
                component: UsersAdminComponent
            },
            {
                path: 'equipment',
                component: EquipmentAdminComponent
            },
            {
                path: 'roles',
                component: RolesAdminComponent
            }

        ]
    }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes), authProviders
];
