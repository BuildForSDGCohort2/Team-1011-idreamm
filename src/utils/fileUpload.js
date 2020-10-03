import firebase from 'firebase/app';
import 'firebase/storage';
import moment from 'moment';
import { db } from './firebase';

const uploadFile = (
  file,
  message,
  user,
  setProgress,
  setComplete,
  setError
) => {
  // Create a root reference
  const storageRef = firebase.storage().ref();
  let fileRef;

  if (/image*/i.test(file.type)) {
    fileRef = storageRef.child(`images/${user.email}/${file.name}`);
  } else if (/video*/i.test(file.type)) {
    fileRef = storageRef.child(`videos/${user.email}/${file.name}`);
  }

  const uploadTask = fileRef.put(file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          break;
        default:
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
      setError(true);
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        db.collection('posts')
          .add({
            url: downloadURL,
            author: user.username,
            type: file.type,
            authorId: user.uid,
            message,
            likes: [],
            favorites: [],
            timestamp: moment.utc().format(),
          })
          .then(() => {
            setComplete(true);
          });
      });
    }
  );
};

export default uploadFile;
