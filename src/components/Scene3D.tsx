import { useEffect, useRef, useState } from "react";

export default function Scene3D({ dark = true }: { dark?: boolean }) {
  const [stage, setStage] = useState<"hidden" | "message" | "revealed">(
    "hidden"
  );

  const touchStartY = useRef(0);
  const triggered = useRef(false);

  useEffect(() => {
    let revealTimer: number | undefined;

    const revealPortrait = () => {
      if (triggered.current) return;

      triggered.current = true;
      setStage("message");

      revealTimer = window.setTimeout(() => {
        setStage("revealed");
      }, 1600);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY < -8) {
        revealPortrait();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0].clientY;

      if (currentY > touchStartY.current + 12) {
        revealPortrait();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);

      if (revealTimer) {
        window.clearTimeout(revealTimer);
      }
    };
  }, []);

  return (
    <div className={`hero-3d cinematic-intro ${dark ? "portrait-dark" : "portrait-light"}`}>

      {/* Intro message */}
      <div
        className={`portrait-message ${
          stage === "message" ? "message-visible" : ""
        }`}
        aria-live="polite"
      >
        <span className="message-small">A LITTLE CURIOSITY...</span>

        <h2>
          Don't you want
          <br />
          to see <span>my face?</span>
        </h2>

        <div className="message-line" />
      </div>

      {/* Portrait */}
      <div
        className={`portrait-reveal ${
          stage === "revealed" ? "portrait-visible" : ""
        }`}
      >
        <div className="portrait-glow" />

        <div className="portrait-frame">
          <img
            src="/guru.jpeg"
            alt="Portrait of L Guru Poojith"
            className="portrait-image"
            draggable={false}
          />
        </div>

        <div className="portrait-caption">
          <span className="portrait-status-dot" />
          <span>L GURU POOJITH</span>
        </div>
      </div>

    </div>
  );
}