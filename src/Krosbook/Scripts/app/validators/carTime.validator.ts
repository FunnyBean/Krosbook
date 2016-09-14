import {Directive, forwardRef, OnInit, Attribute} from '@angular/core';
import {NG_VALIDATORS, FormControl, AbstractControl, Validator} from '@angular/forms';
import {HolidayService} from '../services/holiday.service';
import * as moment from 'moment';

@Directive({
  selector: '[validateTime][ngModel],[validateTime][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => TimeValidator), multi: true }
  ]
})

export class TimeValidator{
  validate(c:FormControl){
  //  if(c.value % 30 == 0 && c.value != 0)
      if(c.value % 0.5 == 0  && c.value <= 11 && c.value > 0)
      return null;
    else return {validateTime: true}
  }
}

@Directive({
  selector: '[validateDate][ngModel],[validateDate][formControl]',
  providers: [ HolidayService,
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateValidator), multi: true }
  ]
})

export class DateValidator{
  constructor(private holidayService:HolidayService){ }

  validate(c:FormControl){
    var date = moment(c.value);
    if(date.minute() == 0)
      return null;
    else return {validateDate: true}
  }
}

@Directive({
  selector: '[validateDates][formControlName],[validateDates][formControl],[validateDates][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DatesValidator), multi: true }
  ]
})

export class DatesValidator implements Validator {
  constructor( @Attribute('validateDates') public validateDates: string) {

  }
  validate(c: AbstractControl): { [key: string]: any } {
    // self value
    let v = c.value;

    // control value
    let e = c.root.find(this.validateDates);

    // value not equal
    if (e && v <= e.value) {
      return {
        validateDates: false
      }
    }
    return null;
  }
}

