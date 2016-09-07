import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {TimeValidator, DateValidator, DatesValidator} from '../../../../validators/carTime.validator';
import {ActivatedRoute, Router} from '@angular/router';
import {CarReservation} from '../../../../models/carReservation.model';
import {CarOrderService} from '../../../../services/carReservation.service';
import {CarService} from '../../../../services/car.service';
import {UserService} from '../../../../services/user.service';
import {Car} from '../../../../models/car.model';
import * as moment from 'moment';
import {FormDataService} from '../../../../services/formData.service';

declare var $:any;

@Component({
  selector: 'order',
  templateUrl: 'app/components/home/carReservations/order/order.detail.component.html',              
  styleUrls: ['lib/css/modalWindow.css'],  
  providers:[CarOrderService],
  directives: [DateValidator, DatesValidator],
})

export class OrderDetailComponent implements OnInit {
  public error;
  public success;
  public reservationData:CarReservation = new CarReservation();
  public cars:Array<Car> = new Array<Car>();
  public formReset:boolean = true;  

  private reservationId:number = undefined;
  private isOperator:boolean = false;
  private free:boolean = true;

  constructor(public formDataService:FormDataService, private route:ActivatedRoute, private router:Router, private carOrderService:CarOrderService, private carService:CarService, private userService:UserService) { }

  ngOnInit(){
    var inputData = this.formDataService.loadData();
    if (inputData[0] !== undefined && this.reservationId === undefined){
        this.reservationData.dateTimeStart = inputData[0];
        this.reservationData.dateTimeEnd = inputData[1];
        this.reservationData.carId = inputData[2];
    }
    this.route.params.subscribe(params => {
      this.reservationId = params['id'];
      this.carService.getCars().subscribe(
        data => { 
          this.cars = data.json() 
          if(this.reservationId !== undefined){
            this.getReservationData();
            this.getUserData();
          }
        },
        error => console.log(error)
      );
    });

    $("li.active").removeClass("active");
    $("#liNewReservation").addClass("active"); 
  }

  newOrder(){
    if(this.free){
      this.carOrderService.addOrder(this.reservationData.carId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse,this.reservationData.requirements, this.reservationData.travelInsurance, 1).subscribe(
        data => {
        },
        error => {
          this.error = error;
        },
        () => {
          this.success = 'Objedávka úspešne vytvorená.';
          this.reservationData = new CarReservation();
          this.formReset = false;
          setTimeout(() => this.formReset = true, 0);
        }
      );  
    }
    else return false;
  }

  editOrder()
  {
    if(this.free){
      this.carOrderService.editOrder(this.reservationData.id, this.reservationData.carId, this.reservationData.userId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse,this.reservationData.requirements, this.reservationData.travelInsurance, this.reservationData.reservationState).subscribe(
        data => {
          this.success = "Zmeny boli uložené.";
        }
      )
    } 
    else return false;
  }

  editAndApproveOrder()
  {
    if(this.free){
      this.carOrderService.editOrder(this.reservationData.id, this.reservationData.carId, this.reservationData.userId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse,this.reservationData.requirements, this.reservationData.travelInsurance, this.reservationData.reservationState).subscribe(
        data => {
          this.carOrderService.approveOrder(this.reservationData.id).subscribe(
            data => { this.success = "Zmeny boli uložené."; }
          )
        }
      )
    }
    else return false;
  }

  getReservationData()
  {
    this.carOrderService.getOrder(this.reservationId).subscribe(
      data => { 
        this.reservationData = data.json(); 
        this.isFree(this.reservationData.carId, this.reservationData.dateTimeStart, this.reservationData.dateTimeEnd)
      },
      error => { this.router.navigate(['/home/reservations/cars/myreservations']) }
    )
  }

  getUserData()
  {
    this.userService.myProfile().subscribe(
      data => {
        var user = data.json();
        for(var i = 0; i < user.roles.length; i++)
        {
          if(user.roles[i].roleId == 2)
            this.isOperator = true;
        }
      },
      error =>{console.log(error)}
    )
  }

  isFree(carId:number, from, to)
  {
    if(carId == null)
      return false;
    this.carOrderService.getReservations(carId, moment(from).format("DD.MM.YYYY"), moment(to).add(1, 'days').format("DD.MM.YYYY")).subscribe(
    data => {
      var results = data.json();
      if(results == ""){
        this.error = "";
        this.free = true;
        return true;
      }
      else
      {
        for(var i = 0; i < results.length; i++)
        {
          var result = results[i];
          if(result.id == this.reservationData.id){
            this.error = "";
            this.free = true;
            return true;  
          }
          var reservationTime = moment(from).format("YYYY-MM-DDTHH:mm"), reservationTimeEnd = moment(to).format("YYYY-MM-DDTHH:mm"), time = moment(result.dateTimeStart).format("YYYY-MM-DDTHH:mm"), endTime = moment(result.dateTimeEnd).format("YYYY-MM-DDTHH:mm");
          if ((reservationTime >= time && reservationTime < endTime) || (time >= reservationTime && time < reservationTimeEnd))
          {
            this.error = "Nájdený konflitk - "+result.destination + ": " + moment(result.dateTimeStart).format("DD.MM.YY HH:mm") + " - " + moment(result.dateTimeEnd).format("DD.MM.YY HH:mm");
            this.free = false;
            return false;
          } else {
            this.error = "";
            this.free = true;
          }
        }
      }
    });
  }

  updateEndTime()
  {
    if(this.reservationData.dateTimeEnd <= this.reservationData.dateTimeStart)
      this.reservationData.dateTimeEnd = moment(this.reservationData.dateTimeStart).add(1, 'hour').format("YYYY-MM-DDTHH:mm");
  }
}

