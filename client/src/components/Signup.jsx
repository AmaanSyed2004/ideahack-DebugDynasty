/* Signup.jsx */
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  Lock,
  IdCard,
  CreditCard,
  Camera,
  Mic,
  Loader2,
  Key
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

// Helper: Convert an uploaded file to a data URL
function convertFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper: Convert dataURL to File (with .jpg extension)
const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

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
  var headerLength = 44;
  var totalLength = headerLength + bufferLength;
  var arrayBuffer = new ArrayBuffer(totalLength);
  var view = new DataView(arrayBuffer);

  function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + bufferLength, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, (sampleRate * numChannels * bitDepth) / 8, true);
  view.setUint16(32, (numChannels * bitDepth) / 8, true);
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
  let index = 0;
  let inputIndex = 0;
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <Loader2 className="animate-spin text-blue-600" size={32} />
  </div>
);
// Instead of displaying a "random phrase" label, we show a single line that reads:
const phrase = "My voice is my password. Verify me. The quick brown fox jumps over the lazy dog";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullNameAadhaar: "",
    mobile: "",
    email: "",
    password: "",
    aadhaarNumber: "",
    panNumber: "",
    passportPhoto: null,
    audioRecording: null
  });
  const [errors, setErrors] = useState({});
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  // OTP-related state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullNameAadhaar":
        if (!value.trim()) error = "Full Name is required.";
        break;
      case "mobile":
        if (!value.trim()) error = "Mobile Number is required.";
        else if (!/^\d{10}$/.test(value.trim()))
          error = "Enter a valid 10-digit mobile number.";
        break;
      case "email":
        if (value.trim() && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(value.trim()))
          error = "Enter a valid email address.";
        break;
      case "password":
        if (!value.trim()) error = "Password is required.";
        else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{6,}$/.test(
            value.trim()
          )
        )
          error =
            "Password must be at least 6 characters and include uppercase, lowercase, a number, and a symbol.";
        break;
      case "aadhaarNumber":
        if (!value.trim()) error = "Aadhaar Number is required.";
        else if (!/^\d{12}$/.test(value.trim()))
          error = "Aadhaar must be 12 digits.";
        break;
      case "panNumber":
        if (!value.trim()) error = "PAN Number is required.";
        else if (!/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(value.trim()))
          error = "Enter a valid PAN number (e.g., ABCDE1234F).";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "passportPhoto") {
        setFormData((prev) => ({ ...prev, passportPhoto: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleNext = async () => {
    if (step === 1) {
      const err1 = validateField("fullNameAadhaar", formData.fullNameAadhaar);
      const err2 = validateField("mobile", formData.mobile);
      const err3 = validateField("email", formData.email);
      const err4 = validateField("password", formData.password);
      if (err1 || err2 || err3 || err4) return;
    }
    if (step === 2) {
      const err1 = validateField("aadhaarNumber", formData.aadhaarNumber);
      const err2 = validateField("panNumber", formData.panNumber);
      if (err1 || err2) return;
      if (!otpVerified) {
        toast.error("Please verify your phone number via OTP before continuing.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.passportPhoto) {
        setErrors((prev) => ({ ...prev, passportPhoto: "Please provide a passport photo." }));
        return;
      }
      if (!audioURL) {
        setErrors((prev) => ({ ...prev, audioRecording: "Please record audio as instructed." }));
        return;
      }
      setFormData((prev) => ({ ...prev, audioRecording: audioURL }));
    }
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleVerify = async () => {
    handleNext();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let photoFile = formData.passportPhoto;
      if (!audioBlob) {
        toast.error("Please record audio as instructed.");
        return;
      }
      const wavBlob = await convertWebmToWav(audioBlob);
      const audioFile = new File([wavBlob], "audio.wav", { type: "audio/wav" });

      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullNameAadhaar);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("phoneNumber", formData.mobile);
      formDataToSend.append("face_img", photoFile);
      formDataToSend.append("role", "customer");
      formDataToSend.append("audio", audioFile);

      const response = await fetch("http://localhost:5555/auth/register", {
        method: "POST",
        body: formDataToSend,
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("Signup error:", result);
        toast.error("Signup failed: " + result.message);
        return;
      }
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred during signup. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      let chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);
        setAudioURL(url);
        setAudioBlob(recordedBlob);
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
      toast.error("Error starting audio recording.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleRedoAudio = () => {
    setAudioURL(null);
    setAudioBlob(null);
  };

  const handleRemoveUploadedPhoto = () => {
    setFormData((prev) => ({ ...prev, passportPhoto: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // OTP functions using toasts instead of alerts
  const sendOTP = async () => {
    if (!formData.mobile) {
      toast.error("Please fill in your mobile number in Step 1 first.");
      return;
    }
    setLoading(true);
    try {
      const phoneWithCountry = "+91" + formData.mobile;
      const res = await axios.post("http://localhost:5555/auth/otp/send-otp", {
        phoneNumber: phoneWithCountry,
      });
      if (res.data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully to " + phoneWithCountry);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const phoneWithCountry = "+91" + formData.mobile;
      const res = await axios.post("http://localhost:5555/auth/otp/verify-otp", {
        phoneNumber: phoneWithCountry,
        code: otp,
      });
      if (res.data.success) {
        setOtpVerified(true);
        toast.success("OTP verified successfully.");
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-blue-100 to-red-50 font-roboto relative">
      <Toaster position="top-right" />
      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-3xl font-bold text-gradient">UBI भरोसा</h2>
        <button
          onClick={() => navigate("/")}
          className="text-lg px-4 py-2 bg-white rounded-full shadow hover:shadow-md"
        >
          Back to Home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto relative bg-white rounded-2xl shadow-2xl w-full max-w-[900px] px-12 pt-8 pb-4 max-h-[85vh] overflow-y-auto"
        >
          {loading && (
            <div className="absolute inset-0 bg-white opacity-75 flex items-center justify-center z-50">
              <LoadingSpinner />
            </div>
          )}

          <h1 className="text-4xl font-bold text-center text-gradient mb-8">Sign Up</h1>
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 1: User Details Input</h2>
              <div className="space-y-5">
                <div>
                  <label className="block font-medium text-lg">
                    Full Name (as per Aadhaar/PAN)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="fullNameAadhaar"
                      value={formData.fullNameAadhaar}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  {errors.fullNameAadhaar && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullNameAadhaar}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-lg">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-lg">Email Address (optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-lg">Set Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full pl-10 p-3 pr-12 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 2: Aadhaar & PAN Verification</h2>
              <div className="space-y-5">
                <div>
                  <label className="block font-medium text-lg">Enter Aadhaar Number</label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  {errors.aadhaarNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-lg">Enter PAN Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  {errors.panNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4 relative right-[16px] p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <button
                    onClick={sendOTP}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:bg-blue-700 transition"
                  >
                    Send OTP
                  </button>
                  {otpSent && <span className="text-green-600 font-medium">OTP Sent!</span>}
                </div>
                {otpSent && (
                  <div className="space-y-3">
                    <label className="block text-lg font-medium">Enter OTP:</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-md"
                      />
                    </div>
                    <button
                      onClick={verifyOTP}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
                {otpVerified && (
                  <p className="text-green-700 font-semibold">Phone Verified Successfully!</p>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePrev}
                  className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full hover:shadow-lg transition"
                >
                  ← Prev
                </button>
                <button
                  onClick={handleVerify}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition"
                >
                  Verify →
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 3: Identity Authentication (Facial & Audio)</h2>
              <div className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block font-medium mb-2">
                    Upload Passport Photo{" "}
                    <Camera className="inline ml-1" size={18} />
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="passportPhoto"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  {formData.passportPhoto && (
                    <div className="flex flex-col items-center">
                      <img
                        src={URL.createObjectURL(formData.passportPhoto)}
                        alt="Uploaded"
                        className="w-full h-80 object-cover rounded-md"
                      />
                      <button
                        onClick={handleRemoveUploadedPhoto}
                        className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition"
                      >
                        Remove Uploaded Photo
                      </button>
                    </div>
                  )}
                  {errors.passportPhoto && (
                    <p className="text-red-500 text-sm mt-1">{errors.passportPhoto}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    Ensure your face is clearly visible and well-lit.
                  </p>
                </div>

                {/* Audio Recording */}
                <div>
                  <label className="block font-medium mb-2">
                    Record Audio (Say the following)
                  </label>
                  <div className="flex flex-col items-center space-y-3">
                    {!recording && !audioURL && (
                      <button
                        onClick={startRecording}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition"
                      >
                        <Mic className="inline mr-2" size={20} /> Record Audio
                      </button>
                    )}
                    {recording && (
                      <button
                        onClick={stopRecording}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition"
                      >
                        <Mic className="inline mr-2" size={20} /> Stop Recording
                      </button>
                    )}
                    {audioURL && (
                      <div className="flex flex-col items-center space-y-2 w-full">
                        <audio src={audioURL} controls className="w-full" />
                        <button
                          onClick={handleRedoAudio}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition"
                        >
                          <Mic className="inline mr-2" size={20} /> Re-record Audio
                        </button>
                      </div>
                    )}
                    {errors.audioRecording && (
                      <p className="text-red-500 text-sm mt-1">{errors.audioRecording}</p>
                    )}
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-600">Say "{phrase}"</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Please record in a quiet environment and speak clearly.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePrev}
                  className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full hover:shadow-lg transition"
                >
                  ← Prev
                </button>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 4: Final Review & Submission</h2>
              <div className="bg-gray-50 rounded-lg shadow p-6 space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Full Name:</span>
                  <span>{formData.fullNameAadhaar}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Mobile Number:</span>
                  <span>{formData.mobile}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Email:</span>
                  <span>{formData.email || "Not Provided"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Aadhaar Number:</span>
                  <span>{formData.aadhaarNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">PAN Number:</span>
                  <span>{formData.panNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Photo:</span>
                  <span>{formData.passportPhoto ? formData.passportPhoto.name : "Not Provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Audio Recording:</span>
                  <span>{audioURL ? "Recorded" : "Not Provided"}</span>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePrev}
                  className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full hover:shadow-lg transition"
                >
                  ← Prev
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
