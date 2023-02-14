import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
    members: Member[] = [];
    pagination: Pagination | undefined;
    userParams: UserParams | undefined;
    genderList = [
        { value: 'male', display: 'Males' },
        { value: 'female', display: 'Females' },
    ];

    constructor(private memberService: MembersService) {
        this.userParams = this.memberService.getUserParams();
    }

    ngOnInit(): void {
        this.loadMembers();
    }

    loadMembers() {
        if (this.userParams) {
            this.memberService.setUserParams(this.userParams);
            this.memberService.getMembers(this.userParams).subscribe({
                next: (response) => {
                    if (response.result && response.pagination) {
                        this.members = response.result;
                        this.pagination = response.pagination;
                    }
                },
            });
        }
    }

    pageChanged(e: any) {
        if (this.userParams && this.userParams?.pageNumber !== e.page) {
            this.userParams.pageNumber = e.page;
            this.memberService.setUserParams(this.userParams);
            this.loadMembers();
        }
    }

    resetFilters() {
        this.userParams = this.memberService.resetUserParams();
        this.loadMembers();
    }
}
