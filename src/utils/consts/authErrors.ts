export const authErrors = {
  'auth/invalid-email': {
    type: 'email',
    message: 'Please enter a valid email.'
  },
  'auth/invalid-password': {
    type: 'password',
    message: 'Wrong password. Please try again.'
  },
  'auth/wrong-password': {
    type: 'password',
    message: 'Wrong password. Please try again.'
  },
  'auth/weak-password': {
    type: 'password',
    message: 'Password is too weak.'
  },
  'auth/invalid-display-name': {
    type: 'displayName',
    message: 'Please provide a valid name.'
  },
  'auth/user-not-found': {
    message: 'We could not find a user that corresponds to this email. Try signing up.'
  }
};
