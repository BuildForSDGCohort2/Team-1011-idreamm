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

const truncateText = (text) => {
  if (text.length > 100) {
    return text.substr(0, 100) + '...';
  }

  return null;
};

const formatLikes = (num) => {
  if (num === 0) {
    return '';
  } else if (num === 1) {
    return '1 like';
  } else {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'K likes'
      : Math.sign(num) * Math.abs(num) + ' likes';
  }
};

const createFile = async (url, type) => {
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = {
    type,
  };
  const file = new File([data], 'test.jpg', metadata);

  return file;
};

const shareFile = (url, type) => {
  const file = createFile(url, type);

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator
      .share({
        files: [file],
        title: 'iDreamm share',
        text: 'Share motivational content with your love ones',
        url: 'https://idreamm.web.app',
      })
      .then(() => console.log('Share was successful.'))
      .catch((error) => console.log('Sharing failed', error));
  } else {
    console.log(`Your system doesn't support sharing files.`);
  }
};

export {
  validateEmail,
  validatePassword,
  validateUserName,
  validateFirstName,
  truncateText,
  formatLikes,
  shareFile,
};
