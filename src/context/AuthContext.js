import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import moment from 'moment';
import { auth } from '../utils/firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('authenticated_user'))
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem(
          'authenticated_user',
          JSON.stringify({
            email: user.email,
            uid: user.uid,
            username: user.displayName,
          })
        );
        setCurrentUser({
          email: user.email,
          uid: user.uid,
          username: user.displayName,
        });

        // Create a reference to this user's specific status node.
        // This is where we will store data about being online/offline.
        const userStatusDatabaseRef = firebase
          .database()
          .ref('/status/' + user.uid);

        // We'll create two constants which we will write to
        // the Realtime database when this device is offline
        // or online.
        const isOfflineForDatabase = {
          state: 'offline',
          last_changed: moment.utc().format(),
        };

        const isOnlineForDatabase = {
          state: 'online',
          last_changed: moment.utc().format(),
        };

        // Create a reference to the special '.info/connected' path in
        // Realtime Database. This path returns `true` when connected
        // and `false` when disconnected.
        firebase
          .database()
          .ref('.info/connected')
          .on('value', function (snapshot) {
            // If we're not currently connected, don't do anything.
            if (snapshot.val() === false) {
              return;
            }

            // If we are currently connected, then use the 'onDisconnect()'
            // method to add a set which will only trigger once this
            // client has disconnected by closing the app,
            // losing internet, or any other means.
            userStatusDatabaseRef
              .onDisconnect()
              .set(isOfflineForDatabase)
              .then(function () {
                // The promise returned from .onDisconnect().set() will
                // resolve as soon as the server acknowledges the onDisconnect()
                // request, NOT once we've actually disconnected:
                // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

                // We can now safely set ourselves as 'online' knowing that the
                // server will mark us as offline once we lose connection.
                userStatusDatabaseRef.set(isOnlineForDatabase);
              });
          });
      } else {
        localStorage.removeItem('authenticated_user');
        setCurrentUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
