export const passwordValidationPatterns = {
  hasNumber: /\d/,
  hasLowerCase: /[a-z]/,
  isLong: /^.{8,}$/
};

// eslint-disable-next-line max-len
export const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
