import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/Login"; // Adjust path if needed
import Dashboard from "./components/Dashboard";
import VideoDetails from "./components/VideoDetails";
import CreationMode from "./components/CreationMode"; 
import AIVideoStudio from "./components/AIVideoStudio";
import AICreationStudio from "./components/AICreationStudio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/video-details" element={<VideoDetails />} />
         <Route path="/creation-mode" element={<CreationMode />} />
         <Route path="/ai-video-studio" element={<AIVideoStudio />} /> 
         <Route path="/ai-creation-studio" element={<AICreationStudio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
