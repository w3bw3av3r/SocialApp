import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../_models/member';
import { LocalstorageService } from './localstorage.service';

@Injectable({
    providedIn: 'root',
})
export class MembersService {
    private readonly baseUrl = 'https://localhost:5001/api/v1/';
    // private token: string | null = '';
    constructor(private http: HttpClient) {}

    getMembers() {
        return this.http.get<Member[]>(`${this.baseUrl}users`);
    }

    getMember(username: string) {
        return this.http.get<Member>(`${this.baseUrl}users/${username}`);
    }

    // getHttpOptions() {
    //     this._userLocalStorage.getItem('user').subscribe({
    //         next: (user) => {
    //             if (user) {
    //                 const userToken = JSON.parse(user);
    //                 this.token = userToken.token;
    //             }
    //         },
    //     });

    //     return {
    //         headers: new HttpHeaders({
    //             Authorization: `Bearer ${this.token}`,
    //         }),
    //     };
    // }
}
