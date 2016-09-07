import {Component, OnInit, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import {ActivatedRoute,ROUTER_DIRECTIVES,Router} from '@angular/router';

import {User} from '../../../models/user.admin.model';
import {UserService} from '../../../services/user.service';

import {MyReservationsComponent} from './myReservations/myReservations.component';
import {OrderDetailComponent} from './order/order.detail.component';
import {OrdersManagerComponent} from './orders/orders.manager.component';
import {ReservationsComponent} from './reservations/reservations.component';

declare var $:any;

@Component({
    templateUrl: 'app/components/home/carReservations/car.reservations.component.html',
    styles: ['.table-arrow {top: 0px;} #filter{background-color: #f2f2f2; padding: 10px;}'],
    directives: [ROUTER_DIRECTIVES],   
    precompile: [OrderDetailComponent, OrdersManagerComponent, ReservationsComponent, MyReservationsComponent]
})

export class CarsReservationsComponent  {

  private prevadzkar:boolean = false;
  private userData:User = new User();

  constructor(private router:Router, private userService:UserService) {}

  ngOnInit(){
    this.userService.myProfile().subscribe(
      data =>{
        this.userData = data.json();
        for(var i = 0; i < this.userData.roles.length; i++)
        {
          if(this.userData.roles[i].roleId == 2)
            this.prevadzkar = true;
        }
      },
      error =>{console.log(error)}
    )  
        
    $("li.active").removeClass("active");
    $("#liOrders").addClass("active");  

    $("#left_menu a:nth-child(4)").addClass("active");
  }

  setActiveClass(element)
  {
    $("li.active").removeClass("active");
    $(element).parent("li").addClass("active");
  }
}

