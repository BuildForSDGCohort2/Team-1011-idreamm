import validator from 'validator';
import { db } from './firebase';

const validateUserName = (username, allowBlank) => {
  if (!username && allowBlank) {
    return null;
  }

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

const validateFirstName = (name, allowBlank) => {
  if (!name && allowBlank) {
    return null;
  }

  if (!name) {
    return 'First name is required';
  }

  if (/</gm.test(name)) {
    return 'First name contains invalid character';
  }

  return null;
};

const validateEmail = (email, allowBlank) => {
  if (!email && allowBlank) {
    return null;
  }

  if (!email) {
    return 'Email is required';
  }

  if (!validator.isEmail(email)) {
    return 'Email address is invalid';
  }

  return null;
};

const validatePassword = (password, allowBlank) => {
  if (!password && allowBlank) {
    return null;
  }

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

const getUserById = async (uid) => {
  let doc = await db.collection('users').doc(uid).get();

  if (doc.exists) return doc.data();
  throw new Error('No such user');
};

export {
  validateEmail,
  validatePassword,
  validateUserName,
  validateFirstName,
  truncateText,
  formatLikes,
  shareFile,
  getUserById,
};
