import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Car} from '../../../../models/car.model';
import {CarService} from '../../../../services/car.service';
import {PlateUniquenessValidator, PlateValidator} from '../../../../validators/plate.validator';

@Component({
  selector: "car",
  templateUrl: 'app/components/admin/cars/detail/detail.car.admin.component.html',
  styleUrls: ['lib/css/modalWindow.css'],
  directives: [PlateUniquenessValidator, PlateValidator]
})

export class DetailCarAdminComponent {
  public error;
  public success;
  public saving:boolean = false;
  public formReset:boolean = true;
  public carData:Car = new Car();

  @Input() carId:number;
  @Output() windowClose = new EventEmitter<boolean>();
  @Output() updateList = new EventEmitter<boolean>();

  constructor(private carService:CarService) { }

  ngOnInit() {
    if(this.carId)
      this.getData();
  }

  getData(){
    this.carService.getCar(this.carId).subscribe(
      data => {this.carData = data.json()},
      error => console.error(error)
    );
  }

  newCar(){
    this.saving = true;
    let plate = this.carData.plate.toUpperCase();
    let name = this.carData.name;
    let color = this.carData.color;
    this.carService.addCar(JSON.stringify({plate, name, color})).subscribe(
      data => {
      },
      error => {
        this.error = error;
        this.saving = false;
      },
      () => {
        this.saving = false;
        this.success = 'Vozidlo úspešne vytvorené.';
        this.carData = new Car();
        this.formReset = false;
        setTimeout(() => this.formReset = true, 0);
        this.updateList.emit(true);
      }
    );
  }

  editCar(){
    this.saving = true;
    let id = this.carData.id
    let plate = this.carData.plate.toUpperCase();
    let name = this.carData.name;
    let color = this.carData.color;
    this.carService.editCar(id, JSON.stringify({id, name, plate, color})).subscribe(
      data => {
      },
      error => {
        this.error = error;
        this.saving = false;
      },
      () => {
        this.saving = false;
        this.success = 'Vozidlo úspešne upravené.';
        this.updateList.emit(true);
      }
    );
  }

  closeWindow(){
    this.windowClose.emit(false);
  }
}

