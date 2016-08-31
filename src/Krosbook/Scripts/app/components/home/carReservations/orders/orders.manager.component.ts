import {Component, OnInit} from  '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {CarReservation} from '../../../../models/carReservation.model';
import {CarOrderService} from '../../../../services/carReservation.service';
import {CarService} from '../../../../services/car.service';
import {UserService} from '../../../../services/user.service';

import {Car} from '../../../../models/car.model';
import {User} from '../../../../models/user.admin.model';

import * as moment from 'moment';
import {Observable} from 'rxjs/observable';
declare var $:any;

@Component({
  templateUrl: 'app/components/home/carReservations/orders/orders.manager.component.html',
  providers:[CarOrderService],
  styles: [' #filter{background-color: #f2f2f2; padding: 10px}']


})

export class OrdersManagerComponent {
  public stableOrders:Array<CarReservation>;

  public orders:Array<CarReservation>;
  public orderId:number;
  public isShowedFilterInput:boolean=false;

  private cars:Array<string> = new Array<string>();
  private users:Array<string> = new Array<string>();

  private carsData:Array<Car>;
  private usersData:Array<User>;
 
  public states = ['Nespracovaná', 'Schválená', 'Žiada o vymazanie'];
  public isEmpty:boolean;
  
  constructor(private router:Router,private carOrderService:CarOrderService, private carService:CarService, private userService:UserService) {
    this.carService.getCars().subscribe(
        data => {
            var cars = data.json();
            this.carsData= data.json();
            
            for(var i = 0; i < cars.length; i++)
                this.cars[cars[i].id] = cars[i].name + " : " + cars[i].plate;
                
        },
        error => console.log(error),
        () => { this.getUsers() }
    )    
  }

 
  filterReservation() {
   
    var choosenCar = $("#filterCar").val();
    var choosenUser = $("#filterUser").val();
    var resevartionState = $("#approvedOrders").is(":checked") ? 2 : 1;//2=Nespracovaná;1=Spracovana
    var filtered: Array<CarReservation> = new Array<CarReservation>();

    //console.log(typeof choosenCar +' '+choosenCar);
    //console.log(typeof choosenUser+' '+choosenUser);

    if (choosenCar == 'all') {    
      for (let order of this.stableOrders) {
        if (order.userId == choosenUser && (order.reservationState == resevartionState)) {
          filtered.push(order);        
        }
      }
    }
      if (choosenUser == 'all') {
        for (let order of this.stableOrders) {
          if (order.carId == choosenCar && (order.reservationState == resevartionState)) {
            filtered.push(order);          
          }
        }
      }
      if (choosenUser == 'all' && choosenCar == 'all') {
        for (let order of this.stableOrders) {
          if ((order.reservationState == resevartionState)) {
            filtered.push(order);           
          }
        }
      }
    
    for (let order of this.stableOrders) {
      if (order.carId == choosenCar && order.userId == choosenUser && (order.reservationState == resevartionState)) {
        filtered.push(order);       
      }
    }
    this.orders = filtered;
    
    this.isEmpty=(filtered.length>0)?false:true;
      
  }



  ngOnInit(){ 
    $("li.active").removeClass("active");;
    $("#liOrders").addClass("active");
  }

  getUsers(){
    this.userService.getUsers().subscribe(
      data => {
        var usersArray = data.json();
        this.usersData= data.json();
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
    if(confirm("Naozaj chcete vymazať rezerváciu?")) {
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

  approveOrder(carId:number, id:number, from:any, to:any){
    this.isFree(carId, id, from, to).subscribe(result => {
      if(result){
        if(confirm("Schvaľujete túto rezerváciu?")) {
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
      else return false;
    });
  }

  showFilterInput() {    
    this.isShowedFilterInput = !this.isShowedFilterInput;
         
     if(this.isShowedFilterInput){
        document.getElementById("filterButton").innerHTML = "<span class='glyphicon glyphicon-filter'></span> Skryť filter";
     }
     else{
       document.getElementById("filterButton").innerHTML = "<span class='glyphicon glyphicon-filter'></span> Zobraziť filter";
       this.orders = this.stableOrders;
     }     
  }

  formatDateTime(dateTime:any){
    return moment(dateTime).format('DD.MM.YYYY HH:mm');
  }

  getOrders() {
    this.carOrderService.getOrders()
      .subscribe(
        data => {
          this.orders = data.json();
          this.stableOrders = data.json();
              
        },
        error => console.error(error)
      );
  }

  isFree(carId:number, reservationId:number, from, to)
  {
    return new Observable(observer => {
      this.carOrderService.getReservations(carId, moment(from).format("DD.MM.YYYY"), moment(to).add(1, 'days').format("DD.MM.YYYY")).subscribe(
      data => {
        var results = data.json();
        if(results == ""){
          observer.next(true);
          observer.complete();
        }
        else
        {
          for(var i = 0; i < results.length; i++)
          {
            var result = results[i];
            if(result.id == reservationId){
              observer.next(true);
              observer.complete();
            }
            var reservationTime = moment(from).format("HH:mm"), reservationTimeEnd = moment(to).format("HH:mm"), time = moment(result.dateTimeStart).format("HH:mm"), endTime = moment(result.dateTimeEnd).format("HH:mm");
            if ((reservationTime >= time && reservationTime < endTime) || (time >= reservationTime && time < reservationTimeEnd))
            {
              alert("Nájdený konflitk - "+result.destination + ": " + moment(result.dateTimeStart).format("DD.MM.YY HH:mm") + " - " + moment(result.dateTimeEnd).format("DD.MM.YY HH:mm"));
              observer.next(false);
              observer.complete();
            } else {
              observer.next(true);
              observer.complete();
            }
          }
        }
      });
    });
  }


}
