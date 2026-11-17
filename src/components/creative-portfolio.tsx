"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Code2, Mail, Menu,
  Sparkles, Volume2, VolumeX, X
} from "lucide-react";
import {
  profile, socials, projects, experience, education, skills, posts
} from "@/data/content";

type AmbientAudio = {
  context: AudioContext;
  oscillators: OscillatorNode[];
  gain: GainNode;
};

const nav = [
  { label: "Giới thiệu", href: "#about" },
  { label: "Dự án", href: "#projects" },
  { label: "Hành trình", href: "#journey" },
  { label: "Journal", href: "/blog" },
  { label: "Lab", href: "/lab" },
];

export function CreativePortfolio() {
  const sceneRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<AmbientAudio | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let script = document.querySelector<HTMLScriptElement>('script[data-creative-motion="true"]');
    const mount = () => window.dispatchEvent(new Event("creative:mount"));

    if (script?.dataset.loaded === "true") {
      mount();
    } else if (script) {
      script.addEventListener("load", mount, { once: true });
    } else {
      script = document.createElement("script");
      script.type = "module";
      script.src = "/creative/motion.js";
      script.dataset.creativeMotion = "true";
      script.onload = () => {
        if (script) script.dataset.loaded = "true";
        mount();
      };
      document.head.appendChild(script);
    }

    const pointer = (event: PointerEvent) => {
      const x = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const y = 1 - (event.clientY / Math.max(window.innerHeight, 1)) * 2;
      sceneRef.current?.contentWindow?.postMessage(
        { type: "creative-pointer", x, y },
        window.location.origin
      );
    };
    const scroll = () => {
      const progress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      sceneRef.current?.contentWindow?.postMessage(
        { type: "creative-scroll", progress },
        window.location.origin
      );
    };

    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.dispatchEvent(new Event("creative:unmount"));
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("scroll", scroll);
      script?.removeEventListener("load", mount);
    };
  }, []);

  useEffect(() => () => {
    const active = audioRef.current;
    if (!active) return;
    active.oscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* already stopped */ }
    });
    void active.context.close();
    audioRef.current = null;
  }, []);

  const toggleSound = () => {
    const active = audioRef.current;
    if (active) {
      active.gain.gain.setTargetAtTime(0.0001, active.context.currentTime, 0.18);
      active.oscillators.forEach((oscillator) => {
        try { oscillator.stop(active.context.currentTime + 0.6); } catch { /* already stopped */ }
      });
      window.setTimeout(() => void active.context.close(), 750);
      audioRef.current = null;
      setSoundEnabled(false);
      return;
    }

    if (typeof window.AudioContext === "undefined") return;
    const context = new window.AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 340;
    filter.connect(master);
    master.connect(context.destination);
    master.gain.value = 0.0001;

    const bass = context.createOscillator();
    bass.type = "sine";
    bass.frequency.value = 55;
    bass.connect(filter);
    bass.start();

    const overtone = context.createOscillator();
    overtone.type = "triangle";
    overtone.frequency.value = 82.41;
    overtone.connect(filter);
    overtone.start();

    master.gain.setTargetAtTime(0.012, context.currentTime, 1.1);
    audioRef.current = { context, oscillators: [bass, overtone], gain: master };
    void context.resume();
    setSoundEnabled(true);
  };

  const featured = projects.filter((project) => project.featured);
  const year = new Date().getFullYear();

  return (
    <div className="site-shell" data-creative-root>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Vthanhh home">
            <span className="brand-mark">V.</span>
            <span className="brand-copy"><strong>VTHANHH</strong><small>CREATIVE PORTFOLIO</small></span>
          </Link>

          <nav className="desktop-nav" aria-label="Điều hướng chính">
            {nav.map((item) => item.href.startsWith("#")
              ? <a key={item.href} href={item.href}>{item.label}</a>
              : <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>

          <div className="header-actions">
            <button className="sound-toggle" onClick={toggleSound} aria-pressed={soundEnabled}>
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>{soundEnabled ? "SOUND ON" : "SOUND OFF"}</span>
            </button>
            <a className="header-contact" href={"mailto:" + profile.email}>Kết nối <ArrowUpRight size={15} /></a>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu">
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-menu">
            {nav.map((item) => item.href.startsWith("#")
              ? <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={15} /></a>
              : <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={15} /></Link>)}
            <a href={"mailto:" + profile.email} onClick={() => setMenuOpen(false)}>Email<Mail size={15} /></a>
          </nav>
        )}
      </header>

      <main>
        <section id="hero" className="hero">
          <div className="hero-scene" data-scene>
            <div className="scene-fallback" />
            <iframe
              ref={sceneRef}
              className="scene-frame"
              src="/creative/scene.html"
              title="Không gian 3D Vthanhh"
              aria-hidden="true"
              tabIndex={-1}
              loading="eager"
            />
          </div>
          <div className="hero-grid" />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow" data-hero-eyebrow><span className="status-dot" /> INDEPENDENT BUILDER <i /> {profile.location.toUpperCase()}</p>
              <h1 className="hero-title">
                <span data-hero-title>Biến ý tưởng</span>
                <span className="gradient-text" data-hero-title>thành sản phẩm số.</span>
              </h1>
              <p className="hero-description" data-hero-copy>
                Mình là {profile.name} — {profile.role}. Tập trung vào lập trình, AI Agents và phát triển những sản phẩm công nghệ hữu ích.
              </p>
              <div className="hero-actions" data-hero-actions>
                <a className="button-primary" href="#projects">Khám phá dự án <ArrowUpRight size={17} /></a>
                <a className="button-secondary" href="#about">Tìm hiểu về mình <ArrowDown size={16} /></a>
              </div>
              <div className="hero-meta">
                <span><Code2 size={14} /> AI · SOFTWARE · PRODUCT</span>
                <span><Sparkles size={14} /> BUILD / EXPERIMENT / LEARN</span>
              </div>
            </div>
            <div className="hero-side-note"><span>V / 01</span><span>IDEAS IN MOTION</span><i /></div>
            <div className="hero-bottom">
              <span>SCROLL TO EXPLORE</span>
              <span>{profile.location}</span>
              <span>{String(projects.length).padStart(2, "0")} PROJECTS IN THE ARCHIVE</span>
            </div>
          </div>
          <a href="#about" className="scroll-cue"><span>SCROLL</span><ArrowDown size={16} /></a>
        </section>

        <div className="ticker" aria-hidden="true"><div className="ticker-track">
          {[0, 1].map((copy) => <div className="ticker-group" key={copy}>
            {["THINK", "DESIGN", "BUILD", "EXPERIMENT", "SHIP", "REPEAT"].map((word) =>
              <span className="ticker-word" key={word}>{word}<b>✳</b></span>)}
          </div>)}
        </div></div>

        <section id="about" className="section">
          <div className="section-heading reveal">
            <p className="section-index">01 / ABOUT</p>
            <h2>Luôn bắt đầu từ <em>một vấn đề thật.</em></h2>
            <p className="section-intro">Một chút tò mò, một câu hỏi đúng và rất nhiều lần thử nghiệm.</p>
          </div>
          <div className="about-grid">
            <div className="portrait-card reveal">
              <div className="portrait-monogram">V.</div>
              <div className="portrait-stamp"><span>THE BUILDER</span><strong>VTHANHH®</strong></div>
              <div className="portrait-corner">EST. 2008</div>
            </div>
            <div className="about-copy reveal">
              <p className="about-lead">{profile.summary}</p>
              <p className="body-copy">Mình quan tâm đến toàn bộ vòng đời sản phẩm: hiểu vấn đề, thử nghiệm giải pháp, xây dựng, kiểm chứng và cải tiến dựa trên phản hồi thực tế. Điều mình tìm kiếm không chỉ là công nghệ mới, mà là cách dùng công nghệ để tạo ra giá trị thật.</p>
              <div className="fact-grid">
                <div><span>FOCUS</span><strong>AI & Digital Products</strong></div>
                <div><span>ROLE</span><strong>{profile.role}</strong></div>
                <div><span>BASED IN</span><strong>{profile.location}</strong></div>
                <div><span>EDUCATION</span><strong>FPT University</strong></div>
              </div>
              <a className="text-link" href="#projects">Xem những gì mình đang xây <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-heading-row reveal">
            <div><p className="section-index">02 / SELECTED WORK</p><h2>Những thứ mình <em>đã xây.</em></h2><p className="section-intro">Sản phẩm, công cụ và thử nghiệm được chọn từ hành trình làm công nghệ.</p></div>
            <Link className="text-link" href="/projects">Tất cả dự án <ArrowUpRight size={16} /></Link>
          </div>
          <div className="projects-grid">
            {featured.map((project, index) => (
              <a className="project-card reveal" key={project.id} href={project.href} target="_blank" rel="noreferrer">
                <div className="project-art" style={project.image ? { backgroundImage: "linear-gradient(180deg, rgba(3,8,12,.08), rgba(3,8,12,.58)), url(" + project.image + ")" } : undefined}>
                  <div className="project-art-meta"><span>0{index + 1}</span><span>{project.category}</span></div>
                  <span className="project-art-arrow"><ArrowUpRight size={19} /></span>
                </div>
                <div className="project-body">
                  <span className="project-date">{project.date}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">{project.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="journey" className="section">
          <div className="journey-grid">
            <div className="journey-intro reveal">
              <p className="section-index">03 / THE JOURNEY</p>
              <h2>Học nhanh. <em>Làm thật.</em> Cải tiến liên tục.</h2>
              <p className="body-copy">Mình thích làm việc ở giao điểm giữa kỹ thuật, trải nghiệm người dùng và tư duy sản phẩm — nơi một ý tưởng có thể đi từ bản thử nghiệm đến một công cụ hữu ích.</p>
              <div className="focus-pills">{["AI Agents", "Full-stack", "Automation", "E-commerce", "Product thinking"].map((x) => <span key={x}>{x}</span>)}</div>
            </div>
            <div className="journey-panel reveal">
              <p className="small-label">EXPERIENCE</p>
              {experience.map((item) => <div className="timeline-item" key={item.title}>
                <span>{item.date}</span><h3>{item.title}</h3><p className="timeline-org">{item.organization}</p><p>{item.description}</p>
              </div>)}
              <div className="education-list"><p className="small-label">EDUCATION</p>
                {education.map((item) => <div className="education-item" key={item.title}>
                  <span>{item.date}</span><div><strong>{item.title}</strong><p>{item.organization}</p></div>
                </div>)}
              </div>
            </div>
          </div>
          <div className="toolkit reveal">
            <div className="toolkit-heading"><div><p className="small-label">THE TOOLKIT</p><h3>Tools are only as useful as what you build with them.</h3></div><Code2 size={25} /></div>
            <div className="toolkit-row"><span>SKILLS</span><div className="toolkit-chips">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
          </div>
        </section>

        <section id="journal" className="section">
          <div className="section-heading-row reveal">
            <div><p className="section-index">04 / JOURNAL</p><h2>Ghi lại quá trình <em>khám phá.</em></h2><p className="section-intro">Những ghi chú, nghiên cứu và bài học trong lúc xây dựng sản phẩm.</p></div>
            <Link className="text-link" href="/blog">Đọc tất cả <ArrowUpRight size={16} /></Link>
          </div>
          <div className="journal-grid">
            {posts.map((post, index) => <a className="journal-card reveal" key={post.href} href={post.href} target="_blank" rel="noreferrer">
              <div className="journal-topline"><span>0{index + 1} / {post.tag}</span><ArrowUpRight size={16} /></div>
              <time>{post.date}</time><h3>{post.title}</h3><p>{post.summary}</p>
            </a>)}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-panel reveal">
            <div className="contact-orbit" data-orbit />
            <p className="section-index">05 / LET’S CONNECT</p>
            <h2>Có một ý tưởng <em>đáng làm?</em></h2>
            <p className="contact-copy">Nếu bạn muốn xây dựng một sản phẩm, thử nghiệm một hướng đi mới hoặc đơn giản là trao đổi về công nghệ, hãy bắt đầu bằng một lời chào.</p>
            <a className="contact-email" href={"mailto:" + profile.email}>{profile.email} <ArrowUpRight size={20} /></a>
            <div className="social-links">{socials.map((item) => <a key={item.name} href={item.href} target="_blank" rel="noreferrer">{item.name}<ArrowUpRight size={13} /></a>)}</div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><strong>VTHANHH<span>®</span></strong><small>BUILDING IDEAS INTO DIGITAL PRODUCTS.</small></div>
        <p>© {year} {profile.name}. Made with curiosity.</p>
        <a href="#hero">BACK TO TOP ↑</a>
      </footer>
    </div>
  );
}
