import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({
    templateUrl: 'add-edit.component.html',
    standalone: false
})
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    isAddMode = true;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            password: ['', this.isAddMode
                ? [Validators.required, Validators.minLength(6)]
                : [Validators.minLength(6)]
            ],
            confirmPassword: ['']
        });

        if (!this.isAddMode) {
            this.accountService.getById(this.id!)
                .pipe(first())
                .subscribe(account => {
                    this.f['title'].setValue(account.title);
                    this.f['firstName'].setValue(account.firstName);
                    this.f['lastName'].setValue(account.lastName);
                    this.f['email'].setValue(account.email);
                    this.f['role'].setValue(account.role);
                });
        }
    }

    get f() {
        return this.form.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) return;

        this.submitting = true;

        if (this.isAddMode) {
            this.createAccount();
        } else {
            this.updateAccount();
        }
    }

    private createAccount() {
        this.accountService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Account created successfully');
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }

    private updateAccount() {
        this.accountService.update(this.id!, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Account updated successfully');
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}
