import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
        private _userLocalStorage: LocalstorageService,
        private router: Router
    ) {}

    setCurrentUser(user: User) {
        this._userSubject$.next(user);
    }

    public get currentUserValue() {
        return this._userSubject$.getValue();
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
        this._userLocalStorage
            .removeItem('user')
            .pipe(
                tap((isRemoved) => {
                    if (isRemoved) {
                        this._userSubject$.next(null);
                        this.router.navigateByUrl('/');
                    }
                })
            )
            .subscribe();
    }
}
