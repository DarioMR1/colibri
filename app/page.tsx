"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useMemo, ReactElement } from "react";

export default function Home() {
  const [showTitle, setShowTitle] = useState(true);
  const [fallingWordElements, setFallingWordElements] = useState<
    ReactElement[]
  >([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  // Detector de dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Comprobar inicialmente
    checkMobile();

    // Actualizar cuando cambia el tamaño de la ventana
    window.addEventListener("resize", checkMobile);

    // Limpiar el evento
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lista de palabras relacionadas con las características del colibrí - usando useMemo
  const fallingWords = useMemo(
    () => [
      "Cambio",
      "Fortaleza",
      "Persistencia",
      "Bondad",
      "Adaptabilidad",
      "Transformación",
      "Resistencia",
      "Dedicación",
      "Amor",
      "Superación",
      "Migración",
      "Constancia",
      "Renovación",
      "Energía",
      "Esperanza",
    ],
    []
  );

  // Función para generar una posición horizontal aleatoria
  const randomPosition = useCallback(() => {
    return Math.floor(Math.random() * 80) + 10; // entre 10% y 90% del ancho
  }, []);

  // Función para generar un tamaño de fuente aleatorio - ajustado para móviles
  const randomSize = useCallback(() => {
    return isMobile
      ? Math.floor(Math.random() * 16) + 12 // entre 12px y 28px en móvil
      : Math.floor(Math.random() * 24) + 16; // entre 16px y 40px en escritorio
  }, [isMobile]);

  // Colores temáticos - usando useMemo
  const colors = useMemo(
    () => [
      "#0077b6",
      "#d62828",
      "#588157",
      "#e76f51",
      "#457b9d",
      "#6a994e",
      "#bc6c25",
    ],
    []
  );

  // Función para generar un color aleatorio entre los colores temáticos
  const randomColor = useCallback(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, [colors]);

  // Función para crear una nueva palabra que cae
  const createFallingWord = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * fallingWords.length);
    const word = fallingWords[wordIndex];
    const id = Date.now().toString(); // Identificador único

    return (
      <div
        key={id}
        className="falling-word"
        style={{
          left: `${randomPosition()}%`,
          fontSize: `${randomSize()}px`,
          color: randomColor(),
        }}
        onAnimationEnd={() => {
          // Eliminar esta palabra cuando termine su animación
          setFallingWordElements((prev) => prev.filter((el) => el.key !== id));
        }}
      >
        {word}
      </div>
    );
  }, [fallingWords, randomPosition, randomSize, randomColor]);

  useEffect(() => {
    // Activamos la animación del fondo
    const div = document.getElementById("background");
    if (div) {
      div.classList.add("animate-background");
    }

    // Activamos la animación del colibrí inmediatamente
    const colibri = document.getElementById("colibri");
    if (colibri) {
      colibri.classList.add("animate-zigzag");
    }

    // Después de unos segundos ocultamos el título
    const titleTimer = setTimeout(() => {
      setShowTitle(false);

      // Comenzar a añadir palabras que caen en intervalos
      const wordInterval = setInterval(() => {
        setFallingWordElements((prev) => {
          // Limitar a 20 palabras simultáneas como máximo para evitar sobrecarga
          if (prev.length >= 20) return prev;
          return [...prev, createFallingWord()];
        });
      }, 800); // Intervalo entre apariciones de palabras

      // Mostrar el mensaje final después de 10 segundos
      const finalMessageTimer = setTimeout(() => {
        setShowFinalMessage(true);
      }, 10000); // 10 segundos después de empezar la lluvia de palabras

      // Limpiar el intervalo y los temporizadores cuando se desmonte el componente
      return () => {
        clearInterval(wordInterval);
        clearTimeout(finalMessageTimer);
      };
    }, 6000); // 6 segundos para el título

    return () => {
      clearTimeout(titleTimer);
    };
  }, [createFallingWord]);

  // Efecto para manejar el audio
  useEffect(() => {
    // Crear el elemento de audio
    const audio = new Audio("/rain.wav");
    audio.loop = true;
    setAudioElement(audio);

    // Intentar reproducir automáticamente
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.log("Reproducción automática bloqueada:", error);
        // El audio necesitará interacción del usuario
      });

    // Limpiar cuando el componente se desmonte
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Función para manejar la reproducción
  const toggleAudio = useCallback(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play().catch((error) => {
          console.log("Error al reproducir el audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, audioElement]);

  return (
    <div
      id="background"
      className="min-h-screen p-4 md:p-8 flex items-center justify-center overflow-hidden relative"
      style={{
        backgroundImage: "url('/lluvia.svg')",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // Esto ayuda a manejar el escenario en dispositivos móviles
      }}
    >
      {/* Botón personalizado para controlar el audio */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center space-x-2"
      >
        {isPlaying ? (
          <>
            <span className="material-icons">pause</span>
            <span>Pausar Música</span>
          </>
        ) : (
          <>
            <span className="material-icons">play_arrow</span>
            <span>Reproducir Lluvia</span>
          </>
        )}
      </button>

      {showTitle && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center max-w-xs md:max-w-3xl p-4 md:p-8 backdrop-blur-sm animate-fade-in">
            <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 text-[#333] dark:text-[#f0f0f0] text-shadow">
              El Colibrí 🕊️✨
            </h1>
            <p className="text-md md:text-xl mb-3 md:mb-4 text-[#555] dark:text-[#d0d0d0] leading-relaxed text-shadow">
              Un símbolo de{" "}
              <span className="font-semibold text-[#0077b6]">cambio</span>,
              <span className="font-semibold text-[#d62828]"> fortaleza</span>,
              <span className="font-semibold text-[#588157]">
                {" "}
                persistencia
              </span>{" "}
              y<span className="font-semibold text-[#e76f51]"> bondad</span>.
            </p>
            <p className="text-sm md:text-lg text-[#666] dark:text-[#c0c0c0] italic text-shadow">
              &ldquo;Guerrero silencioso, viajero del alma, y símbolo universal
              de luz, superación y amor&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Mensaje final inspirador */}
      {showFinalMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center max-w-xs md:max-w-3xl p-4 md:p-8 bg-gradient-to-b from-transparent via-black/60 to-transparent backdrop-blur-sm rounded-xl animate-rise">
            <p className="text-xl md:text-4xl font-bold mb-2 md:mb-4 text-white text-shadow-strong">
              &ldquo;No soy solo quien observa al colibrí...
            </p>
            <p className="text-lg md:text-3xl font-bold mb-3 md:mb-6 text-white text-shadow-strong">
              Soy el colibrí mismo.&rdquo;
            </p>
            <p className="text-sm md:text-xl text-white/90 leading-relaxed">
              Como él, transformo desafíos en vuelos imposibles.
              <br />
              Como él, mi fuerza no se mide por mi tamaño, sino por mi
              determinación.
              <br />
              Como él, persisto cuando otros abandonan.
              <br />
              Como él, encuentro dulzura incluso en los jardines más arduos.
            </p>
          </div>
        </div>
      )}

      {/* Contenedor para las palabras que caen */}
      <div className="absolute inset-0 overflow-hidden z-5">
        {fallingWordElements}
      </div>

      <main className="flex items-center justify-center relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            id="colibri"
            className="animate-flutter"
            src="/Recurso 1.svg"
            alt="Recurso 1 logo"
            width={isMobile ? 120 : 180} // Tamaño más pequeño en móviles
            height={isMobile ? 25 : 38}
            priority
          />
        </div>
      </main>
    </div>
  );
}
