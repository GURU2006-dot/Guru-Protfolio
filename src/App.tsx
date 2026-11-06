import { useEffect, useState } from "react";
import { initSmoothScroll } from "./animations/smoothScroll";
import { initScrollAnimations } from "./animations/scrollAnimations";
import PortraitReveal from "./components/PortraitReveal";

import {
  ArrowUpRight,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const projects = [
  {
    number: "01",
    category: "MACHINE LEARNING / RESEARCH",
    name: "IoT Network Intrusion Detection",
    description:
      "An intelligent network security research project using feature optimization and deep learning.",
    technologies: "Python · GWO · CNN · GRU",
    visual: "network",
    label: "NETWORK INTELLIGENCE",
  },
  {
    number: "02",
    category: "ARTIFICIAL INTELLIGENCE",
    name: "Krishi Saathi",
    description:
      "A multilingual AI-powered agricultural advisory assistant using retrieval-augmented generation.",
    technologies: "Python · FastAPI · RAG",
    visual: "agriculture",
    label: "AI FOR AGRICULTURE",
  },
  {
    number: "03",
    category: "ANDROID / AI",
    name: "PANDU AI Assistant",
    description:
      "An Android voice assistant designed to make everyday mobile interactions smarter.",
    technologies: "Kotlin · Jetpack Compose · Gemini",
    visual: "assistant",
    label: "PERSONAL AI",
  },
  {
    number: "04",
    category: "FULL STACK / DATA",
    name: "Land Acquisition Dashboard",
    description:
      "A geospatial dashboard concept for monitoring land acquisition workflows.",
    technologies: "React · FastAPI · PostgreSQL · PostGIS",
    visual: "dashboard",
    label: "GEOSPATIAL ANALYTICS",
  },
];

function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const destroySmoothScroll = initSmoothScroll();
    const destroyAnimations = initScrollAnimations();

    return () => {
      destroyAnimations();
      destroySmoothScroll();
    };
  }, []);

  return (
    <main className={dark ? "portfolio dark" : "portfolio light"}>

      {/* NAVIGATION */}

      <nav className="navbar">
        <a href="#home" className="logo">
          LGP<span>.</span>
        </a>

        <div className={`nav-links ${menuOpen ? "show" : ""}`}>
          {["About", "Projects", "Skills", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="theme-button"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* HERO */}

      <section className="hero" id="home">

        <div className="hero-content">

          <div className="availability">
            <span className="green-dot" />
            COMPUTER SCIENCE & ENGINEERING
          </div>

          <p className="hero-small">
            HELLO, WORLD. I'M
          </p>

          <h1>
            L GURU
            <br />
            <span>POOJITH</span>
          </h1>

          <div className="hero-bottom">
            <p className="hero-description">
              I explore technology, build intelligent solutions
              and turn ideas into meaningful digital experiences.
            </p>

            <a href="#projects" className="outline-button">
              EXPLORE MY WORK <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="hero-meta">
            <span>DATA SCIENCE STUDENT</span>
            <span>BASED IN INDIA</span>
            <span>PORTFOLIO © 2026</span>
          </div>

        </div>

        {/* CINEMATIC PORTRAIT */}

        <PortraitReveal dark={dark} />

      </section>

      {/* ABOUT */}

      <section className="about section" id="about">

        <div className="section-label">
          <span>01 / ABOUT ME</span>
          <span>GET TO KNOW ME</span>
        </div>

        <h2>
          CURIOUS BY
          <br />
          <span>NATURE.</span>
          BUILDER BY
          <br />
          CHOICE.
        </h2>

        <div className="about-description">
          <p>
            I'm L Guru Poojith, a Computer Science and Engineering
            student specializing in Data Science.
          </p>

          <p>
            I'm interested in Artificial Intelligence, Machine
            Learning, data-driven systems and software development.
            I enjoy experimenting with technology and building
            practical solutions to real-world problems.
          </p>
        </div>

      </section>

      {/* PROJECTS */}

      <section className="projects section" id="projects">

        <div className="section-label">
          <span>02 / SELECTED WORK</span>
          <span>MY PROJECTS</span>
        </div>

        <div className="projects-heading">
          <h2>
            IDEAS INTO
            <br />
            <span>REALITY.</span>
          </h2>

          <p>
            A selection of my technical explorations and projects.
          </p>
        </div>

        <div className="project-list">

          {projects.map((project) => (

            <article className="project-card" key={project.number}>

              <div className={`project-visual visual-${project.visual}`}>

                <div className="visual-header">
                  <span>LGP. / EXPERIMENT {project.number}</span>
                  <span>2026</span>
                </div>

                <div className="visual-center">

                  <div className="visual-orbit">

                    <div className="visual-orbit-inner" />

                    <div className="visual-core">
                      {project.number}
                    </div>

                  </div>

                  <div className="visual-panel">
                    <span>{project.label}</span>

                    <div className="visual-bars">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>

                </div>

                <span className="visual-index">
                  PROJECT / {project.number}
                </span>

              </div>

              <div className="project-info">

                <p className="project-category">
                  {project.category}
                </p>

                <h3>{project.name}</h3>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="project-bottom">

                  <p className="project-tech">
                    {project.technologies}
                  </p>

                  <span className="project-arrow">
                    ↗
                  </span>

                </div>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* SKILLS */}

      <section className="skills section" id="skills">

        <div className="section-label">
          <span>03 / MY TOOLKIT</span>
          <span>TECHNICAL SKILLS</span>
        </div>

        <h2>
          TOOLS OF
          <br />
          <span>CREATION.</span>
        </h2>

        <div className="skill-grid">

          {[
            ["01", "PROGRAMMING", "Python · Java · Kotlin"],
            ["02", "DATA", "SQL · PostgreSQL · Excel"],
            ["03", "AI / ML", "Machine Learning · Deep Learning"],
            ["04", "DEVELOPMENT", "React · FastAPI · Git"],
          ].map(([number, title, description]) => (

            <div className="skill-card" key={number}>

              <span>{number}</span>

              <h3>{title}</h3>

              <p>{description}</p>

            </div>

          ))}

        </div>

      </section>

      {/* CONTACT */}

      <section className="contact section" id="contact">

        <div className="section-label">
          <span>04 / CONTACT</span>
          <span>LET'S CONNECT</span>
        </div>

        <h2>
          HAVE AN
          <br />
          <span>IDEA?</span>
          <br />
          LET'S BUILD.
        </h2>

        <a
          className="contact-link"
          href="mailto:bhanulankipalli1987@gmail.com"
        >
          bhanulankipalli1987@gmail.com
          <ArrowUpRight size={20} />
        </a>

        <div className="socials">

          <a
            href="https://github.com/GURU2006-dot"
            target="_blank"
            rel="noreferrer"
          >
            <span className="social-icon">GH</span>
            GITHUB
          </a>

          <a
            href="https://www.linkedin.com/in/guru-lankipalli-783ab937b"
            target="_blank"
            rel="noreferrer"
          >
            <span className="social-icon">in</span>
            LINKEDIN
          </a>

        </div>

      </section>

      {/* FOOTER */}

      <footer>
        <span>LGP. © 2026</span>

        <span>DESIGNED & BUILT WITH CURIOSITY.</span>

        <a href="#home">
          BACK TO TOP ↑
        </a>
      </footer>

    </main>
  );
}

export default App;