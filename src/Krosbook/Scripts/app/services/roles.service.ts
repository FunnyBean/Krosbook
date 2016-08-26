import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class RolesService {
  constructor(private http: Http) {
    let _build = (<any>http)._backend._browserXHR.build;
    (<any>http)._backend._browserXHR.build = () => {
      let _xhr = _build();
      _xhr.withCredentials = true;
      return _xhr;
    };
  }

  public getRoles(){
    return this.http.get('http://funnybean.cloudapp.net/api/roles');
  }

  public getRole(id:number){
    return this.http.get('http://funnybean.cloudapp.net/api/roles/'+id);
  }

  public addRole(role:string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://funnybean.cloudapp.net/api/roles',role, {headers});
  }

  public editRole(id:number, role:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put("http://funnybean.cloudapp.net/api/roles/"+id, role, {headers});
  }

  public removeRole(id: string) {
    return this.http.delete('http://funnybean.cloudapp.net/api/roles/'+id);
  }


}



