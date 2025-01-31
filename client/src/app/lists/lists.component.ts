import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
    members: Member[] | undefined;
    predicate = 'liked';
    pageNumber = 1;
    pageSize = 6;
    pagination: Pagination | undefined;

    constructor(private memberService: MembersService) {}

    ngOnInit(): void {
        this.loadLikes();
    }

    loadLikes() {
        this.memberService
            .getLikes(this.predicate, this.pageNumber, this.pageSize)
            .subscribe({
                next: (response) => {
                    this.members = response.result;
                    this.pagination = response.pagination;
                },
            });
    }

    pageChanged(e: any) {
        if (this.pageNumber !== e.page) {
            this.pageNumber = e.page;
            this.loadLikes();
        }
    }
}
