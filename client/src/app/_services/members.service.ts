import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
    providedIn: 'root',
})
export class MembersService {
    private readonly baseUrl = 'https://localhost:5001/api/v1/';
    members: Member[] = [];
    paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<
        Member[]
    >();

    constructor(private http: HttpClient) {}

    getMembers(page?: number, itemsPerPage?: number) {
        let params = new HttpParams();

        if (page && itemsPerPage) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }
        // if (this.members.length > 0) return of(this.members);
        return this.http
            .get<Member[]>(`${this.baseUrl}users`, {
                observe: 'response',
                params,
            })
            .pipe(
                map((response) => {
                    console.log(response);
                    console.log(response.body);
                    if (response.body) {
                        this.paginatedResult.result = response.body;
                    }
                    const pagination = response.headers.get('Pagination');
                    if (pagination) {
                        this.paginatedResult.pagination =
                            JSON.parse(pagination);
                    }
                    return this.paginatedResult;
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
