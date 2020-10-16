import React, { createContext, useContext, useEffect, useState } from 'react';
import Peer from 'peerjs';
import firebase from 'firebase/app';
import { AuthContext } from './AuthContext';

export const CallContext = createContext();

export function CallProvider({ children }) {
  const { currentUser } = useContext(AuthContext);
  const [peer, setPeer] = useState({});
  const [call, setCall] = useState({});

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      const userPeerDatabaseRef = firebase
        .database()
        .ref('/peer/' + currentUser.uid);
      userPeerDatabaseRef.set({
        id,
        onCall: false,
      });
    });

    peer.on('call', (call) => {
      const ringTone = new Audio('./simple_tone.mp3');
      ringTone.volume = 0.5;
      ringTone.play();
      ringTone.onended = () => {
        if (!call.open) {
          ringTone.play();
        }
      };
      setCall({
        isCalling: true,
        type: call.metadata.type,
        room: call.metadata.room,
        caller: false,
        controller: call,
        ringTone,
      });
    });
    setPeer(peer);
  }, [currentUser.uid]);

  return (
    <CallContext.Provider value={{ peer, call, setCall }}>
      {children}
    </CallContext.Provider>
  );
}
