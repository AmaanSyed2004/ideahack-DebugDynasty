import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Helper to convert dataURL to File
const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [livePhoto, setLivePhoto] = useState(null);
  const [isEmployee, setIsEmployee] = useState(false); // NEW: state for employee checkbox
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const validateField = (name, value) => {
    let error = "";
    if (name === 'identifier' && !value.trim())
      error = "Email or Mobile Number is required.";
    if (name === 'password' && !value.trim())
      error = "Password is required.";
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'isEmployee') {
      setIsEmployee(checked);
    } else {
      setCredentials(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Modified: if the "I am an Employee" box is checked, immediately redirect to employee login.
  const handleCredentialsSubmit = () => {
    const err1 = validateField('identifier', credentials.identifier);
    const err2 = validateField('password', credentials.password);
    if (err1 || err2) return;
    
    if(isEmployee) {
      // Redirect to the employee login component/route
      navigate('/employee/dashboard');
      return;
    }
    
    setStep(2);
  };

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
    if (step === 2 && !livePhoto) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step, livePhoto]);

  const handleCaptureLivePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
      setLivePhoto(dataUrl);
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleRedo = () => {
    setLivePhoto(null);
    setStep(2);
  };

  const handleFaceAuth = async () => {
    try {
      const formData = new FormData();
      formData.append('password', credentials.password);
      // Send identifier as email or phoneNumber based on its content
      if (credentials.identifier.includes('@')) {
        formData.append('email', credentials.identifier);
      } else {
        formData.append('phoneNumber', credentials.identifier);
      }
      if (!livePhoto) {
        console.error("No live photo captured");
        alert("No live photo captured");
        return;
      }
      // Convert livePhoto (JPEG) to File named "face.jpg"
      const faceFile = dataURLtoFile(livePhoto, "face.jpg");
      formData.append('face_img', faceFile);
      console.log("Sending login request with formData:", formData);
      const response = await fetch("http://localhost:5555/auth/login", {
        method: "POST",
        credentials: 'include',
        body: formData
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("Login error:", result);
        alert("Login failed: " + result.message);
        return;
      }
      console.log("Login successful:", result);
      localStorage.setItem("isLoggedIn", "true");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-blue-100 to-red-50">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-3xl font-bold text-gradient">UBI भरोसा</h2>
        <button onClick={() => navigate('/')} className="text-lg px-4 py-2 bg-white rounded-full shadow hover:shadow-md">
          Back to Home
        </button>
      </div>
      <div className="flex-1 relative top-[-25px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-b from-white to-gray-50 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-[900px] p-12 max-h-[85vh] overflow-y-auto my-8"
        >
          <h1 className="text-4xl font-bold text-center text-gradient mb-8 pb-2">Login</h1>
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 1: Enter Credentials</h2>
              <div className="space-y-5">
                <div>
                  <label className="block font-medium">Email or Mobile Number</label>
                  <input
                    type="text"
                    name="identifier"
                    value={credentials.identifier}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
                </div>
                <div>
                  <label className="block font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="isEmployee" 
                    checked={isEmployee} 
                    onChange={handleChange} 
                    className="mr-2" 
                  />
                  <span className="text-sm">I am an Employee</span>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={handleCredentialsSubmit} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                  Login →
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 2: Facial Authentication</h2>
              <p className="mb-4 text-gray-600">
                Please capture a live photo using your camera. Upload is not allowed.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Ensure your face is well-lit and you're looking straight into the camera for accurate verification.
              </p>
              <div className="relative w-full h-80 bg-black rounded-md overflow-hidden">
                {!livePhoto ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={livePhoto} alt="Live Capture" className="w-full h-full object-cover" />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="mt-4 flex justify-center">
                {!livePhoto ? (
                  <button onClick={handleCaptureLivePhoto} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                    Capture Live Photo
                  </button>
                ) : (
                  <button onClick={handleRedo} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                    ReCapture
                  </button>
                )}
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="px-8 py-3 bg-gray-300 text-gray-800 rounded-full hover:shadow-lg transition-all">
                  ← Prev
                </button>
                <button onClick={handleFaceAuth} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all">
                  Proceed →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
