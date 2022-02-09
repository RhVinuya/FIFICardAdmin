import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule
  ],
  declarations: [UserListComponent, UserComponent, RegisterComponent]
})
export class UsersModule { }
