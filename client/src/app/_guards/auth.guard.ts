import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private accountService: AccountService,
        private router: Router
    ) {}

    canActivate(): Observable<boolean> {
        return this.accountService.isLoggedin$.pipe(
            map((user) => {
                if (user) return true;

                this.router.navigateByUrl('/');
                return false;
            })
        );
    }
}
