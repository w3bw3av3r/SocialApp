import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
    messages:
        | {
              unread: Message[] | undefined;
              inbox: Message[] | undefined;
              outbox: Message[] | undefined;
          }
        | undefined = { unread: [], inbox: [], outbox: [] };
    pagination?: Pagination;
    container = 'Unread';
    pageNumber = 1;
    pageSize = 6;
    loading = false;
    inbox = 'inbox';

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        this.loadMessages();
    }

    loadMessages() {
        this.loading = true;
        this.messageService
            .getMessage(this.pageNumber, this.pageSize, this.container)
            .subscribe({
                next: (response) => {
                    if (response && this.messages) {
                        if (this.container === 'Unread')
                            this.messages.unread = response.result;
                        if (this.container === 'Inbox')
                            this.messages.inbox = response.result;
                        if (this.container === 'Outbox')
                            this.messages.outbox = response.result;
                        this.pagination = response.pagination;
                        this.loading = false;
                    }
                },
            });
    }

    deleteMessage(id: number) {
        this.messageService.deleteMessage(id).subscribe({
            next: () => {
                if (this.container === 'Inbox')
                    this.messages?.inbox?.splice(
                        this.messages.inbox.findIndex((m) => m.id === id),
                        1
                    );
                if (this.container === 'Outbox')
                    this.messages?.outbox?.splice(
                        this.messages.outbox.findIndex((m) => m.id === id),
                        1
                    );
                if (this.container === 'Unread')
                    this.messages?.unread?.splice(
                        this.messages.unread.findIndex((m) => m.id === id),
                        1
                    );
            },
        });
    }

    pageChanged(e: any) {
        if (this.pageNumber !== e.page) {
            this.pageNumber = e.page;
            this.loadMessages();
        }
    }
}
