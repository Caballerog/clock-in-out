import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, interval } from 'rxjs';
import { switchMap, map, retryWhen } from 'rxjs/operators';
import * as moment from 'moment';
import { AppSettings } from 'src/app/app.settings';

@Component({
  selector: 'ticketing',
  templateUrl: './ticketing.component.html',
  styleUrls: ['./ticketing.component.scss'],
})
export class TicketingComponent {
  public usersAbsent$: Observable<any>;
  public usersPresent$: Observable<any>;
  public timestamp$: Observable<any>;
  displayedColumns: string[] = ['name', 'room'];

  constructor(public httpClient: HttpClient) {
    const interval$ = timer(0, 3000);
    const data$ = interval$.pipe(
      switchMap(() =>
        this.httpClient.get<{ users: any[]; timestamp: number }>(
          AppSettings.APIENDPOINT_USERS,
        ),
      ),
      retryWhen(() => interval(3000)),
    );
    const users$ = data$.pipe(map(({ users }) => users));
    this.timestamp$ = data$.pipe(
      map(({ timestamp }) =>
        moment.unix(timestamp).format(AppSettings.DATE_FORMAT),
      ),
    );
    this.usersPresent$ = users$.pipe(
      map(users => users.filter(this.isPresent)),
    );
    this.usersAbsent$ = users$.pipe(map(users => users.filter(this.isAbsent)));
  }

  public middle(users: any[], number: number): any[] {
    if (!users) {
      return [];
    }
    const mid = Math.ceil(users.length / 2);
    return number === 1 ? users.slice(0, mid) : users.slice(mid);
  }
  private isPresent(user: any): boolean {
    return (
      user.auths.length > 0 &&
      user.auths[0].reader === AppSettings.TYPE_ACTION.INPUT
    );
  }
  private isAbsent(user: any): boolean {
    return (
      user.auths.length === 0 ||
      (user.auths.length > 0 &&
        user.auths[0].reader === AppSettings.TYPE_ACTION.OUTPUT)
    );
  }
}
