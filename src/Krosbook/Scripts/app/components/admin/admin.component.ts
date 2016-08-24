import {Component, OnInit} from  '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {Response} from "@angular/http";

declare var $:any;

@Component({
    selector: 'admin',
    templateUrl: 'app/components/admin/admin.component.html',
    styleUrls: ['app/components/admin/admin.component.css'],
    directives: [ROUTER_DIRECTIVES]
})

export class AdminComponent implements OnInit{
  public contentHeight;

  constructor() {
    this.contentHeight = (window.innerHeight - 78).toString()+'px';
  }

  ngOnInit(){
    window.addEventListener("resize", function(){
      this.contentHeight = (window.innerHeight - 78).toString()+'px';
      document.getElementById("content").style.minHeight = this.contentHeight;
    });
  }

  ngAfterContentInit(){
    $("#leftMenu a:nth-child(1)").addClass("active");
    $("#leftMenu a").on("click", function(){
      $("a.active").removeClass("active");
      $(this).addClass("active");
    });
  }
}
