import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Member } from '../_models/member';

import { User } from '../_models/user';
import { LocalstorageService } from './localstorage.service';
import { MembersService } from './members.service';

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
        this._userLocalStorage.setItem('user', JSON.stringify(user));
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
                    this.setCurrentUser(user);
                }),
                map((user) => user)
            );
    }

    register(model: any) {
        return this._http
            .post<User>(`${this.baseUrl}account/register`, model)
            .pipe(
                tap((user) => {
                    this.setCurrentUser(user);
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
