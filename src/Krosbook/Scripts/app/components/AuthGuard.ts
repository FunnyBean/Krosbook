/**
 * Created by Tibor Poštek on 14.07.2016.
 */
import {UserService} from '../services/user.service';
import {Router, CanActivate} from '@angular/router';
import {Injectable} from "@angular/core";
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public userService:UserService, public router:Router) { }

  canActivate() {
    return Observable.create(observer => {
      this.userService.isLoggedIn().subscribe(
        data => { 
            observer.next(true);
            observer.complete();
        },
        error => { 
          observer.next(false);
          observer.complete();
          this.router.navigate(['/login']);
        }
      )
    });
  }
  
}
