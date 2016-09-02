/**
 * Created by Ondrej on 25.07.2016.
 */
import {Component, OnInit, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import {ActivatedRoute,ROUTER_DIRECTIVES,Router} from '@angular/router';

import {User} from '../../../models/user.admin.model';
import {UserService} from '../../../services/user.service';

declare var $:any;

@Component({
  templateUrl: 'app/components/home/carReservations/car.reservations.component.html',
  directives: [ROUTER_DIRECTIVES],   
  styles: ['.table-arrow {top: 0px;} #filter{background-color: #f2f2f2; padding: 10px;}']

})

export class CarsReservationsComponent  {

  public prevadzkar:boolean=false;
  public userData:User=new User();

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

