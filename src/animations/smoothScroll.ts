
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  const updateScroll = () => {
    ScrollTrigger.update();
  };

  const updateLenis = (time: number) => {
    lenis.raf(time * 1000);
  };

  lenis.on("scroll", updateScroll);

  gsap.ticker.add(updateLenis);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(updateLenis);
    lenis.off("scroll", updateScroll);
    lenis.destroy();
  };
}
