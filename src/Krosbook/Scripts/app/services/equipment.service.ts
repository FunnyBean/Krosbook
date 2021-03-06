import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class EquipmentService {
  constructor(private http: Http) {
    let _build = (<any>http)._backend._browserXHR.build;
    (<any>http)._backend._browserXHR.build = () => {
      let _xhr = _build();
      _xhr.withCredentials = true;
      return _xhr;
    };
  }

  public getEquipments(){
      return this.http.get('/api/equipment');
  }

  public getEquipment(id:number){
    return this.http.get('/api/equipment/'+id);
  }

  public addEquipment(equipment:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/equipment',equipment, {headers});
  }

  public editEquipment(id:number, equipment:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put("/api/equipment/"+id, equipment, {headers});
  }

  public removeEquipment(id: string) {
    return this.http.delete('/api/equipment/'+id);
  }


}



