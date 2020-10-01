import validator from 'validator';

const validateUserName = (username) => {
  if (!username) {
    return 'Username is required';
  }

  if (username.length < 2 || username.length > 16) {
    return 'Username must contain 2 - 16 characters';
  }

  if (
    username.toLowerCase() === 'admin' ||
    username.toLowerCase() === 'administrator'
  ) {
    return 'Username is restricted';
  }

  if (/</gm.test(username)) {
    return 'Username contains invalid character';
  }

  return null;
};

const validateFirstName = (name) => {
  if (!name) {
    return 'First name is required';
  }

  if (/</gm.test(name)) {
    return 'First name contains invalid character';
  }

  return null;
};

const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }

  if (!validator.isEmail(email)) {
    return 'Email address is invalid';
  }

  return null;
};

const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 9 || password > 32) {
    return 'Password must contain 8 - 32 characters';
  }

  return null;
};

export { validateEmail, validatePassword, validateUserName, validateFirstName };
