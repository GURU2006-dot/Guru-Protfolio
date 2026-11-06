import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MESSAGE = "Don't you wanna see my face?";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
  delay: number;
}

interface PortraitPosition {
  width: number;
  height: number;
  left: number;
  top: number;
}

export default function PortraitReveal({
  dark = true,
}: {
  dark?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const startedRef = useRef(false);
  const revealRef = useRef<(() => void) | null>(null);
  const frameRef = useRef<number>(0);

  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  const [noPosition, setNoPosition] = useState({
    x: 0,
    y: 0,
  });

  // --------------------------------------------------
  // 1. START WHEN THE USER SCROLLS BACK TO THE HERO
  // --------------------------------------------------

  useEffect(() => {
    const hero = document.querySelector(".hero");

    if (!hero) {
      console.error(
        "PortraitReveal: .hero section not found. Check App.tsx."
      );
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",

      onEnterBack: () => {
        if (!startedRef.current) {
          startedRef.current = true;
          setStarted(true);
        }
      },

      markers: false,
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // --------------------------------------------------
  // 2. INTRODUCTION AND PARTICLE ANIMATION
  // --------------------------------------------------

  useEffect(() => {
    if (!started) return;

    const canvas = canvasRef.current;
    const heading = headingRef.current;

    if (!canvas || !heading) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
    });

    if (!ctx) return;

    let cancelled = false;
    let introStarted = false;
    let revealStarted = false;
    let completionTimer: number | undefined;

    let cleanupTimeline = () => {};

    const image = new Image();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // --------------------------------------------------
    // CANVAS SETUP
    // --------------------------------------------------

    const resizeCanvas = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.5
      );

      canvas.width = Math.round(
        window.innerWidth * dpr
      );

      canvas.height = Math.round(
        window.innerHeight * dpr
      );

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    // --------------------------------------------------
    // PORTRAIT POSITION
    // --------------------------------------------------

    const getPortraitPosition = (): PortraitPosition => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const mobile = screenWidth <= 768;

      const maxWidth = mobile
        ? Math.min(screenWidth * 0.62, 280)
        : Math.min(screenWidth * 0.32, 380);

      const maxHeight = screenHeight * 0.65;

      const ratio =
        image.naturalWidth / image.naturalHeight;

      const width = Math.min(
        maxWidth,
        maxHeight * ratio
      );

      const height = width / ratio;

      const centerX = mobile
        ? screenWidth * 0.5
        : screenWidth * 0.78;

      const centerY = mobile
        ? screenHeight * 0.69
        : screenHeight * 0.5;

      return {
        width,
        height,
        left: centerX - width / 2,
        top: centerY - height / 2,
      };
    };

    // --------------------------------------------------
    // PARTICLE RECONSTRUCTION
    // --------------------------------------------------

    const startParticleAnimation = () => {
      if (cancelled || revealStarted) return;

      if (
        !image.complete ||
        !image.naturalWidth ||
        !image.naturalHeight
      ) {
        console.error(
          "PortraitReveal: Image is not ready."
        );
        return;
      }

      revealStarted = true;

      const position = getPortraitPosition();

      const sampleCanvas = document.createElement("canvas");

      sampleCanvas.width = image.naturalWidth;
      sampleCanvas.height = image.naturalHeight;

      const sampleCtx = sampleCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!sampleCtx) return;

      sampleCtx.drawImage(image, 0, 0);

      const imageData = sampleCtx.getImageData(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );

      const pixels = imageData.data;

      const sampleStep = Math.max(
        4,
        Math.ceil(
          Math.sqrt(
            (image.naturalWidth * image.naturalHeight) /
              7000
          )
        )
      );

      const scale =
        position.width / image.naturalWidth;

      const particles: Particle[] = [];

      for (
        let y = 0;
        y < image.naturalHeight;
        y += sampleStep
      ) {
        for (
          let x = 0;
          x < image.naturalWidth;
          x += sampleStep
        ) {
          const index =
            (y * image.naturalWidth + x) * 4;

          const alpha = pixels[index + 3];

          if (alpha < 100) continue;

          const targetX = position.left + x * scale;
          const targetY = position.top + y * scale;

          const angle = Math.random() * Math.PI * 2;

          const distance =
            150 + Math.random() * 500;

          particles.push({
            x: targetX + Math.cos(angle) * distance,
            y: targetY + Math.sin(angle) * distance,

            targetX,
            targetY,

            color: `rgba(
              ${pixels[index]},
              ${pixels[index + 1]},
              ${pixels[index + 2]},
              ${alpha / 255}
            )`,

            size: Math.max(
              1,
              sampleStep * scale * 0.9
            ),

            delay: Math.random() * 0.25,
          });
        }
      }

      // --------------------------------------------------
      // PARTICLE MOVEMENT
      // --------------------------------------------------

      const duration = reducedMotion ? 1 : 3000;
      const startTime = performance.now();

      const render = (now: number) => {
        if (cancelled) return;

        const elapsed = now - startTime;

        const progress = Math.min(
          elapsed / duration,
          1
        );

        ctx.clearRect(
          0,
          0,
          window.innerWidth,
          window.innerHeight
        );

        for (const particle of particles) {
          const localProgress = Math.max(
            0,
            Math.min(
              1,
              (progress - particle.delay) /
                (1 - particle.delay)
            )
          );

          const eased =
            1 - Math.pow(1 - localProgress, 4);

          const x =
            particle.x +
            (particle.targetX - particle.x) * eased;

          const y =
            particle.y +
            (particle.targetY - particle.y) * eased;

          ctx.globalAlpha = Math.min(
            1,
            localProgress * 2
          );

          ctx.fillStyle = particle.color;

          ctx.fillRect(
            x,
            y,
            particle.size,
            particle.size
          );
        }

        ctx.globalAlpha = 1;

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(render);
        } else {
          // Replace particles with the sharp original photo.

          ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
          );

          ctx.drawImage(
            image,
            position.left,
            position.top,
            position.width,
            position.height
          );

          completionTimer = window.setTimeout(() => {
            if (!cancelled) {
              setCompleted(true);
            }
          }, 500);
        }
      };

      frameRef.current = requestAnimationFrame(render);
    };

    // --------------------------------------------------
    // YES BUTTON ACTION
    // --------------------------------------------------

    revealRef.current = () => {
      if (cancelled || revealStarted) return;

      cleanupTimeline();

      if (reducedMotion) {
        startParticleAnimation();
        return;
      }

      gsap.to(heading, {
        opacity: 0,
        scale: 0.9,
        y: -35,
        filter: "blur(12px)",
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => {
          if (!cancelled) {
            startParticleAnimation();
          }
        },
      });
    };

    // --------------------------------------------------
    // CHARACTER-BY-CHARACTER INTRODUCTION
    // --------------------------------------------------

    const beginIntroduction = () => {
      if (cancelled || introStarted) return;

      introStarted = true;

      const characters = heading.querySelectorAll(
        ".intro-character"
      );

      if (reducedMotion) {
        setShowChoices(true);
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          if (!cancelled) {
            setShowChoices(true);
          }
        },
      });

      timeline.fromTo(
        characters,
        {
          opacity: 0,
          y: 35,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.65,
          stagger: 0.045,
          ease: "power3.out",
        }
      );

      cleanupTimeline = () => timeline.kill();
    };

    // --------------------------------------------------
    // LOAD IMAGE
    // --------------------------------------------------

    image.onload = () => {
      if (!cancelled) {
        beginIntroduction();
      }
    };

    image.onerror = () => {
      console.error(
        "PortraitReveal: Could not load /guru.jpeg. Check the public folder."
      );
    };

    image.src = "/guru.jpeg";

    if (image.complete && image.naturalWidth > 0) {
      beginIntroduction();
    }

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------

    return () => {
      cancelled = true;

      cleanupTimeline();

      revealRef.current = null;

      cancelAnimationFrame(frameRef.current);

      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      if (completionTimer !== undefined) {
        window.clearTimeout(completionTimer);
      }
    };
  }, [started]);

  // --------------------------------------------------
  // 3. INTRODUCTION TEXT
  // --------------------------------------------------

  const words = MESSAGE.split(" ");

  return (
    <>
      {/* FINAL PORTRAIT */}

      <div
        className={`final-portrait ${
          completed ? "final-portrait-visible" : ""
        } ${dark ? "portrait-dark" : "portrait-light"}`}
      >
        <img
          src="/guru.jpeg"
          alt="Portrait of L Guru Poojith"
          draggable={false}
        />
      </div>

      {/* FULLSCREEN INTRODUCTION */}

      {started && !completed && (
        <div className="portrait-intro-overlay">
          <div className="intro-background" />

          <div
            ref={headingRef}
            className="intro-heading"
          >
            <div className="intro-small-label">
              A QUESTION FOR YOU
            </div>

            <h2 className="intro-question">
              {words.map((word, wordIndex) => (
                <span
                  className="intro-word"
                  key={wordIndex}
                >
                  {Array.from(word).map(
                    (character, characterIndex) => (
                      <span
                        key={characterIndex}
                        className="intro-character"
                      >
                        {character}
                      </span>
                    )
                  )}
                </span>
              ))}
            </h2>

            <div className="intro-accent-line" />

            {/* YES / NO BUTTONS */}

            {showChoices && (
              <div className="intro-actions">
                <button
                  className="answer-button yes-button"
                  onClick={() => revealRef.current?.()}
                  type="button"
                >
                  YES <span>❤️</span>
                </button>

                <button
                  className="answer-button no-button"
                  style={{
                    transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                  }}
                  onPointerEnter={() => {
                    setNoPosition({
                      x: Math.random() * 260 - 130,
                      y: Math.random() * 140 - 70,
                    });
                  }}
                  onPointerDown={(event) => {
                    event.preventDefault();

                    setNoPosition({
                      x: Math.random() * 260 - 130,
                      y: Math.random() * 140 - 70,
                    });
                  }}
                  onClick={(event) => event.preventDefault()}
                  type="button"
                >
                  NO <span>🙈</span>
                </button>
              </div>
            )}
          </div>

          {/* PARTICLE CANVAS */}

          <canvas
            ref={canvasRef}
            className="portrait-particle-canvas"
          />
        </div>
      )}
    </>
  );
}