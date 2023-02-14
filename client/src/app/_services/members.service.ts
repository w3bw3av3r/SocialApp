import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, of, take } from 'rxjs';

import { AccountService } from './account.service';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';

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

        let params = this._getPaginationHeaders(userParams);

        return this._getPaginatedResults<Member[]>(
            `${this.baseUrl}users`,
            params
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

    getLikes(predicate: string) {
        return this.http.get<Member[]>(
            `${this.baseUrl}likes?predicate=${predicate}`
        );
    }

    private _getPaginatedResults<T>(url: string, params: HttpParams) {
        const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
        return this.http
            .get<T>(url, {
                observe: 'response',
                params,
            })
            .pipe(
                map((response) => {
                    if (response.body) {
                        paginatedResult.result = response.body;
                    }
                    const pagination = response.headers.get('Pagination');
                    if (pagination) {
                        paginatedResult.pagination = JSON.parse(pagination);
                    }
                    return paginatedResult;
                })
            );
    }

    private _getPaginationHeaders({
        pageNumber,
        pageSize,
        minAge,
        maxAge,
        gender,
        orderBy,
    }: UserParams) {
        let params = new HttpParams();

        params = params.append('pageNumber', pageNumber);
        params = params.append('pageSize', pageSize);
        params = params.append('minAge', minAge);
        params = params.append('maxAge', maxAge);
        params = params.append('gender', gender);
        params = params.append('orderBy', orderBy);
        return params;
    }
}
