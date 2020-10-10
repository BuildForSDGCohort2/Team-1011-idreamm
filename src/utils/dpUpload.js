import firebase from 'firebase/app';
import 'firebase/storage';
import { db, auth } from './firebase';

const upLoadDp = (file, user, setProgress, setComplete, setError) => {
  const fileExtension = file.name.split('.')[file.name.split('.').length - 1];
  // Create a root reference
  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(`displayPhotos/${user.uid + fileExtension}`);
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
        const promise1 = db.collection('users').doc(user.uid).update({
          photoUrl: downloadURL,
        });

        const promise2 = auth.currentUser.updateProfile({
          photoURL: downloadURL,
        });

        Promise.all([promise1, promise2]).then(() => setComplete(true));
      });
    }
  );
};

export default upLoadDp;
