import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {CarService} from '../../services/car.service';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {User} from '../../models/user.admin.model';
import {Car} from '../../models/car.model';

import {CarsReservationsComponent} from './carReservations/car.reservations.component';
import {ProfileComponent} from './profile/profile.component';
import {RoomReservationsComponent} from './roomReservations/room.reservations.component';
import {UserInfoComponent} from './userInfo/userInfo.component';
//import {PageScrollService} from '../../../../node_modules/ng2-page-scroll/src/ng2-page-scroll.service'
declare var $:any;

@Component({
  selector: 'home',
  templateUrl: 'app/components/home/home.component.html',
  styleUrls: ['app/components/home/home.component.css'],
  directives: [ROUTER_DIRECTIVES, UserInfoComponent],
  precompile: [CarsReservationsComponent, ProfileComponent, RoomReservationsComponent, UserInfoComponent]
})

export class HomeComponent implements OnInit{

  public openUserInfo:boolean = false;
  public userData:User = new User();

  private isAdmin:boolean = false;
  private carsData: Array<Car>;
  private height;

  constructor(private userService:UserService, private carService:CarService, private router:Router) { 
    this.carService.getCars().subscribe(
    data => {
      this.carsData = data.json();
    },
    error => console.log(error),
    () => {  }
    ) 
  }

  ngOnInit(){
    this.userService.myProfile().subscribe(
      data =>{
        this.userData = data.json();
        for(var i = 0; i < this.userData.roles.length; i++)
        {
          if(this.userData.roles[i].roleId == 1)
            this.isAdmin = true;
        }
      },
      error =>{console.log(error)}
    )


  }

  ngAfterContentInit(){
    this.height = window.innerHeight - document.getElementById("header").clientHeight;
    $(window).on("resize", function(){
      this.height = window.innerHeight - document.getElementById("header").clientHeight;
      $("#content").css({"height": this.height});
    });
    $("#left_menu a").on("click", function(){
      $("a.active").removeClass("active");
      $(this).addClass("active");
    });
  }


  showUserInfo()
  {
    document.getElementById('userInfo').style.display='block';
  }
}
