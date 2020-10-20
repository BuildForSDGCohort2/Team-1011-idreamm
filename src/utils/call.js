// ************** Make Audio Call *****************
const makeAudioCall = (
  peer,
  userId,
  room,
  connection,
  setStatus,
  closeWithStatus,
  setLocalCall
) => {
  navigator.mediaDevices
    .getUserMedia({ audio: { echoCancellation: true } })
    .then((stream) => {
      const call = peer.call(userId, stream, {
        metadata: { type: 'audio', room },
      });

      setLocalCall(call);

      const remoteMedia = document.createElement('audio');

      const checkCall = setTimeout(() => {
        if (!call.open) {
          connection.send('end-call');
          closeWithStatus(connection, 'No response');
        }
      }, 20000);

      call.on('stream', (remoteStream) => {
        clearTimeout(checkCall);
        remoteMedia.srcObject = remoteStream;
        remoteMedia.oncanplay = () => {
          remoteMedia.play();
          setStatus('');
        };
      });

      //FIX: ******* This method should be used only by firefox
      const checkConnection = setInterval(() => {
        if (!connection.open) {
          remoteMedia.remove();

          stream.getTracks().forEach((track) => track.stop());

          clearTimeout(checkCall);
          clearInterval(checkConnection);
        }
      }, 3000);

      // Onclose listenter for chrome users
      call.on('close', () => {
        clearTimeout(checkCall);
        clearInterval(checkConnection);

        remoteMedia.remove();

        stream.getTracks().forEach((track) => track.stop());
      });
    })
    .catch(() => {
      //handle errors here
      closeWithStatus(connection, 'Could not access mic');
    });
};

// *************** Answer Audio call *********************
const answerAudioCall = (call, connection, setStatus, closeWithStatus) => {
  navigator.mediaDevices
    .getUserMedia({ audio: { echoCancellation: true } })
    .then((stream) => {
      call.answer(stream);

      const remoteMedia = document.createElement('audio');

      call.on('stream', (remoteStream) => {
        remoteMedia.srcObject = remoteStream;
        remoteMedia.oncanplay = () => {
          remoteMedia.play();
          setStatus('');
        };
      });

      const checkConnection = setInterval(() => {
        if (!connection.open) {
          remoteMedia.remove();
          stream.getTracks().forEach((track) => track.stop());
          clearInterval(checkConnection);
        }
      }, 3000);
    })
    .catch(() => {
      connection.send('end-call');
      closeWithStatus(connection, 'Could not access mic');
    });
};

// ********* Make Video Call **************
const makeVideoCall = (
  peer,
  userId,
  room,
  connection,
  setStatus,
  closeWithStatus,
  setLocalCall
) => {
  navigator.mediaDevices
    .getUserMedia({
      audio: { echoCancellation: true },
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
    })
    .then((stream) => {
      const call = peer.call(userId, stream, {
        metadata: { type: 'video', room },
      });

      setLocalCall(call);

      const mainVideo = document.getElementById('main-video');
      const miniVideo = document.getElementById('mini-video');

      mainVideo.muted = true;
      mainVideo.srcObject = stream;

      const checkCall = setTimeout(() => {
        if (!call.open) {
          connection.send('end-call');
          closeWithStatus(connection, 'No response');
        }
      }, 20000);

      call.on('stream', (remoteStream) => {
        clearTimeout(checkCall);

        mainVideo.muted = false;
        mainVideo.srcObject = remoteStream;
        miniVideo.srcObject = stream;

        setStatus('');
      });

      //FIX: ******* This method should be used only for firfox *********
      const checkConnection = setInterval(() => {
        if (!connection.open) {
          stream.getTracks().forEach((track) => track.stop());

          clearTimeout(checkCall);
          clearInterval(checkConnection);
        }
      }, 3000);

      // onClose listener for chrome users
      call.on('close', () => {
        clearInterval(checkConnection);
        clearTimeout(checkCall);

        stream.getTracks().forEach((track) => track.stop());
      });
    })
    .catch(() => {
      //handle errors here
      closeWithStatus(connection, 'Could not access camera');
    });
};

// ************** Answer video call *************
const answerVideoCall = (call, connection, setStatus, closeWithStatus) => {
  navigator.mediaDevices
    .getUserMedia({ audio: { echoCancellation: true }, video: true })
    .then((stream) => {
      call.answer(stream);

      const mainVideo = document.getElementById('main-video');
      const miniVideo = document.getElementById('mini-video');

      miniVideo.srcObject = stream;

      call.on('stream', (remoteStream) => {
        mainVideo.srcObject = remoteStream;
        setStatus('');
      });

      const checkConnection = setInterval(() => {
        if (!connection.open) {
          stream.getTracks().forEach((track) => track.stop());
          clearInterval(checkConnection);
        }
      }, 3000);
    })
    .catch(() => {
      connection.send('end-call');
      closeWithStatus(connection, 'Could not access camera');
    });
};

export { makeVideoCall, makeAudioCall, answerAudioCall, answerVideoCall };
