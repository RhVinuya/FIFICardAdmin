import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  id?: string;

  service: UsersService;
  activateRoute: ActivatedRoute;
  fb: FormBuilder;
  snackBar: MatSnackBar;
  router: Router;

  userForm: FormGroup;
  isSaving: boolean;

  constructor(private _service: UsersService,
    private _activateRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private titleService: Title) { 
      this.service = _service;
      this.activateRoute = _activateRoute;
      this.fb = _fb;
      this.snackBar = _snackBar;
      this.router = _router;
    }

  ngOnInit() {
    this.titleService.setTitle('Fibei Greetings - User');

    this.userForm = this.fb.group({
      id: [''],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email]],
      active: [Boolean(false)],
    });

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id){
        this.service.getUser(this.id).then(data => {
          this.userForm.reset(
            {
              id: data.id,
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              active: data.active,
            }
          );
        }).catch(reason =>{
          this.router.navigate(['/cards']).then(navigated => {
            if(navigated) {
              this.snackBar.open("User not found", "", {
                duration: 3000
              });
            }
          });
        })

      }
    });
  }

  saveUser(){
    if (!this.isSaving){
      if (this.userForm.valid){
        this.isSaving = true;
        let user: User = this.userForm.value as User;
        if (user.id){
          this.service.updateUser(user).then(()=>{
            this.isSaving = false;
            this.snackBar.open("User Updated", "", { duration: 3000 });
          });
        }
      }
    }
  }

}
