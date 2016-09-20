import {Component, OnInit, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {User} from '../../../models/user.admin.model';
import {UserService} from '../../../services/user.service';

import {MyReservationsComponent} from './my/my.reservations.component';
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

  constructor(private userService:UserService) {}

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

  ngAfterContentInit()
  {
    $("#content").scroll(function(){
      //console.log($("#content").scrollTop());
    });
    $("#carList").show(1, function(){
      $("#carList > a").on("click", function(){
        var element = $(this);
     //   console.log($(".records"+element.attr("id")).position());
        $("#content").animate({
            scrollTop: $("#content").scrollTop() + $(".records" + element.attr("id")).offset().top - $("#reservationHead").height() - $("#header").height()
        }, 'fast');
      });  
    });
  }

  ngOnDestroy()
  {
      $("#carList > a").unbind("click");
      $("#carList").hide();      
  }

  setActiveClass(element)
  {
    $("li.active").removeClass("active");
    $(element).parent("li").addClass("active");
  }
}

