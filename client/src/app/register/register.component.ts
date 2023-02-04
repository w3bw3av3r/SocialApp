import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
    @Output() cancelRegister = new EventEmitter<boolean>();
    model: { username: string; password: string };

    constructor(public accountService: AccountService) {
        this.model = { username: '', password: '' };
    }

    onRegister() {
        console.log(this.model);
        this.accountService.register(this.model).subscribe({
            next: (resp) => {
                console.log(resp);
                this.onCancel();
            },
            error: (error) => console.log(error),
        });
    }

    onCancel() {
        this.cancelRegister.emit(false);
    }
}
