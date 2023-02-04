import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from '../_models/user';
import { LocalstorageService } from './localstorage.service';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private readonly baseUrl = 'https://localhost:5001/api/v1/';
    private _userSubject$ = new BehaviorSubject<User | null>(null);
    currentUser$ = this._userSubject$.asObservable();
    isLoggedin$ = this.currentUser$.pipe(map((user) => !!user));

    constructor(
        private _http: HttpClient,
        private _userLocalStorage: LocalstorageService
    ) {}

    setCurrentUser(user: User) {
        this._userSubject$.next(user);
    }

    login(model: any) {
        return this._http
            .post<User>(`${this.baseUrl}account/login`, model)
            .pipe(
                tap((user) => {
                    this._userSubject$.next(user);
                    this._userLocalStorage.setItem(
                        'user',
                        JSON.stringify(user)
                    );
                })
            );
    }

    register(model: any) {
        return this._http
            .post<User>(`${this.baseUrl}account/register`, model)
            .pipe(
                tap((user) => {
                    this._userSubject$.next(user);
                    this._userLocalStorage.setItem(
                        'user',
                        JSON.stringify(user)
                    );
                })
            );
    }

    logout() {
        this._userSubject$.next(null);
        this._userLocalStorage.removeItem('user');
    }
}
