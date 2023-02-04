import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private accountService: AccountService) {}

    canActivate(): Observable<boolean> {
        return this.accountService.isLoggedin$;
    }
}
