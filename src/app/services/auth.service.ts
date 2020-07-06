import { BingoAPIService } from './bingo-api.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private bingoApi: BingoAPIService) { }

  login(username: string, password: string) {
    return new Observable(observer => {
      this.bingoApi.login(username, password).subscribe(res => {
        localStorage.setItem('token', res['token']);
        observer.next(res);
      }, err => {
        console.log(err)
        observer.error(err);
      });
    })
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
