import { ValidationError } from '@/types';
import { authErrors, emailPattern } from '@/utils/consts';
import { ErrorCode } from '@/utils/enums';
import { ref, reactive, computed } from 'vue';

export const useValidation = () => {
  const errorMessage = ref('');
  const errorType = ref('');
  const passwordValidation = reactive({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecial: false,
    isLong: false
  });

  const displayError = (error: ValidationError) => {
    errorMessage.value = authErrors[error.code]?.message ?? error.message;
    errorType.value = authErrors[error.code]?.type ?? '';
  };

  const isFormInValidState = computed(() => true);

  const validationFailed = computed(() => {
    if (isFormInValidState.value) {
      errorMessage.value = '';
      errorType.value = '';
    }
    return !isFormInValidState.value;
  });

  const isDisplayNameValid = (displayName: string) => {
    if (displayName.trim() === '') {
      displayError({ code: ErrorCode.InvalidDisplayName });
      return false;
    }
    return true;
  };

  const isEmailValid = (email: string) => {
    if (!email.trim().match(emailPattern)) {
      displayError({ code: ErrorCode.InvalidEmail });
      return false;
    }
    return true;
  };

  const isPasswordValid = () => {
    const passwordCorrect = Object.values(passwordValidation).every(v => v);

    if (!passwordCorrect) {
      displayError({ code: ErrorCode.WeakPassword });
      return false;
    }
    return true;
  };

  return {
    errorMessage,
    errorType,
    passwordValidation,
    displayError,
    isFormInValidState,
    validationFailed,
    isDisplayNameValid,
    isEmailValid,
    isPasswordValid
  };
};
