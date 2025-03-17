/* RaiseQuery.jsx */
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Mic,
  Video,
  MessageSquare,
  CheckCircle,
  Key
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

async function convertWebmToWav(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const wavDataView = audioBufferToWav(audioBuffer);
  return new Blob([wavDataView.buffer], { type: "audio/wav" });
}

function audioBufferToWav(buffer, opt) {
  opt = opt || {};
  var numChannels = buffer.numberOfChannels;
  var sampleRate = buffer.sampleRate;
  var format = opt.float32 ? 3 : 1;
  var bitDepth = format === 3 ? 32 : 16;

  var result;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }
  var bufferLength = result.length * (bitDepth / 8);
  var wavBuffer = new ArrayBuffer(44 + bufferLength);
  var view = new DataView(wavBuffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + bufferLength, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, bufferLength, true);

  if (format === 1) {
    let offset = 44;
    for (let i = 0; i < result.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, result[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }
  return view;
}

function interleave(inputL, inputR) {
  let length = inputL.length + inputR.length;
  let result = new Float32Array(length);
  let index = 0,
    inputIndex = 0;
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

const RaiseQuery = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [submissionType, setSubmissionType] = useState("");
  const [queryText, setQueryText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [streamReady, setStreamReady] = useState(false);

  // Audio recording state and refs
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const audioRecorderRef = useRef(null);

  // Video recording state and refs
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const videoRecorderRef = useRef(null);
  const videoStreamRef = useRef(null);
  const videoPreviewRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cleanupVideoStream();
    };
  }, []);

  const cleanupVideoStream = () => {
    try {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((track) => track.stop());
        videoStreamRef.current = null;
      }
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
      setStreamReady(false);
      setRecordingVideo(false);
    } catch (error) {
      console.error("Error cleaning up video stream:", error);
    }
  };

  // --- Audio Recording Functions ---
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];
      audioRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      audioRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };
      audioRecorderRef.current.start();
      setRecordingAudio(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
      toast.error("Failed to access microphone. Please check your permissions.");
    }
  };

  const stopAudioRecording = () => {
    if (audioRecorderRef.current && recordingAudio) {
      audioRecorderRef.current.stop();
      setRecordingAudio(false);
    }
  };

  const redoAudioRecording = () => {
    setAudioBlob(null);
    setAudioURL(null);
  };

  // --- Video Recording Functions ---
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.onloadedmetadata = () => {
          videoPreviewRef.current.play().catch((err) => {
            console.error("Error playing video preview:", err);
          });
        };
      }
      videoRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp8,opus",
      });
      const chunks = [];
      videoRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      videoRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
        setVideoURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      videoRecorderRef.current.start();
      setRecordingVideo(true);
      setStreamReady(true);
    } catch (error) {
      console.error("Error starting video recording:", error);
      cleanupVideoStream();
      toast.error(
        "Failed to start recording. Please make sure you have granted camera permissions."
      );
    }
  };

  const stopVideoRecording = () => {
    if (videoRecorderRef.current && recordingVideo) {
      videoRecorderRef.current.stop();
      setRecordingVideo(false);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
      setStreamReady(false);
    }
  };

  const redoVideoRecording = () => {
    setVideoBlob(null);
    setVideoURL(null);
    cleanupVideoStream();
  };

  // --- Submit Function ---
  const handleSubmit = async () => {
    if (!submissionType) return;
    let response;
    try {
      if (submissionType === "text") {
        if (!queryText.trim()) {
          toast.error("Please enter your query text.");
          return;
        }
        response = await fetch("http://localhost:5555/ticket/add/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ data: queryText }),
        });
      } else if (submissionType === "audio") {
        if (!audioBlob) {
          toast.error("Please record your audio query.");
          return;
        }
        const wavBlob = await convertWebmToWav(audioBlob);
        const audioFile = new File([wavBlob], "audio.wav", { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioFile);

        response = await fetch("http://localhost:5555/ticket/add/audio", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
      } else if (submissionType === "video") {
        if (!videoBlob) {
          toast.error("Please record your video query.");
          return;
        }
        const videoFile = new File([videoBlob], "video.webm", { type: "video/webm" });
        const formData = new FormData();
        formData.append("video", videoFile);

        response = await fetch("http://localhost:5555/ticket/add/video", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
      }
      const result = await response.json();
      if (response.ok) {
        setTicketDetails(result.ticket);
        setShowSuccess(true);
      } else {
        toast.error("Failed to create ticket: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("An error occurred while submitting your query. Please try again.");
    }
  };

  const renderVideoRecording = () => (
    <div className="mt-8 text-center">
      {recordingVideo && !videoURL ? (
        <div className="flex flex-col items-center space-y-2 w-full">
          <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden">
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={stopVideoRecording}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all"
          >
            Stop Recording
          </button>
        </div>
      ) : videoURL ? (
        <div className="flex flex-col items-center space-y-2 w-full">
          <div className="w-full h-64 bg-black rounded-xl overflow-hidden">
            <video src={videoURL} controls autoPlay className="w-full h-full object-cover" />
          </div>
          <button
            onClick={redoVideoRecording}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all"
          >
            Re-record Video
          </button>
        </div>
      ) : (
        <button
          onClick={startVideoRecording}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all"
        >
          Record Video
        </button>
      )}
      <p className="mt-2 text-sm text-gray-600">
        Please record in a well‑lit environment and ensure minimal background distractions.
      </p>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="bg-white max-w-2xl mx-auto p-8 rounded-3xl shadow-xl">
            <div className="text-center">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">
                Service Ticket Created!
              </h2>
              <p className="text-gray-600 text-lg">
                Your ticket number is: {ticketDetails?.ticketID}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Summary of the Query
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Submission Type:</strong> {ticketDetails?.type}
                </p>
                <p className="text-gray-700">
                  <strong>Department Allotted:</strong> {ticketDetails?.department}
                </p>
                <p className="text-gray-700">
                  <strong>Transcript:</strong> {ticketDetails?.transcript}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/appointment/instant")}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:shadow-md transition-all"
              >
                Book Instant Appointment
              </button>
              <button
                onClick={() => navigate("/appointment/schedule")}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:shadow-md transition-all"
              >
                Book Future Appointment
              </button>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/my-queries"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                View All Queries
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="bg-white max-w-2xl mx-auto p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-6">
            How would you like to submit your query?
          </h2>
          <div className="space-y-4">
            <button
              className={`w-full p-6 text-left transition-all transform hover:scale-102 rounded-2xl ${
                submissionType === "text"
                  ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-100"
              }`}
              onClick={() => setSubmissionType("text")}
            >
              <div className="flex items-center space-x-4">
                <MessageSquare
                  className={`h-6 w-6 ${
                    submissionType === "text" ? "text-white" : "text-blue-600"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-semibold">Text Message</span>
                  <span
                    className={`text-sm md:text-base ${
                      submissionType === "text" ? "text-gray-100" : "text-gray-600"
                    }`}
                  >
                    Type your query in detail
                  </span>
                </div>
              </div>
            </button>

            <button
              className={`w-full p-6 text-left transition-all transform hover:scale-102 rounded-2xl ${
                submissionType === "audio"
                  ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-100"
              }`}
              onClick={() => setSubmissionType("audio")}
            >
              <div className="flex items-center space-x-4">
                <Mic
                  className={`h-6 w-6 ${
                    submissionType === "audio" ? "text-white" : "text-blue-600"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-semibold">Voice Message</span>
                  <span
                    className={`text-sm md:text-base ${
                      submissionType === "audio" ? "text-gray-100" : "text-gray-600"
                    }`}
                  >
                    Record an audio message
                  </span>
                </div>
              </div>
            </button>

            <button
              className={`w-full p-6 text-left transition-all transform hover:scale-102 rounded-2xl ${
                submissionType === "video"
                  ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-100"
              }`}
              onClick={() => setSubmissionType("video")}
            >
              <div className="flex items-center space-x-4">
                <Video
                  className={`h-6 w-6 ${
                    submissionType === "video" ? "text-white" : "text-blue-600"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-semibold">Video Call</span>
                  <span
                    className={`text-sm md:text-base ${
                      submissionType === "video" ? "text-gray-100" : "text-gray-600"
                    }`}
                  >
                    Start a video consultation
                  </span>
                </div>
              </div>
            </button>
          </div>

          {submissionType === "text" && (
            <div className="mt-8">
              <textarea
                className="w-full h-32 p-4 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                placeholder="Please describe your query in detail..."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
              />
            </div>
          )}

          {submissionType === "audio" && (
            <div className="mt-8 text-center">
              {recordingAudio && !audioURL ? (
                <div className="flex flex-col items-center space-y-4 w-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full animate-ping"></div>
                    <span className="text-sm text-gray-600">Recording audio...</span>
                  </div>
                  <button
                    onClick={stopAudioRecording}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all"
                  >
                    Stop Recording
                  </button>
                </div>
              ) : !audioURL ? (
                <button
                  onClick={startAudioRecording}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  Record Audio
                </button>
              ) : (
                <div className="flex flex-col items-center space-y-2 w-full">
                  <audio src={audioURL} controls className="w-full" />
                  <button
                    onClick={redoAudioRecording}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all"
                  >
                    Re-record Audio
                  </button>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-600">
                Please record in a quiet environment with minimal background noise.
              </p>
            </div>
          )}

          {submissionType === "video" && renderVideoRecording()}

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="w-full group flex items-center justify-center bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 px-8 rounded-full text-lg font-medium transition-all transform hover:scale-102 hover:shadow-xl"
            >
              Submit Query
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseQuery;
