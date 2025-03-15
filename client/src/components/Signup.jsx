import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper to convert an uploaded file to a data URL
function convertFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullNameAadhaar: '',
    mobile: '',
    email: '',
    password: '',
    aadhaarNumber: '',
    panNumber: '',
    passportPhoto: null,   // uploaded file
    capturedPhoto: null,   // live capture (data URL)
    audioRecording: null,
  });
  const [errors, setErrors] = useState({});
  const randomPhrase = "Please say: 'Open sesame'";
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case 'fullNameAadhaar':
        if (!value.trim()) error = "Full Name is required.";
        break;
      case 'mobile':
        if (!value.trim()) error = "Mobile Number is required.";
        else if (!/^\d{10}$/.test(value.trim()))
          error = "Enter a valid 10-digit mobile number.";
        break;
      case 'email':
        if (value.trim() && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.trim()))
          error = "Enter a valid email address.";
        break;
      case 'password':
        if (!value.trim()) error = "Password is required.";
        else if (value.trim().length < 6)
          error = "Password must be at least 6 characters.";
        break;
      case 'aadhaarNumber':
        if (!value.trim()) error = "Aadhaar Number is required.";
        else if (!/^\d{12}$/.test(value.trim()))
          error = "Aadhaar must be 12 digits.";
        break;
      case 'panNumber':
        if (!value.trim()) error = "PAN Number is required.";
        else if (value.trim().length !== 10)
          error = "PAN must be 10 characters.";
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleNext = async () => {
    if (step === 1) {
      const err1 = validateField('fullNameAadhaar', formData.fullNameAadhaar);
      const err2 = validateField('mobile', formData.mobile);
      const err3 = validateField('email', formData.email);
      const err4 = validateField('password', formData.password);
      if (err1 || err2 || err3 || err4) return;
    }
    if (step === 2) {
      const err1 = validateField('aadhaarNumber', formData.aadhaarNumber);
      const err2 = validateField('panNumber', formData.panNumber);
      if (err1 || err2) return;
    }
    if (step === 3) {
      if (!formData.passportPhoto && !formData.capturedPhoto) {
        setErrors(prev => ({ ...prev, passportPhoto: "Please provide a passport photo or capture one." }));
        return;
      }
      if (!audioURL) {
        setErrors(prev => ({ ...prev, audioRecording: "Please record audio as instructed." }));
        return;
      }
      setFormData(prev => ({ ...prev, audioRecording: audioURL }));
    }
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleVerify = async () => {
    handleNext();
  };

  const handleSubmit = async () => {
    let photoDataUrl = formData.capturedPhoto;
    if (!photoDataUrl && formData.passportPhoto) {
      photoDataUrl = await convertFileToDataUrl(formData.passportPhoto);
    }
    console.log("Signup Form Data:", formData);
    console.log("Photo to Send (Data URL):", photoDataUrl);
    console.log("Audio Recording URL:", audioURL);
    // Dummy axios call placeholder:
    // axios.post('/api/signup', { ...formData, photo: photoDataUrl })
    //   .then(response => console.log(response))
    //   .catch(error => console.error(error));
    navigate('/');
  };

  // Audio Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      let chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
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
  };

  // Live Photo Capture Functions
  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
    if (isCapturing && !formData.capturedPhoto) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCapturing, formData.capturedPhoto]);

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setFormData(prev => ({ ...prev, capturedPhoto: dataUrl }));
      setIsCapturing(false);
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleRedoPhoto = () => {
    setFormData(prev => ({ ...prev, capturedPhoto: null }));
    setIsCapturing(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-blue-50 to-red-50">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-3xl font-bold text-gradient">UBI भरोसा</h2>
        <button onClick={() => navigate('/')} className="text-lg px-4 py-2 bg-white rounded-full shadow hover:shadow-md">
          Back to Home
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[900px] p-12 min-h-[550px]">
          <h1 className="text-4xl font-bold text-center text-gradient mb-8">Sign Up</h1>
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 1: User Details Input</h2>
              <div className="space-y-5">
                <div>
                  <label className="block font-medium">Full Name (as per Aadhaar/PAN)</label>
                  <input
                    type="text"
                    name="fullNameAadhaar"
                    value={formData.fullNameAadhaar}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  {errors.fullNameAadhaar && <p className="text-red-500 text-sm mt-1">{errors.fullNameAadhaar}</p>}
                </div>
                <div>
                  <label className="block font-medium">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>
                <div>
                  <label className="block font-medium">Email Address (optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block font-medium">Set Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={handleNext} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
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
                  <label className="block font-medium">Enter Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  {errors.aadhaarNumber && <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>}
                </div>
                <div>
                  <label className="block font-medium">Enter PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={handlePrev} className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full hover:shadow-lg transition-all">
                  ← Prev
                </button>
                <button onClick={handleVerify} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                  Verify →
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 3: Identity Authentication (Facial & Audio)</h2>
              <div className="space-y-6">
                {/* Photo Section */}
                <div>
                  <label className="block font-medium mb-2">Passport Photo or Live Photo</label>
                  <div className="flex flex-col items-center space-y-4">
                    <input
                      type="file"
                      name="passportPhoto"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <div className="w-full flex justify-center">
                      {!formData.capturedPhoto && !isCapturing ? (
                        <button onClick={() => setIsCapturing(true)} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                          Capture Live Photo
                        </button>
                      ) : isCapturing && !formData.capturedPhoto ? (
                        <div className="relative w-full h-80 bg-black rounded-md overflow-hidden">
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                          <canvas ref={canvasRef} className="hidden" />
                          <button onClick={handleCapturePhoto} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                            Capture
                          </button>
                        </div>
                      ) : (
                        <div className="relative w-full h-80 rounded-md overflow-hidden">
                          <img src={formData.capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
                          <button onClick={handleRedoPhoto} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                            ReCapture
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.passportPhoto && <p className="text-red-500 text-sm mt-1">{errors.passportPhoto}</p>}
                  </div>
                </div>
                {/* Audio Section */}
                <div>
                  <label className="block font-medium mb-2">Record Audio (Say the pre-decided phrase)</label>
                  <div className="flex flex-col items-center space-y-3">
                    {!recording && !audioURL && (
                      <button onClick={startRecording} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                        Record Audio
                      </button>
                    )}
                    {recording && (
                      <button onClick={stopRecording} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                        Stop Recording
                      </button>
                    )}
                    {audioURL && (
                      <div className="flex flex-col items-center space-y-2 w-full">
                        <audio src={audioURL} controls className="w-full" />
                        <button onClick={handleRedoAudio} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                          Re-record Audio
                        </button>
                      </div>
                    )}
                    {errors.audioRecording && <p className="text-red-500 text-sm mt-1">{errors.audioRecording}</p>}
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-600">Random Phrase: {randomPhrase}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={handlePrev} className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full hover:shadow-lg transition-all">
                  ← Prev
                </button>
                <button onClick={handleNext} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                  Next →
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 4: Final Review & Submission</h2>
              <div className="space-y-4 text-lg">
                <p><strong>Full Name:</strong> {formData.fullNameAadhaar}</p>
                <p><strong>Mobile Number:</strong> {formData.mobile}</p>
                <p><strong>Email:</strong> {formData.email || 'Not Provided'}</p>
                <p><strong>Aadhaar Number:</strong> {formData.aadhaarNumber}</p>
                <p><strong>PAN Number:</strong> {formData.panNumber}</p>
                <p>
                  <strong>Photo:</strong>{" "}
                  {formData.passportPhoto
                    ? formData.passportPhoto.name
                    : formData.capturedPhoto
                    ? 'Captured Photo'
                    : 'Not Provided'}
                </p>
                <p>
                  <strong>Audio Recording:</strong>{" "}
                  {audioURL ? 'Recorded' : 'Not Provided'}
                </p>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={handlePrev} className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full hover:shadow-lg transition-all">
                  ← Prev
                </button>
                <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                  Confirm & Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
