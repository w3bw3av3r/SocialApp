import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent {
    @Input() member: Member | undefined;

    constructor(
        private membserService: MembersService,
        private toaster: ToastrService
    ) {}

    addLike(member: Member) {
        this.membserService.addLike(member.userName).subscribe({
            next: () => {
                this.toaster.success(`You have liked ${member.knownAs}`);
            },
        });
    }
}
