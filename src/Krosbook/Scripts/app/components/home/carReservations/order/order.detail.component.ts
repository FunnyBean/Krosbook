import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {TimeValidator, DateValidator} from '../../../../validators/time.validator';
import {ActivatedRoute} from '@angular/router';
import {CarReservation} from '../../../../models/carReservation.model';
import {CarOrderService} from '../../../../services/carReservation.service';
import {CarService} from '../../../../services/car.service';
import {Car} from '../../../../models/car.model';
import * as moment from 'moment';


@Component({
  selector: 'order',
  templateUrl: 'app/components/home/carReservations/order/order.detail.component.html',              
  styleUrls: ['lib/css/modalWindow.css'],  
  providers:[CarOrderService]
})

export class OrderDetailComponent implements OnInit {
  public error;
  public success;
  public reservationData:CarReservation = new CarReservation();
  public cars:Array<Car> = new Array<Car>();
  public formReset:boolean = true;  

  private reservationId:number = undefined;
 
  constructor(private route:ActivatedRoute, private carOrderService:CarOrderService, private carService:CarService) { }

   ngOnInit(){
      this.route.params.subscribe(params => {
        this.reservationId = params['id'];
        this.carService.getCars().subscribe(
          data => { 
            this.cars = data.json() 
            if(this.reservationId !== undefined)
              this.getReservationData();
          },
          error => console.log(error)
        );
      });
   }

  newOrder(){
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

  editOrder()
  {
    this.carOrderService.editOrder(this.reservationData.id, this.reservationData.carId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse,this.reservationData.requirements, this.reservationData.travelInsurance, this.reservationData.reservationState).subscribe(
      data => {
        this.success = "Zmeny boli uložené.";
      }
    )
  }

  editAndApproveOrder()
  {
    this.carOrderService.editOrder(this.reservationData.id, this.reservationData.carId, moment(this.reservationData.dateTimeStart).format("DD.MM.YYYY HH:mm"), moment(this.reservationData.dateTimeEnd).format("DD.MM.YYYY HH:mm"), this.reservationData.destination, this.reservationData.gpsSystem, this.reservationData.privateUse,this.reservationData.requirements, this.reservationData.travelInsurance, this.reservationData.reservationState).subscribe(
      data => {
        this.carOrderService.approveOrder(this.reservationData.id).subscribe(
          data => { this.success = "Zmeny boli uložené."; }
        )
      }
    )
  }

  getReservationData()
  {
    this.carOrderService.getOrder(this.reservationId).subscribe(
      data => { this.reservationData = data.json(); },
      error => console.log(error)
    )
  }
}

