import { gsap } from "https://esm.sh/gsap@3.15.1";
import { ScrollTrigger } from "https://esm.sh/gsap@3.15.1/ScrollTrigger";
import Lenis from "https://esm.sh/lenis@1.3.27";

gsap.registerPlugin(ScrollTrigger);
let cleanup = null;

function mountMotion() {
  if (cleanup) cleanup();
  const root = document.querySelector("[data-creative-root]");
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lenis = new Lenis({ autoRaf: false, duration: 1.15, smoothWheel: true, syncTouch: false });
  lenis.on("scroll", ScrollTrigger.update);
  const ticker = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  const context = gsap.context(() => {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 18, duration: .65 })
      .from("[data-hero-title]", { autoAlpha: 0, y: 42, duration: .95, stagger: .12 }, "-=.35")
      .from("[data-hero-copy]", { autoAlpha: 0, y: 20, duration: .7 }, "-=.5")
      .from("[data-hero-actions]", { autoAlpha: 0, y: 16, duration: .7 }, "-=.35");

    gsap.utils.toArray(".reveal").forEach((element) => {
      gsap.fromTo(element, { autoAlpha: 0, y: 30 }, {
        autoAlpha: 1, y: 0, duration: .85, ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true }
      });
    });

    gsap.to("[data-scene]", {
      yPercent: 16, scale: 1.06, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to("[data-orbit]", { rotation: 360, duration: 34, repeat: -1, ease: "none" });
  }, root);

  requestAnimationFrame(() => ScrollTrigger.refresh());
  cleanup = () => {
    context.revert();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.ticker.remove(ticker);
    lenis.destroy();
    gsap.ticker.lagSmoothing(500);
    cleanup = null;
  };
}

function unmountMotion() { if (cleanup) cleanup(); }
window.addEventListener("creative:mount", mountMotion);
window.addEventListener("creative:unmount", unmountMotion);
window.addEventListener("pagehide", unmountMotion);
