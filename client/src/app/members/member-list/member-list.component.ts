import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
    // members$ = this.memberService.getMembers();
    members: Member[] = [];
    pagination: Pagination | undefined;
    pageNumber = 1;
    pageSize = 12;

    constructor(private memberService: MembersService) {}

    ngOnInit(): void {
        this.loadMembers();
    }

    loadMembers() {
        this.memberService
            .getMembers(this.pageNumber, this.pageSize)
            .subscribe({
                next: (response) => {
                    if (response.result && response.pagination) {
                        this.members = response.result;
                        this.pagination = response.pagination;
                    }
                },
            });
    }

    pageChanged(e: any) {
        if (this.pageNumber !== e.page) {
            this.pageNumber = e.page;
            this.loadMembers();
        }
    }
}
