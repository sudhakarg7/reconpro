import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { DynamicFormComponent } from 'src/app/shared/components/dynamic-form/dynamic-form.component';
import { IFieldConfig } from 'src/app/shared/interface/form.model';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [
    PageLayoutComponent,
    ProgressBarComponent,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    DynamicFormComponent,
  ],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.scss',
})
export class UploadFilesComponent {

  uploadForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.uploadForm = this.fb.group({
      client: ['', Validators.required],
      postGLSummary: ['', Validators.required],
      postGLDetails: ['', Validators.required],
      postPayroll: ['', Validators.required],
      postFidelity: ['', Validators.required]
    });
  }

  onFileSelected(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.uploadForm.patchValue({ [controlName]: file.name });
    }
  }

  submitForm() {
    if (this.uploadForm.valid) {
      console.log(this.uploadForm.value);
    } else {
      this.uploadForm.markAllAsTouched();
    }
  }


  fileName: string = '';
  uploadProgress: number = 0;
  // constructor() {}

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.fileName = file.name;
  //     this.uploadFile(file);
  //   }
  // }

  onFileDropped(event: any) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      this.fileName = file.name;
      this.uploadFile(file);
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  // uploadFile(file: File) {
  //   // Simulate upload progress for demo purposes
  //   this.uploadProgress = 0;
  //   const interval = setInterval(() => {
  //     if (this.uploadProgress < 100) {
  //       this.uploadProgress += 10;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 200);
  // }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post('your-api-url', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe((event) => {
        // Handle file upload progress and response here
      });
  }

  // dynamic form

  formFields: IFieldConfig[] = [
    {
      type: 'text',
      label: 'Username',
      name: 'username',
      placeholder: 'Enter username',
    },
    {
      type: 'email',
      label: 'Email',
      name: 'email',
      placeholder: 'Enter email',
    },
    {
      type: 'password',
      label: 'Password',
      name: 'password',
      placeholder: 'Enter password',
    },
    { type: 'date', label: 'Date of Birth', name: 'dob' },
    { type: 'file', label: 'Upload File', name: 'file' },
    { type: 'checkbox', label: 'I accept the terms', name: 'acceptTerms' },
    {
      type: 'radio',
      label: 'Gender',
      name: 'gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    { type: 'range', label: 'Range', name: 'range' },
    {
      type: 'tel',
      label: 'Phone Number',
      name: 'phone',
      placeholder: 'Enter phone number',
    },
    {
      type: 'url',
      label: 'Website',
      name: 'website',
      placeholder: 'Enter website',
    },
    {
      type: 'select',
      label: 'Country',
      name: 'country',
      options: [
        { label: 'India', value: 'IN' },
        { label: 'USA', value: 'US' },
      ],
    },
    {
      type: 'textarea',
      label: 'Message',
      name: 'message',
      placeholder: 'Enter your message',
    },
    { type: 'button', label: 'Click Me', name: 'clickMe' },
    { type: 'submit', label: 'Submit', name: 'submitForm' },
  ];
}
