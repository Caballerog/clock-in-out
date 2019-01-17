import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppSettings } from '../app.settings';

@Component({
  selector: 'user',
  templateUrl: 'user.component.html',
})
export class UserComponent {
  users$: Observable<{ uid: string }[]>;
  userID: string;
  key: string;
  update$ = new BehaviorSubject(true);
  constructor(private http: HttpClient) {
    this.users$ = this.update$.pipe(
      switchMap(() =>
        this.http.get<{ uid: string }[]>(AppSettings.APIENDPOINT_USER),
      ),
      map(users => (users.length === 0 ? null : users)),
    );
  }

  save() {
    const user = {
      uid: this.userID,
      key: this.key,
    };
    this.key = '';
    this.userID = '';

    this.http
      .post(AppSettings.APIENDPOINT_USER, user)
      .subscribe(() => this.update$.next(true));
  }
}
