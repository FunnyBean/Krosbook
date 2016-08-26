import {Component, Input, OnInit, ViewChild, Inject} from '@angular/core';
import {ReservationService} from '../../../../../services/reservation.service';
import {HolidayService} from '../../../../../services/holiday.service';
import {DetailReservationComponent} from './detail/detail.reservation.component';
import * as moment from 'moment';

declare var $:any;


@Component({
  selector: 'tbody',
  templateUrl: 'app/components/home/carReservations/reservations/table/table.reservations.component.html',
  directives: [DetailReservationComponent],
  providers: [ReservationService, HolidayService]
})

export class TableReservationComponent implements OnInit {
  @Input() data;
  @Input() times;
  @Input() reservationType;
  @Input() usersList;
  @Input() loggedUser;
  @Input() week; 
  @Input() filterActive;
  @Input() filterDateTime;
  @Input() filterTimeLength;
  
  public tableData = [];
  public reservationsData;
  public detailReset:boolean = false;
  public reservationDetailId:Array<any> = [0, 0, 0, 0];

  private reservationInProgress:boolean = false;

  constructor(private reservationService:ReservationService, private holidayService:HolidayService) { }

  ngOnInit() {  
    this.updateData();
    this.data.color = (this.data.color === undefined) ? '#337ab7' : this.data.color;
    var thisDocument = this;
    $(window).on("focus", function(){
      thisDocument.updateData();
    });
  }

  ngOnDestroy(){
    $(window).unbind("focus");
  }

  fillTable() {
    var table = '<tr><td colspan="6" class="officeName" style="background-color: '+this.data.color+'"><h4>'+this.data.name+'</h4></td></tr>', fromRow, fromCol, length = 1, isMouseDown = false, thisDocument = this, col, row, beforeRow = 0;
    for (var i = 0; i < this.times.length; i++) {
      table += '<tr>';
      table += '<td class="col-md-1">' + this.times[i].time + '</td>';
      for (var j = 0; j < this.tableData[this.times[i].time].length; j++) {
        let cell = this.tableData[this.times[i].time][j];
        let holiday:string = this.holidayService.isHoliday(moment().add(this.week, 'weeks').weekday(j + 1).format("DD/MM"), moment().add(this.week, 'weeks').format("YYYY"));
        if (cell.long == null) {
          var filter:string = '';
          if(this.filterActive && moment(this.filterDateTime).format("DD.MM.YYYY") == moment().add(this.week, 'weeks').weekday(j + 1).format("DD.MM.YYYY") && moment(this.filterDateTime).format("HH:mm") <= this.times[i].time && this.times[i].time < moment(this.filterDateTime).add(this.filterTimeLength*60, 'minutes').format("HH:mm"))
            filter = 'filterSelected';
          if(holiday){
            if(i == 0)
              table += '<td class="col-md-2 holiday">'+holiday+'</td>';
            else table += '<td class="col-md-2 holiday"></td>';
          }
          else table += '<td class="col-md-2 empty '+filter+'"></td>';
        } else {
          if (cell.reservationName == null) {
            table += '<td reservationId="'+ cell.reservationId +'" class="col-md-2 bg-primary full"></td>';
          } else {
            table += '<td reservationId="'+ cell.reservationId +'" class="col-md-2 bg-primary full text-center"><strong>' + cell.reservationName + '</strong> <small>' + cell.userName + '</small></td>';
          }
        }
      }
      table += '</tr>';
    }

    //replacing old data with new table data
    $(".records"+this.data.id+" > tr").remove();
    $(".records"+this.data.id).prepend(table);

    /*$(".records"+this.data.id+" td.full").on("click", function(event){
      setTimeout(() => thisDocument.detailReset = true, 0);
      var element = $(this);
      var id =  element.attr("reservationId");
      if(thisDocument.reservationDetailId[0] == 0 || thisDocument.reservationDetailId[0] != id){
        thisDocument.detailReset = false;
        var horizontalPosition = (element.index() !== 5) ? (element.position().left).toString() + 'px' : (element.position().left  + element.width() - 294).toString() + 'px';
        thisDocument.reservationDetailId = [id, horizontalPosition, (element.position().top + $("#content").scrollTop() + 25).toString() + 'px', 1];
      }
      else {
        thisDocument.detailReset = false;
        thisDocument.reservationDetailId = [0, 0, 0, 0];
      }
    });

    $(".records"+this.data.id+" td.empty").on("mouseenter", function (event) {
      col = $(this).parent().children().index($(this));
      row = $(this).parent().parent().children().index($(this).parent()) - 1;
    });

    $(".records"+this.data.id+" td.empty")
      .on("mousedown", function (event) {
        if (event.which != 1 || thisDocument.reservationDetailId[0] != 0 || thisDocument.reservationInProgress) return false; //does not work for other than left button
        var element = $(this);
        isMouseDown = true;
        $(this).addClass("selected");
        fromRow = row;
        fromCol = col;
        beforeRow = row;    
        var horizontalPosition = (element.index() !== 5) ? (element.position().left).toString() + 'px' : (element.position().left  + element.width() - 294).toString() + 'px';
        thisDocument.reservationDetailId = [0, horizontalPosition, (element.position().top + $("#content").scrollTop() + 25).toString() + 'px'];          
        return false;
      })
      .on("mouseover", function () {
        if (isMouseDown && col == fromCol && (row - 1) == beforeRow && !($(this).hasClass("selected"))){
          $(this).addClass("selected");
          beforeRow = row;
          length++;
        }
      });

    $(document).on("mouseup", function () {
      if(isMouseDown) {                 
        thisDocument.makeReservation(fromRow, fromCol, length);         
        isMouseDown = false;
        length = 1;
      }
    });*/
  }

