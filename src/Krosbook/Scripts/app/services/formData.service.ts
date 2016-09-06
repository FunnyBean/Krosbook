import {Injectable} from '@angular/core';
import * as moment from 'moment';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class FormDataService { 
  public startTime:any;  
  public endTime:any;
  
  constructor() { }  

  public saveData(startTime:any,endTime:any){
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public loadData(){
    return [this.startTime,this.endTime];
  }

}
