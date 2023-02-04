import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent {
    model: { username: string; password: string };

    constructor(
        public accountService: AccountService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.model = { username: '', password: '' };
    }

    onLogin() {
        this.accountService
            .login(this.model)
            .subscribe({
                next: () => this.router.navigateByUrl('/members'),
                error: (error) => this.toastr.error(error.error),
            });
    }

    onLogout() {
        this.accountService.logout();
    }
}