  /*makeReservation(fromRow:number, fromCol:number, length:number) {
    this.reservationInProgress = true;
    var date, hours = 7, minutes = 0;
    if(fromRow % 2 != 0){
      fromRow -= 1;
      minutes = 30;
    }
    for(var i = 0; i < fromRow / 2; i++)
      hours++;
    date = moment().add(this.week, 'weeks').weekday(fromCol).hour(hours).minute(minutes).format("DD.MM.YYYY HH:mm");
    //checks, if selected time is not already reserved
    var time = moment().hour(hours).minute(minutes).format("HH:mm"), endTime = moment(time, 'HH:mm').add(length*30, 'minutes').format("HH:mm");
    while (time < endTime) {
      if(this.tableData[time] && this.tableData[time][fromCol - 1]){
        alert('Vaša rezervácia zasahuje do inej rezervácie. Zvoľte svoju rezerváciu inak.');
        this.fillTable();
        return false;
      }
      time = moment(time, 'HH:mm').add(30, 'minutes').format('HH:mm');
    }
    //checks if selected reservation is not in the past
    /*if(date < moment().format("DD.MM.YYYY HH:mm")){
      alert('Zvolená rezervácia je v minulosti. Nie je možné ju vytroviť.');
      this.fillTable();
      return false;
    }*/
    //saves the data  
    /*this.reservationService.addReservation(this.reservationType, this.data.id, 1, 'Rezervácia', date, length*30).subscribe(
      data => {   
        this.detailReset = true;            
        this.reservationDetailId = [data.json().id, this.reservationDetailId[1],this.reservationDetailId[2], 0];  //okno na potvrdenie rezervacie      
      },
      error => { alert(error); },
      () => { 
        this.updateData(); 
        this.reservationInProgress = false;
        $(".filterSelected").removeClass("filterSelected");
      }
    );
  }*/

