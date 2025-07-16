import { Component, Input } from '@angular/core';
import { IFieldConfig, IValidation } from '../../interface/form.model';
import { RouterLink } from '@angular/router';
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf,NgForOf, NgFor, RouterLink],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  @Input() fields: IFieldConfig[] = []; // Form configuration input
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.fields)
    this.form = this.createFormGroup();
  }

  // Dynamically create a form group
  createFormGroup(): FormGroup {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      const control = this.fb.control(
        field.value || '',
        this.bindValidations(field.validations || [])
      );
      group.addControl(field.name, control);
    });
    return group;
  }

  // Bind validations based on field configuration
  bindValidations(validations: IValidation[]) {
    if (validations.length > 0) {
      const validList: ValidatorFn[] = [];
      validations.forEach(validation => {
        switch (validation.name) {
          case 'required':
            validList.push(Validators.required);
            break;
          case 'minLength':
            validList.push(Validators.minLength(validation.value));
            break;
          case 'maxLength':
            validList.push(Validators.maxLength(validation.value));
            break;
          // Add more validation cases here
        }
      });
      return validList;
    }
    return null;
  }

  // Handle form submission
  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    } else {
      console.log('Form Invalid');
    }
  }
}
