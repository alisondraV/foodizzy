import { Component, Vue } from 'vue-property-decorator';
import { authErrors } from '@/utils/consts';
import ValidationError from '@/types/ValidationError';

@Component
export class ValidationMixin extends Vue {
  errorMessage = '';
  errorType = '';

  displayError(error: ValidationError) {
    this.errorMessage = authErrors[error.code]?.message ?? error.message;
    this.errorType = authErrors[error.code]?.type ?? '';
  }
}
