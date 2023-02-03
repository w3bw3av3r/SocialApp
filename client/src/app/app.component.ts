import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { LocalstorageService } from './_services/localstorage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private _accountService: AccountService,
        private _userLocalStorage: LocalstorageService
    ) {
        this.setCurrentUser();
    }

    ngOnInit(): void {}

    setCurrentUser() {
        const currentUser$ = this._userLocalStorage.getItem('user');
        currentUser$.subscribe({
            next: (user) => {
                if (user) this._accountService.setCurrentUser(JSON.parse(user));
            },
        });
    }
}
