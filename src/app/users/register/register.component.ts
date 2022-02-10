import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Register } from 'src/app/models/register';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  service: UsersService;
  fb: FormBuilder;
  snackBar: MatSnackBar;
  router: Router;

  userForm: FormGroup;
  isSaving: boolean;

  constructor(private _service: UsersService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private logger: NGXLogger,
    private titleService: Title) { 
      this.service = _service;
      this.fb = _fb;
      this.snackBar = _snackBar;
      this.router = _router;
    }

  ngOnInit() {
    this.titleService.setTitle('Fifi Greetings - Register');
    
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]]
    });
  }

  saveUser(){
    if (!this.isSaving){
      if (this.userForm.valid){
        this.isSaving = true;
        let register: Register = this.userForm.value as Register;
        this.service.registerUser(register.email, register.password).then(uid => {
          this.logger.log('Register User: ' + uid);
          let user: User = new User();
          user.localId = uid;
          user.firstname = register.firstname;
          user.lastname = register.lastname;
          user.email = register.email;
          this.service.addUser(user).then(id => {
            this.logger.log('Created User: ' + id);
            this.isSaving = false;
            this.router.navigate(['/users']).then(navigated => {
              if(navigated) {
                this.snackBar.open("User Registered", "", { duration: 3000 });
              }
            });
          }).catch(reason => {
            this.isSaving = false;
            this.logger.error(reason);
          })
        }).catch(reason => {
          this.isSaving = false;
          this.logger.error(reason);
        })
      }
    }
  }

}
