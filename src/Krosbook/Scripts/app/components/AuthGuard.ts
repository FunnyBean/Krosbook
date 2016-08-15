/**
 * Created by Tibor Poštek on 14.07.2016.
 */
import {UserService} from '../services/user.service';
import {Router, CanActivate} from '@angular/router';
import {Injectable} from "@angular/core";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public authService:UserService, public router:Router) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
