import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

export function getPaginatedResults<T>(
    url: string,
    params: HttpParams,
    http: HttpClient
) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return http
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

export function getPaginationHeaders({
    pageNumber,
    pageSize,
}: Partial<UserParams>) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber ? pageNumber : 0);
    params = params.append('pageSize', pageSize ? pageSize : 6);

    return params;
}
