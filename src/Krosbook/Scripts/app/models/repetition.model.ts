import * as moment from 'moment';

export class Repetition{
  public repeating = "days";
  public interval = 1;
  public end;
  public appearance = 1;
  public date = moment().format("YYYY-MM-DD");
}

