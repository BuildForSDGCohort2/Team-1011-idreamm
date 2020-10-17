import React, { createContext, useContext, useEffect, useState } from 'react';
import Peer from 'peerjs';
import firebase from 'firebase/app';
import { AuthContext } from './AuthContext';

export const CallContext = createContext();

export function CallProvider({ children }) {
  const { currentUser } = useContext(AuthContext);
  const [peer, setPeer] = useState({});
  const [call, setCall] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    const peer = new Peer(currentUser.uid);

    peer.on('open', (id) => {
      const userPeerDatabaseRef = firebase
        .database()
        .ref('/peer/' + currentUser.uid);
      userPeerDatabaseRef.set({
        id,
        onCall: false,
      });
    });

    peer.on('disconnected', () => peer.reconnect());

    peer.on('call', (call) => {
      setStatus('Incoming call');

      setCall({
        isCalling: true,
        type: call.metadata.type,
        room: call.metadata.room,
        caller: false,
        end: () => call.close(),
      });

      const ringTone = new Audio('./simple_tone.mp3');
      ringTone.volume = 0.5;
      ringTone.play();
      ringTone.onended = () => {
        if (!call.open) {
          ringTone.play();
        }
      };

      if (call.metadata.type === 'video') {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'user' }, audio: true })
          .then((stream) => {
            const localVideo = document.createElement('video');
            localVideo.id = 'localVideo';
            localVideo.srcObject = stream;
            localVideo.muted = true;
            localVideo.autoplay = true;
            localVideo.onloadedmetadata = () => {
              document
                .getElementById('main-video-container')
                .appendChild(localVideo);
            };

            call.on('stream', () => {
              localVideo.remove();
              stream.getTracks().forEach((track) => track.stop());
            });
          });
      }

      const acceptCall = () => {
        ringTone.pause();
        ringTone.currentTime = 0;

        navigator.mediaDevices
          .getUserMedia({
            audio: { echoCancellation: true },
            video:
              call.metadata.type === 'video' ? { facingMode: 'user' } : false,
          })
          .then((stream) => {
            call.answer(stream);

            const remoteMedia = document.createElement(
              call.metadata.type === 'video' ? 'video' : 'audio'
            );

            call.on('stream', (remoteStream) => {
              setStatus('');
              if (call.metadata.type === 'video') {
                const localVideo = document.createElement('video');

                localVideo.srcObject = stream;
                localVideo.autoplay = true;
                localVideo.muted = true;

                remoteMedia.srcObject = remoteStream;
                remoteMedia.autoplay = true;

                remoteMedia.onloadedmetadata = () => {
                  document
                    .getElementById('main-video-container')
                    .appendChild(remoteMedia);
                  document
                    .getElementById('mini-video-container')
                    .appendChild(localVideo);
                };
              } else {
                remoteMedia.srcObject = remoteStream;
                remoteMedia.onloadedmetadata = () => {
                  remoteMedia.play();
                };
              }
            });

            call.on('close', () => {
              setStatus('Call ended');
              remoteMedia.remove();
              stream.getTracks().forEach((track) => track.stop());
              setTimeout(() => {
                setCall({ isCalling: false });
              }, 2000);
            });
          });
      };

      setCall((call) => ({ ...call, accept: acceptCall }));
    });

    setPeer(peer);
  }, [currentUser.uid]);

  return (
    <CallContext.Provider value={{ peer, call, setCall, status, setStatus }}>
      {children}
    </CallContext.Provider>
  );
}
