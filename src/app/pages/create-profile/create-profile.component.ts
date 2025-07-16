import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports     : [PageLayoutComponent, NgIf, ProgressBarComponent,ReactiveFormsModule ],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.scss'
})
export class CreateProfileComponent {
createProfileForm!:FormGroup;
constructor(private fb:FormBuilder){

}
ngOnInit(){
  this.createProfileForm = this.fb.group({
    userid:['', [Validators.required]],
    firstName:['', [Validators.required]],
    lastName:['', [Validators.required]],
    status:['', [Validators.required]],
    email:['', [Validators.required, Validators.email]],
    startDate:['', [Validators.required]],
    endDate:['', [Validators.required]],
    role:['', [Validators.required]],

  })
}
onSubmit() {
  if (this.createProfileForm.valid) {
    console.log(this.createProfileForm.value);
  } else {
    console.log('Form is invalid');
  }
}
}
