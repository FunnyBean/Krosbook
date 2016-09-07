import {Component, AfterContentInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {AvatarComponent} from './avatar/avatar.component';
import {PasswordComponent} from './password/password.component';

declare var $:any;

@Component({
  selector: 'profile',
  templateUrl: 'app/components/home/profile/profile.component.html',
  directives: [ROUTER_DIRECTIVES],
  precompile: [AvatarComponent, PasswordComponent]
})

export class ProfileComponent implements AfterContentInit{

  ngAfterContentInit(){
    $("#left_menu a.active").removeClass("active");
    $(".nav a").on("click", function(){
      $("li.active").removeClass("active");
      $(this).parent("li").addClass("active");
    });
  }

}
