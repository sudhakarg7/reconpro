import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-clientconfig',
  standalone: true,
  imports     : [PageLayoutComponent, NgIf, ProgressBarComponent,ReactiveFormsModule ],
  templateUrl: './clientconfig.component.html',
  styleUrl: './clientconfig.component.scss'
})
export class ClientconfigComponent {


  clientForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      client: ['', Validators.required], // Dropdown input
      sfdpLocation: ['', Validators.required], // Text input
      apiUrl: ['', [Validators.required, Validators.pattern('https?://.+')]], // URL validation
      username: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', Validators.required], // Password input
      sharedLocation: ['', [Validators.required, Validators.pattern('https?://.+')]] // URL validation
    });
  }

  // To handle form submission
  onSubmit() {
    if (this.clientForm.valid) {
      console.log(this.clientForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

}
