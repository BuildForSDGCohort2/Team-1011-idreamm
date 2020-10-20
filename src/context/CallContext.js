import React, { createContext, useContext, useEffect, useState } from 'react';
import Peer from 'peerjs';
import { AuthContext } from './AuthContext';

export const CallContext = createContext();

export function CallProvider({ children }) {
  const { currentUser } = useContext(AuthContext);
  const [peer, setPeer] = useState({});
  const [call, setCall] = useState({});
  const [connection, setConnection] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const peer = new Peer(currentUser.uid);
    let numUsers = 0;

    peer.on('connection', (conn) => {
      if (numUsers === 1) {
        conn.on('open', () => {
          conn.send('oncall');
          setTimeout(() => conn.close(), 100);
        });
        return;
      } else {
        numUsers = 1;
      }

      setConnection(conn);

      conn.on('data', (data) => {
        //Check if caller ended the call, end call and clear any streams
        if (data === 'end-call') {
          numUsers = 0;

          setStatus('Call ended');
          setTimeout(() => {
            conn.close();
            setCall({ isCalling: false });
          }, 2000);
        }
      });

      //HACK: *********** REMOVE ONCLOSE LISTENER ASAP *********
      conn.on('close', () => {
        numUsers = 0;
      });
    });

    peer.on('call', (call) => {
      setStatus(`Incoming ${call.metadata.type} call`);

      setCall({
        isCalling: true,
        type: call.metadata.type,
        room: call.metadata.room,
        caller: false,
        remote: call,
      });
    });

    peer.on('disconnected', () => {
      if (!peer.destroyed) {
        peer.reconnect();
      }
    });

    setPeer(peer);
    console.log('mounted');

    return () => peer.destroy();
  }, [currentUser.uid]);

  return (
    <CallContext.Provider
      value={{
        peer,
        call,
        setCall,
        status,
        setStatus,
        connection,
        setConnection,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}
