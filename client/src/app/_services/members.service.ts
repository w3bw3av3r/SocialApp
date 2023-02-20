import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, of, take } from 'rxjs';

import { AccountService } from './account.service';
import { Member } from '../_models/member';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { getPaginatedResults, getPaginationHeaders } from './paginationHelper';

@Injectable({
    providedIn: 'root',
})
export class MembersService {
    private readonly baseUrl = 'https://localhost:5001/api/v1/';
    members: Member[] = [];
    memberCache = new Map();
    user: User | undefined;
    userParams: UserParams | undefined;

    constructor(
        private http: HttpClient,
        private accountService: AccountService
    ) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
            next: (user) => {
                if (user) {
                    this.userParams = new UserParams(user);
                    this.user = user;
                }
            },
        });
    }

    getUserParams() {
        return this.userParams;
    }

    setUserParams(params: UserParams) {
        this.userParams = params;
    }

    resetUserParams() {
        if (this.user) {
            this.userParams = new UserParams(this.user);
            return this.userParams;
        }

        return;
    }

    getMembers(userParams: UserParams) {
        const response = this.memberCache.get(
            Object.values(userParams).join('-')
        );

        if (response) return of(response);

        let params = getPaginationHeaders(userParams);

        params = params.append('minAge', userParams.minAge);
        params = params.append('maxAge', userParams.maxAge);
        params = params.append('gender', userParams.gender);
        params = params.append('orderBy', userParams.orderBy);

        return getPaginatedResults<Member[]>(
            `${this.baseUrl}users`,
            params,
            this.http
        ).pipe(
            map((response) => {
                this.memberCache.set(
                    Object.values(userParams).join('-'),
                    response
                );

                return response;
            })
        );
    }

    getMember(username: string) {
        const member = [...this.memberCache.values()]
            .reduce((arr, elem) => arr.concat(elem.result), [])
            .find((member: Member) => member.userName === username);

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

    addLike(username: string) {
        return this.http.post(`${this.baseUrl}likes/${username}`, {});
    }

    getLikes(predicate: string, pageNumber: number, pageSize: number) {
        let params = getPaginationHeaders({ pageNumber, pageSize });

        params = params.append('predicate', predicate);

        return getPaginatedResults<Member[]>(
            `${this.baseUrl}likes?predicate=${predicate}`,
            params,
            this.http
        );
    }
}
