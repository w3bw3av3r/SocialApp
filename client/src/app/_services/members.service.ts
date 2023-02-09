import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { Member } from '../_models/member';

@Injectable({
    providedIn: 'root',
})
export class MembersService {
    private readonly baseUrl = 'https://localhost:5001/api/v1/';
    members: Member[] = [];

    constructor(private http: HttpClient) {}

    getMembers() {
        if (this.members.length > 0) return of(this.members);
        return this.http.get<Member[]>(`${this.baseUrl}users`).pipe(
            map((members) => {
                this.members = members;
                return members;
            })
        );
    }

    getMember(username: string) {
        const member = this.members.find((m) => m.userName === username);
        if (member) return of(member);
        return this.http.get<Member>(`${this.baseUrl}users/${username}`);
    }

    updateMember(member: Member) {
        return this.http.put(`${this.baseUrl}users`, member).pipe(
            map((_) => {
                const memberIndex = this.members.indexOf(member);
                this.members[memberIndex] = {
                    ...this.members[memberIndex],
                    ...member,
                };
            })
        );
    }

    setMainPhoto(photoId: number) {
        return this.http.put(
            `${this.baseUrl}users/set-main-photo/${photoId}`,
            {}
        );
    }

    deletePhoto(photoId: number) {
        return this.http.delete(`${this.baseUrl}users/delete-photo/${photoId}`);
    }
}
