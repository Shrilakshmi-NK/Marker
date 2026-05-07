import React from "react";
import { VideoProvider } from "./features/videos/context/VideoContext";
import HomePage from "./features/videos/pages/HomePage";
import "./App.css";

function App() {
  return (
    <VideoProvider>
      <HomePage />
    </VideoProvider>
  );
}

export default App;
