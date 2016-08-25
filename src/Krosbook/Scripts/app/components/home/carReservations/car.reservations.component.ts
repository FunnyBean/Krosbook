/**
 * Created by Ondrej on 25.07.2016.
 */
import {Component, OnInit, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import {ActivatedRoute,ROUTER_DIRECTIVES} from '@angular/router';

declare var $:any;

@Component({
  templateUrl: 'app/components/home/carReservations/car.reservations.component.html',
  directives: [ROUTER_DIRECTIVES],   
  styles: ['.table-arrow {top: 0px;} #filter{background-color: #f2f2f2; padding: 10px}']

})

export class CarsReservationsComponent  {

}

