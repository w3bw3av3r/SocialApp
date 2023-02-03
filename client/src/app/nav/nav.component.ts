import { Component } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent {
    model: { username: string; password: string };

    constructor(public accountService: AccountService) {
        this.model = { username: '', password: '' };
    }

    onLogin() {
        this.accountService.login(this.model).subscribe();
    }

    onLogout() {
        this.accountService.logout();
    }
}
