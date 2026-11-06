
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  const context = gsap.context(() => {

    // Hero entrance animation
    const heroTimeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    heroTimeline
      .from(".availability", {
        opacity: 0,
        y: 20,
        duration: 0.7,
      })
      .from(
        ".hero-small",
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
        },
        "-=0.3"
      )
      .from(
        ".hero h1",
        {
          opacity: 0,
          y: 70,
          duration: 1,
        },
        "-=0.2"
      )
      .from(
        ".hero-bottom",
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
        },
        "-=0.4"
      )
      .from(
        ".hero-meta",
        {
          opacity: 0,
          duration: 0.6,
        },
        "-=0.2"
      );

    // Section headings reveal while scrolling
    gsap.utils.toArray<HTMLElement>(".section").forEach((section) => {
      const heading = section.querySelector("h2");

      if (heading) {
        gsap.from(heading, {
          opacity: 0,
          y: 65,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            once: true,
          },
        });
      }
    });

    // Project cards appear sequentially
    gsap.from(".project-card", {
      opacity: 0,
      y: 55,
      duration: 0.8,
      stagger: 0.18,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".project-list",
        start: "top 80%",
        once: true,
      },
    });

    // Skill cards reveal
    gsap.from(".skill-card", {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".skill-grid",
        start: "top 85%",
        once: true,
      },
    });

    // About text reveal
    gsap.from(".about-description", {
      opacity: 0,
      x: 45,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about-description",
        start: "top 85%",
        once: true,
      },
    });

    // Contact heading reveal
    gsap.from(".contact-link, .socials", {
      opacity: 0,
      y: 25,
      duration: 0.7,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".contact-link",
        start: "top 85%",
        once: true,
      },
    });

  });

  ScrollTrigger.refresh();

  return () => context.revert();
}