  updateData(weeks = this.week) {
    this.reservationService.getReservations(this.reservationType, this.data.id, moment().add(weeks, 'weeks').weekday(1).format("DD.MM.YYYY"), moment().add(weeks, 'weeks').weekday(6).format("DD.MM.YYYY")).subscribe(
      data => {
        this.reservationsData = data.json();
      },
      error => console.log(error),
      () => {
        //setting default data to 0
        for (var i = 0; i < this.times.length; i++) {
          var pTime:any = this.times[i].time;
          this.tableData[pTime] = new Array();
          for (var j = 0; j < 5; j++)
            this.tableData[pTime][j] = 0;
        }
        //for each record, set table data
        for (var i = 0; i < this.reservationsData.length; i++) {
          var record = this.reservationsData[i];
          var startDay = moment(record.dateTimeStart, "YYYY-MM-DDTHH:mm:ss"), endDay = moment(record.dateTimeEnd, "YYYY-MM-DDTHH:mm:ss"), currentDay = moment(record.dateTimeStart, "YYYY-MM-DDTHH:mm:ss"), time = startDay.format("HH:mm"), endTime = endDay.format('HH:mm');
          if(startDay.format("YYYY-MM-DD") == endDay.format("YYYY-MM-DD"))
          {
            var day = startDay.weekday() - 1;
            while (time < endTime && time <= '17:30') {
              if (time == startDay.format("HH:mm"))
                this.tableData[time][day] = JSON.parse('{"userName": "' + this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "'+record.id+'"}');
              else this.tableData[time][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "'+record.id+'"}');
              time = moment(time, 'HH:mm').add(30, 'minutes').format('HH:mm');
            }
          }
          else
          {
            while(currentDay.format("YYYY-MM-DD") <= endDay.format("YYYY-MM-DD"))
            {
              var day = currentDay.weekday() - 1;
              if(day == 5 || day == -1 || currentDay.format("YYYY-MM-DD") < moment().add(weeks, 'weeks').weekday(1).format("YYYY-MM-DD") || currentDay.format("YYYY-MM-DD") > moment().add(weeks, 'weeks').weekday(5).format("YYYY-MM-DD")){
                currentDay.add(1, 'days');
                continue;
              }
              
              if(startDay.format("YYYY-MM-DD") == currentDay.format("YYYY-MM-DD"))
              {
                while (time <= '17:30') {
                  if (time == moment(record.dateTimeStart, "YYYY-MM-DD HH:mm:ss").format("HH:mm"))
                    this.tableData[time][day] = JSON.parse('{"userName": "' + this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "'+record.id+'"}');
                  else this.tableData[time][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "'+record.id+'"}');
                  time = moment(time, 'HH:mm').add(30, 'minutes').format('HH:mm');
                }
              }
              else if(endDay.format("YYYY-MM-DD") == currentDay.format("YYYY-MM-DD"))
              {
                var tempTime = moment('07:00', 'HH:mm').format("HH:mm");
                while (tempTime <= endTime) {
                  if (tempTime == "07:00")
                    this.tableData[tempTime][day] = JSON.parse('{"userName": "' + this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "'+record.id+'"}');
                  else this.tableData[tempTime][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "'+record.id+'"}');
                  tempTime = moment(tempTime, 'HH:mm').add(30, 'minutes').format('HH:mm');
                }
              }
              else {
                var tempTime = moment('07:00', 'HH:mm').format("HH:mm");
                while (tempTime <= '17:30') {
                  if (tempTime == "07:00")
                    this.tableData[tempTime][day] = JSON.parse('{"userName": "' + this.usersList[record.userId] + '", "long": 0, "reservationName":"' + record.destination + '", "reservationId": "'+record.id+'"}');
                  else this.tableData[tempTime][day] = JSON.parse('{"userName": "", "long": 1, "reservationId": "'+record.id+'"}');
                  tempTime = moment(tempTime, 'HH:mm').add(30, 'minutes').format('HH:mm');
                }
              }
              currentDay.add(1, 'days');
            }
          }
        }
        this.fillTable();
      }
    );
  }

}