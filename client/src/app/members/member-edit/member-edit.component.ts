import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
    standalone: true,
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css'],
    imports: [CommonModule, FormsModule, TabsModule, ToastrModule],
})
export class MemberEditComponent {
    @HostListener('window:beforeunload', ['$event']) unloadNotification(
        $event: any
    ) {
        if (this.editMemberForm?.dirty) {
            $event.returnValue = true;
        }
    }
    @ViewChild('editMemberForm') editMemberForm: NgForm | undefined;
    memberUsername = this.accountService.currentUserValue?.username!;
    memberData$ = this.memberService.getMember(this.memberUsername);

    constructor(
        private accountService: AccountService,
        private memberService: MembersService,
        private toast: ToastrService
    ) {}

    updateMember() {
        console.log(this.editMemberForm?.value);
        this.memberService.updateMember(this.editMemberForm?.value).subscribe({
            next: (_) => {
                this.toast.success('Profile updated successfully');
                this.editMemberForm?.reset(this.editMemberForm?.value);
            },
        });
    }
}
