import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
    providedIn: 'root',
})
export class MembersService {
    private readonly baseUrl = 'https://localhost:5001/api/v1/';
    members: Member[] = [];

    constructor(private http: HttpClient) {}

    getMembers(userParams: UserParams) {
        // if (this.members.length > 0) return of(this.members);
        let params = this._getPaginationHeaders(userParams);

        return this._getPaginatedResults<Member[]>(
            `${this.baseUrl}users`,
            params
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
    }: UserParams) {
        let params = new HttpParams();

        params = params.append('pageNumber', pageNumber);
        params = params.append('pageSize', pageSize);
        params = params.append('minAge', minAge);
        params = params.append('maxAge', maxAge);
        params = params.append('gender', gender);
        return params;
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
