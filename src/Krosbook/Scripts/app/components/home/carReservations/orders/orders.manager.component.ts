import {Component, OnInit} from  '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {CarReservation} from '../../../../models/carReservation.model';
import {CarOrderService} from '../../../../services/carReservation.service';
import {CarService} from '../../../../services/car.service';
import {UserService} from '../../../../services/user.service';
import * as moment from 'moment';

@Component({
  templateUrl: 'app/components/home/carReservations/orders/orders.manager.component.html',
  providers:[CarOrderService],
  styles: [' #filter{background-color: #f2f2f2; padding: 10px}']


})

export class OrdersManagerComponent {
  public orders:Array<CarReservation>;
  public orderId:number;
  public isShowedFilterInput:boolean=false;

  private cars:Array<string> = new Array<string>();
  private users:Array<string> = new Array<string>();

  public states = ['Nové', 'Vybavené', 'Žiada o vymazanie'];



  constructor(private router:Router,private carOrderService:CarOrderService, private carService:CarService, private userService:UserService) {
    this.carService.getCars().subscribe(
        data => {
            var cars = data.json();
            for(var i = 0; i < cars.length; i++)
                this.cars[cars[i].id] = cars[i].name + " : " + cars[i].plate; 
        },
        error => console.log(error),
        () => { this.getUsers() }
    )
  }

  getUsers(){
    this.userService.getUsers().subscribe(
      data => {
        var usersArray = data.json();
        for (var i = 0; i < usersArray.length; i++)
          this.users[usersArray[i].id] = usersArray[i].name + ' ' + usersArray[i].surname;
      },
      error => console.log(error),
      () => { this.getOrders(); }
    );
  }


  editOrder(id:number)
  {
     this.router.navigate(['/home/reservations/cars/editreservation/', id]);
  }

   removeOrder(id:number) {
    if(confirm("Naozaj chcete vymazať objednávku?")) {
      this.carOrderService.removeOrder(id).subscribe(
        data => {
        },
        error => {
          alert(error)
        },
        () => {
          this.getOrders();
        }
      )
    }
  }

  approveOrder(id:number){
    if(confirm("Naozaj chcete ulozit objednávku?")) {
      this.carOrderService.approveOrder(id).subscribe(
        data => {
        },
        error => {
          alert(error)
        },
        () => {
          this.getOrders();
        }
      )
    }   
    
  }

  showFilterInput() {    
    this.isShowedFilterInput = !this.isShowedFilterInput;
       
     if(this.isShowedFilterInput){
        document.getElementById("filterButton").innerHTML = "<span class='glyphicon glyphicon-filter'></span> Skryť filter";
     }
     else{
       document.getElementById("filterButton").innerHTML = "<span class='glyphicon glyphicon-filter'></span> Zobraziť filter";
     }     
  }

  formatDateTime(dateTime:any){
    return moment().format('DD.MM.YYYY HH:MM');
  }

   getOrders() {
    this.carOrderService.getOrders()
      .subscribe(
        data => {
          this.orders = data.json()        
        },
        error => console.error(error)
      );
  }




}
