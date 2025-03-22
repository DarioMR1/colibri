"use client";

import { useState, useEffect } from "react";
import styles from "./IntroSlide.module.css";

export default function IntroSlide({ onComplete }: { onComplete: () => void }) {
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);

  useEffect(() => {
    // Secuencia de aparición de textos más rápida
    const timer1 = setTimeout(() => setShowText1(true), 100);
    const timer2 = setTimeout(() => setShowText2(true), 2000);
    const timer3 = setTimeout(() => setShowText3(true), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleVideoEnd = () => {
    // Llamar a onComplete inmediatamente cuando termine el video
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <video
        className="w-full h-full object-cover"
        src="/leon-colibri.mp4"
        autoPlay
        muted
        onEnded={handleVideoEnd}
      />

      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
        {showText1 && (
          <h2
            className={`text-4xl md:text-6xl text-white font-bold mb-8 ${styles.fadeIn}`}
          >
            Muchos eligen al León como su animal interior...
          </h2>
        )}

        {showText2 && (
          <p
            className={`text-2xl md:text-4xl text-white mb-8 ${styles.fadeIn}`}
          >
            Símbolo de fuerza y poder...
          </p>
        )}

        {showText3 && (
          <p
            className={`text-3xl md:text-5xl text-white font-bold ${styles.fadeIn}`}
          >
            Pero yo encontré mi fuerza en el Colibrí
          </p>
        )}
      </div>
    </div>
  );
}
