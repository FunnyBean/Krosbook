import * as moment from 'moment';

export class Repetition{
  public repetation = "days";
  public interval = 1;
  public end;
  public appearance = 1;
  public endDate = moment().format("YYYY-MM-DD");
}

