import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../_models/message';
import { getPaginatedResults, getPaginationHeaders } from './paginationHelper';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private readonly baseUrl = 'https://localhost:5001/api/v1/';

    constructor(private http: HttpClient) {}

    getMessage(pageNumber: number, pageSize: number, container: string) {
        let params = getPaginationHeaders({ pageNumber, pageSize });
        params = params.append('container', container);
        return getPaginatedResults<Message[]>(
            `${this.baseUrl}messages`,
            params,
            this.http
        );
    }

    getMessageThread(username: string) {
        return this.http.get<Message[]>(
            `${this.baseUrl}messages/thread/${username}`
        );
    }

    sendMessage(username: string, content: string) {
        return this.http.post<Message>(`${this.baseUrl}messages`, {
            recipientUsername: username,
            content,
        });
    }

    deleteMessage(id: number) {
        return this.http.delete(`${this.baseUrl}messages/${id}`);
    }
}
