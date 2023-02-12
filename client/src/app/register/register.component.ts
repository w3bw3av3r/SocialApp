import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegister = new EventEmitter<boolean>();
    registerForm: FormGroup = new FormGroup({});
    maxDate: Date = new Date();
    validationErrors: string[] | undefined;

    constructor(
        public accountService: AccountService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    }

    initializeForm() {
        this.registerForm = this.fb.nonNullable.group({
            gender: ['male'],
            username: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.minLength(4),
                        Validators.maxLength(12),
                    ],
                },
            ],
            password: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.minLength(4),
                        Validators.maxLength(12),
                    ],
                },
            ],
            confirmPassword: [
                '',
                {
                    validators: [
                        Validators.required,
                        this.matchValues('password'),
                    ],
                },
            ],
            knownAs: ['', [Validators.required]],
            dateOfBirth: ['', [Validators.required]],
            city: ['', [Validators.required]],
            country: ['', [Validators.required]],
        });
        this.registerForm.controls['password'].valueChanges.subscribe({
            next: () =>
                this.registerForm.controls[
                    'confirmPassword'
                ].updateValueAndValidity(),
        });
    }

    matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl) => {
            return control.value === control.parent?.get(matchTo)?.value
                ? null
                : { notMatching: true };
        };
    }

    onRegister() {
        if (this.registerForm.invalid) return;

        const dob = this._getDateOnly(
            this.registerForm.controls['dateOfBirth'].value
        );
        const registerFormValues = {
            ...this.registerForm.value,
            dateOfBirth: dob,
        };

        console.log(registerFormValues);
        this.accountService.register(registerFormValues).subscribe({
            next: () => {
                this.router.navigateByUrl('/members');
            },
            error: (error) => (this.validationErrors = error),
        });
    }

    onCancel() {
        // this.cancelRegister.emit(false);
        this.registerForm.reset();
    }

    private _getDateOnly(dob: string | undefined) {
        if (!dob) return;
        let userDob = new Date(dob);

        return new Date(
            userDob.setMinutes(
                userDob.getMinutes() - userDob.getTimezoneOffset()
            )
        )
            .toISOString()
            .slice(0, 10);
    }

    get username() {
        return this.registerForm.get('username') as FormControl;
    }

    get password() {
        return this.registerForm.get('password') as FormControl;
    }

    get confirmPassword() {
        return this.registerForm.get('confirmPassword') as FormControl;
    }

    get knownAs() {
        return this.registerForm.get('knownAs') as FormControl;
    }

    get dateOfBirth() {
        return this.registerForm.get('dateOfBirth') as FormControl;
    }

    get city() {
        return this.registerForm.get('city') as FormControl;
    }

    get country() {
        return this.registerForm.get('country') as FormControl;
    }
}
