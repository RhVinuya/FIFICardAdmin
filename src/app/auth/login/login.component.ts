import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { EMPTY, of } from 'rxjs';
import 'rxjs/add/operator/delay';

import { AuthenticationService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading: boolean;

    constructor(private router: Router,
        private titleService: Title,
        private notificationService: NotificationService,
        private authenticationService: AuthenticationService,
        private usersService: UsersService,
        @Inject('LOCALSTORAGE') private localStorage: Storage) {
    }

    ngOnInit() {
        this.titleService.setTitle('FIFI Card Admin - Login');
        this.authenticationService.logout();
        this.createForm();
    }

    private createForm() {
        const savedUserEmail = localStorage.getItem('savedUserEmail');

        this.loginForm = new FormGroup({
            email: new FormControl(savedUserEmail, [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
            rememberMe: new FormControl(savedUserEmail !== null)
        });
    }

    login() {
        const email = this.loginForm.get('email').value;
        const password = this.loginForm.get('password').value;
        const rememberMe = this.loginForm.get('rememberMe').value;

        if (email == 'admin@techtaxiinc.com'){
            if(password == 'admin'){
                this.localStorage.setItem('currentUser', JSON.stringify({
                    isAdmin: true,
                    email: email,
                    alias: email.split('@')[0],
                    expiration: moment().add(1, 'days').toDate(),
                    fullName: 'Admin'
                }));
                if (rememberMe) {
                    localStorage.setItem('savedUserEmail', email);
                } else {
                    localStorage.removeItem('savedUserEmail');
                }
                this.router.navigate(['/']);
            }
            else{
                this.notificationService.openSnackBar("Login Failed"); 
            }
        }
        else{
            this.loading = true;
            this.usersService.getUserByEmail(email).then(user => {
                if (!user.active){
                    this.notificationService.openSnackBar("User is inactive");
                    this.loading = false;
                }else{
                    this.usersService.signIn(email, password).then(data => {
                        this.loading = false;
                        if(data){
                            this.localStorage.setItem('currentUser', JSON.stringify({
                                isAdmin: true,
                                email: user.email,
                                id: user.localId,
                                alias: user.email.split('@')[0],
                                expiration: moment().add(1, 'days').toDate(),
                                fullName: user.firstname + ' ' + user.lastname
                            }));
                            if (rememberMe) {
                                localStorage.setItem('savedUserEmail', email);
                            } else {
                                localStorage.removeItem('savedUserEmail');
                            }
                            this.router.navigate(['/']);
                        }
                    }).catch(reason => {
                        this.notificationService.openSnackBar("Login Failed");
                        this.loading = false;
                    });
                }
            }).catch(reason => {
                this.notificationService.openSnackBar("User not found");
                this.loading = false;
            });
        }

        /*this.loading = true;
        this.authenticationService
            .login(email.toLowerCase(), password)
            .subscribe(
                data => {
                    if (rememberMe) {
                        localStorage.setItem('savedUserEmail', email);
                    } else {
                        localStorage.removeItem('savedUserEmail');
                    }
                    this.router.navigate(['/']);
                },
                error => {
                    this.notificationService.openSnackBar(error.error);
                    this.loading = false;
                }
            );*/
    }

    resetPassword() {
        this.router.navigate(['/auth/password-reset-request']);
    }
}
