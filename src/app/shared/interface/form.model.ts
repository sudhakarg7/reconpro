export interface IFieldConfig {
    type: string;     // 'input', 'select', 'checkbox', 'radio', etc.
    label: string;    // Label for the form control
    name: string;     // Form control name (unique)
    placeholder?: string;  // Placeholder text for input fields
    value?: any;      // Initial value for the field
    options?: { label: string, value: any }[];  // Options for select, radio
    validations?: IValidation[]; // Validation rules
  }
  
  export interface IValidation {
    name: string;     // Validation type, e.g. 'required', 'min', 'max', etc.
    value?: any;      // Validation value, e.g. minLength: 5
    message?: string; // Custom error message
  }
  