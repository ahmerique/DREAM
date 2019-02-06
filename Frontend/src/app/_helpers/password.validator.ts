import { FormGroup } from '@angular/forms';

export class ConfirmPasswordValidator {
  static validate(registrationFormGroup: FormGroup) {
    let password = registrationFormGroup.controls.password.value;
    let confirmPassword = registrationFormGroup.controls.confirmPassword.value;

    if (confirmPassword.length <= 0) {
      return null;
    }

    if (confirmPassword !== password) {
      return {
        doesMatchPassword: true
      };
    }

    return null;

  }
}
