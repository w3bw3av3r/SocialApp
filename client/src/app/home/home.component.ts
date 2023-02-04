import { Component } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    registerMode = false;

    constructor(public accountService: AccountService) {}

    registerToggle() {
        this.registerMode = !this.registerMode;
    }

    cancelRegisterMode(event: boolean) {
        console.log('Cancelled registration...');
        this.registerMode = event;
    }
}
