import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Route } from '@angular/router';
import {
  MatTableModule,
  MatInputModule,
} from '@angular/material';
import { AppComponent } from './app.component';
import { TicketingComponent } from './ticketing/ticketing.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './user/user.component';

const routes: Route[] = [
  {
    path: '',
    component: TicketingComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
];

@NgModule({
  declarations: [AppComponent, UserComponent, TicketingComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatInputModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
