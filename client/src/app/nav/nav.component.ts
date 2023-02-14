import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/members.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent {
    model: { username: string; password: string };
    user: User | undefined;
    userParams: UserParams | undefined;

    constructor(
        public accountService: AccountService,
        private memberService: MembersService,
        private router: Router
    ) {
        this.model = { username: '', password: 'Pa$$w0rd' };
    }

    onLogin() {
        this.accountService.login(this.model).subscribe({
            next: (user) => {
                this.user = this.memberService.user = user;
                this.userParams = new UserParams(user);
                this.memberService.setUserParams(this.userParams);
                this.router.navigateByUrl('/members');
            },
        });
    }

    onLogout() {
        this.accountService.logout();
        this.memberService.members = [];
    }
}
