import React, { useState, useEffect } from "react";
import axios from "axios";

const RecordAudio = () => {
  const [msg, setMsg] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = document.getElementById("recordedAudio");
      audioElement.src = audioUrl;
    }
  }, [audioChunks]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        setRecording(true);

        recorder.addEventListener("dataavailable", (event) => {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        });
      })
      .catch((error) => console.error("Error accessing user media:", error));
  };

  const clearRecording = () => {
    setAudioChunks([]);
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const uploadAudio = async (blob) => {
    try {
      console.log({ blob });
      const formData = new FormData();
      formData.append("audio", blob, `${new Date().valueOf()}.wav`);
      const { data } = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMsg(data);
    } catch (e) {
      console.log({ e });
    } finally {
      setTimeout(() => {
        setMsg("");
      }, 3000);
    }
  };

  return (
    <div>
      <h1>Record Audio</h1>
      <div>
        <button onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>{" "}
        <button
          onClick={clearRecording}
          disabled={audioChunks.length > 0 ? false : true}
        >
          Clear Recording
        </button>
        <button
          disabled={audioChunks.length > 0 ? false : true}
          onClick={() =>
            uploadAudio(new Blob(audioChunks, { type: "audio/wav" }))
          }
        >
          Upload Recording
        </button>
      </div>
      <audio id="recordedAudio" controls></audio>
      {msg}
    </div>
  );
};

export default RecordAudio;
