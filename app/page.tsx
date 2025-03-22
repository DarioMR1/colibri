"use client";

import { useState } from "react";
import IntroSlide from "./components/IntroSlide";
import MainContent from "./components/MainContent"; // Vamos a mover el contenido principal a un nuevo componente

export default function Home() {
  const [showMainContent, setShowMainContent] = useState(false);

  const handleIntroComplete = () => {
    setShowMainContent(true);
  };

  return (
    <>
      {!showMainContent && <IntroSlide onComplete={handleIntroComplete} />}
      {showMainContent && <MainContent />}
    </>
  );
}
