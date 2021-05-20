import { Component, Vue, Watch } from 'vue-property-decorator';
import { ErrorCode, authErrors, emailPattern, passwordValidationPatterns } from '@/utils/consts';
import { ValidationError } from '@/types';

@Component
export class ValidationMixin extends Vue {
  errorMessage = '';
  errorType = '';
  passwordValidation = {
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecial: false,
    isLong: false
  };

  displayError(error: ValidationError) {
    this.errorMessage = authErrors[error.code]?.message ?? error.message;
    this.errorType = authErrors[error.code]?.type ?? '';
  }

  @Watch('password')
  updatePasswordValidation(password: string) {
    Object.keys(this.passwordValidation).forEach(rule => {
      const pattern = passwordValidationPatterns[rule];
      this.passwordValidation[rule] = Boolean(password.match(pattern));
    });
  }

  get isFormInValidState() {
    return true;
  }

  get validationFailed(): boolean {
    if (this.isFormInValidState) {
      this.errorMessage = '';
      this.errorType = '';
    }
    return !this.isFormInValidState;
  }

  isDisplayNameValid(displayName: string) {
    if (displayName.trim() === '') {
      this.displayError({ code: ErrorCode.InvalidDisplayName });
      return false;
    }
    return true;
  }

  isEmailValid(email: string) {
    if (!email.trim().match(emailPattern)) {
      this.displayError({ code: ErrorCode.InvalidEmail });
      return false;
    }
    return true;
  }

  isPasswordValid() {
    const passwordCorrect = Object.values(this.passwordValidation).every(v => v);

    if (!passwordCorrect) {
      this.displayError({ code: ErrorCode.WeakPassword });
      return false;
    }
    return true;
  }
}
