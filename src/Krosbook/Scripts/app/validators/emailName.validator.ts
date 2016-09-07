import {Directive, forwardRef, OnInit} from '@angular/core';
import {NG_VALIDATORS, FormControl} from '@angular/forms';
import {UserService} from '../services/user.service';

@Directive({
  selector: '[validateEmailName][ngModel],[validateEmailName][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailNameValidator), multi: true }, UserService
  ]
})

export class EmailNameValidator{

  private users;
  private initialCValue = null;

  constructor(private userService:UserService) {
    this.userService.getUsers().subscribe(
      data => {this.users = data.json()},
      error => console.log(error)
    );
  }

  validate(c:FormControl){
    
   
    if(this.users)
    {
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].email == c.value)
          return {validateEmailName: true}
      }
    }
    return null;
  }

}
