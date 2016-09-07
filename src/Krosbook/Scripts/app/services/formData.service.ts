import {Injectable} from '@angular/core';
import * as moment from 'moment';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class FormDataService { 
  private startTime:any;  
  private endTime: any;
  private carId: number;
  
  constructor() { }  

  public saveData(startTime:any,endTime:any, carId:number){
    this.startTime = startTime;
    this.endTime = endTime;
    this.carId = carId;
  }

  public loadData() {
      return [this.startTime, this.endTime, this.carId];
  }

}
