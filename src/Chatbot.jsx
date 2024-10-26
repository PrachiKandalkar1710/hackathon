import React, { useState, useRef , useEffect} from "react";
import { FaRobot } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { FaCamera } from "react-icons/fa";
const ChatInterface = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload only image files");
        return;
      }
      setSelectedFile(file);
      setUploadStatus("uploading");
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("your-upload-url", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          setUploadStatus("success");
          console.log("File uploaded successfully");
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        setUploadStatus("error");
        console.error("Upload error:", error);
        alert("Failed to upload file. Please try again.");
      }
    }
  };
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(mediaStream);
      console.log("Media Stream -->", mediaStream);
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Failed to access camera. Please make sure you have granted camera permissions."
      );
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(
        async (blob) => {
          const file = new File([blob], "camera-capture.jpg", {
            type: "image/jpeg",
          });
          setSelectedFile(file);
          setUploadStatus("uploading");
          try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("your-upload-url", {
              method: "POST",
              body: formData,
            });
            if (response.ok) {
              setUploadStatus("success");
              stopCamera();
            } else {
              throw new Error("Upload failed");
            }
          } catch (error) {
            setUploadStatus("error");
            console.error("Upload error:", error);
            alert("Failed to upload captured photo. Please try again.");
          }
        },
        "image/jpeg",
        0.8
      );
    }
  };
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${isMinimized ? "hidden" : "flex" } flex-col bg-gray-100 rounded-lg shadow-xl w-[380px] h-[600px]`}>
        <div className="bg-white p-4 flex items-center justify-between rounded-t-lg border-b">
          <div className="flex items-center space-x-3">
            <img src="/api/placeholder/40/40" alt="Web Bot" className="w-10 h-10 rounded-full"/>
            <div>
              <h1 className="font-semibold text-gray-800">Web Bot</h1>
              <p className="text-sm text-gray-600">+91 XXXXXXXXXX</p>
            </div>
          </div>
          <button onClick={() => setIsMinimized(true)} className="text-gray-500 hover:text-gray-700">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg> */}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showCamera && (
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <button
                  onClick={capturePhoto}
                  className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                >
                  <FaCamera size={24} className="text-purple-600" />
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-red-500 p-2 rounded-full shadow-lg hover:bg-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col max-w-[80%]">
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="text-gray-800">
                Awesome! You can start the conversation on our website or
                WhatsApp and switch between them anytime, whichever works best
                for you. Where would you like to begin?
              </p>
              <div className="mt-3 flex space-x-3">
                <button className="px-4 py-1 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                  Web
                </button>
                <button className="px-4 py-1 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                  WhatsApp
                </button>
              </div>
            </div>
            <span className="text-xs text-gray-500 mt-1">07:52 AM</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-green-100 rounded-lg p-3 max-w-[80%]">
              <p className="text-gray-800">Web</p>
            </div>
            <span className="text-xs text-gray-500 mt-1">07:52 AM</span>
          </div>
          <div className="flex flex-col max-w-[80%]">
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="text-gray-800">
                I'm your new digital buddy, here to play a quick game of quiz
                and share some cool facts with you. developed by the innovative
                team at AssessHub, I'm all set to make our chat not just
                informative but super engaging too. So, let's dive in and get
                started—let the fun begin! 🚀
              </p>
            </div>
            <span className="text-xs text-gray-500 mt-1">07:52 AM</span>
          </div>
          <div className="flex flex-col max-w-[80%]">
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="text-gray-800">
                Why is it that round pizzas come in square boxes?
              </p>
            </div>
            <span className="text-xs text-gray-500 mt-1">07:52 AM</span>
          </div>
          {selectedFile && (
            <div className="flex flex-col items-end">
              <div className="bg-green-100 rounded-lg p-3 max-w-[80%]">
                <p className="text-gray-800">Selected: {selectedFile.name}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">Just now</span>
            </div>
          )}
          {uploadStatus === "success" && (
            <div className="flex flex-col items-end">
              <div className="bg-green-100 rounded-lg p-3 max-w-[80%]">
                <p className="text-gray-800">Upload successful!</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">Just now</span>
            </div>
          )}
          {uploadStatus === "error" && (
            <div className="flex flex-col items-end">
              <div className="bg-red-100 rounded-lg p-3 max-w-[80%]">
                <p className="text-gray-800">
                  Upload failed. Please try again.
                </p>
              </div>
              <span className="text-xs text-gray-500 mt-1">Just now</span>
            </div>
          )}
        </div>
        <div className="bg-white p-4 border-t rounded-b-lg flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
          <input
            type="text"
            placeholder="Type Message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
            onClick={startCamera}
          >
            <FaCamera size={24} />
          </button>
          <button
            className={`p-2 text-purple-600 hover:bg-purple-50 rounded-full relative ${
              uploadStatus === "uploading"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => fileInputRef.current.click()}
            disabled={uploadStatus === "uploading"}
          >
            <GrGallery size={24} />
            {uploadStatus === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              </div>
            )}
          </button>
          <button className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        >
          <FaRobot size={34} />
        </button>
      )}
    </div>
  );
};

export default ChatInterface;
