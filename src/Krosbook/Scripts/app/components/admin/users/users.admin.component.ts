import {Component, OnInit} from  '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {DetailUserAdminComponent} from './detail/detail.user.admin.component';
import {User} from '../../../models/user.admin.model';


@Component({
  templateUrl: 'app/components/admin/users/users.admin.component.html',
  directives: [DetailUserAdminComponent]
})

export class UsersAdminComponent implements OnInit {
  public users:Array<User>;
  public userId: number;
  public alphabet: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  private slovakAlphabet: Array<string> = ['Á', 'Č', 'Ď', 'É', 'Í', 'Ĺ', 'Ľ', 'Ň', 'Ó', 'Š', 'Ť', 'Ú', 'Ž'];
  private englishAlphabet: Array<string> = ['A', 'C', 'D', 'E', 'I', 'L', 'L', 'N', 'O', 'S', 'T', 'U', 'Z'];
  private filterChar: string = '';
  private showOfficeWindow: boolean = false;
  private allUsers: Array<User>;
  
  constructor(private router: Router, private userService: UserService) {
      this.GetUsers();
  }

  ngOnInit() {
    this.GetUsers();
  }

  GetUsers() {
    this.userService.getUsers()
      .subscribe(
        data => {
            this.allUsers = data.json();
            if (this.filterChar == '')
                this.users = this.allUsers;
            else this.filter();
        },
        error => console.error(error)
      );
  }

  filter(char = this.filterChar) {
      this.filterChar = char;
      this.users = [];
      for (var i = 0; i < this.allUsers.length; i++)
      {
          if (this.allUsers[i].surname[0] == char) {
              this.users.push(this.allUsers[i]);
          }
      }
      var enAIndex = this.englishAlphabet.indexOf(char);
      if (enAIndex != -1 && this.slovakAlphabet[enAIndex]) {
          var newChar = this.slovakAlphabet[enAIndex];
          for (var i = 0; i < this.allUsers.length; i++) {
              if (this.allUsers[i].surname[0] == newChar) {
                  this.users.push(this.allUsers[i]);
              }
          }
      }
  }

  removeFilter() {
      this.filterChar = '';
      this.users = this.allUsers;
  }

  newUser(){
    this.userId = null;
    this.windowOpen();
  }

  editUser(id:number){
    for(var i = 0; i < this.users.length; i++){
      if(this.users[i].id == id){
        this.userId = this.users[i].id;
        break;
      }
    }
    this.windowOpen();
    window.scrollTo(0,0);  /*scroll top*/
  }

  removeUser(id:string) {
    if(confirm("Naozaj chcete vymazať používateľa?")) {
      this.userService.removeUser(id).subscribe(
        data => {
        },
        error => {
          alert(error)
        },
        () => {
          this.GetUsers();
        }
      )
    }
  }

  sendInvitation(id: number) {
      this.userService.sendInvitation(id).subscribe(
          data => {
              this.GetUsers();
          },
          error => { console.log(error) }
      );
  }

  //opens detail.office.admin.component window
  windowOpen(){
    this.showOfficeWindow = true;
  }

  //closes detail.office.admin.component window
  windowClose(action: boolean){
    this.showOfficeWindow = action;
  }


}
