// Angular modules
import { NgClass }             from '@angular/common';
import { NgIf }                from '@angular/common';
import { Component }           from '@angular/core';
import { FormGroup }           from '@angular/forms';
import { FormsModule }         from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl }         from '@angular/forms';
import { Validators }          from '@angular/forms';
import { Router }              from '@angular/router';
import { RouterLink }          from '@angular/router';
import { Inject } from '@angular/core';

// External modules
import { TranslateModule }     from '@ngx-translate/core';

// Internal modules
import { environment }         from '@env/environment';

// Services
import { AppService }          from '@services/app.service';
import { StoreService }        from '@services/store.service';

@Component({
  selector    : 'app-login',
  templateUrl : './login.component.html',
  styleUrls   : ['./login.component.scss'],
  standalone  : true,
  imports     : [FormsModule, ReactiveFormsModule, NgClass, NgIf, RouterLink, TranslateModule]
})
export class LoginComponent
{
  public appName : string = environment.appName;
  public formGroup !: FormGroup<{
    email    : FormControl<string>,
    password : FormControl<string>,
  }>;

  public showPassword: boolean = false;
  public loading: boolean = false;
  public loginError: string | null = null;

  constructor(
    @Inject(Router) private router: Router,
    private storeService: StoreService,
    private appService: AppService,
  )
  {
    this.initFormGroup();
  }

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private initFormGroup() : void
  {
    this.formGroup = new FormGroup({
      email      : new FormControl<string>({
        value    : '',
        disabled : false
      }, { validators : [Validators.required, Validators.email], nonNullable : true }),
      password   : new FormControl<string>({
        value    : '',
        disabled : false
      }, { validators : [Validators.required], nonNullable : true })
    });
  }

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async onClickSubmit() : Promise<void>
  {
    this.loginError = null;
    this.loading = true;
    try {
      await this.authenticate();
    } finally {
      this.loading = false;
    }
  }

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private async authenticate() : Promise<void>
  {
    // this.storeService.isLoading.set(true); // No longer needed for UI loading
    const email    = this.formGroup.controls.email.getRawValue();
    const password = this.formGroup.controls.password.getRawValue();
    const success  = await this.appService.authenticate(email, password);
    // this.storeService.isLoading.set(false);
    if (!success) {
      this.loginError = 'Invalid email or password.';
      return;
    }
    // NOTE Redirect to home
    this.router.navigate(['/home']);
  }

  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

}
