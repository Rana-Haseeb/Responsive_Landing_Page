/* ============================================================
  NEXUS STUDIO — script.js
   Scroll reveal · Custom cursor · Navbar · Counter · Pricing toggle
   ============================================================ */

"use strict";

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursorFollower");

let mouseX = 0,
  mouseY = 0;
let followerX = 0,
  followerY = 0;

if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    }
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.14;
    followerY += (mouseY - followerY) * 0.14;
    if (follower) {
      follower.style.left = followerX + "px";
      follower.style.top = followerY + "px";
    }
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
}

/* ── NAVBAR SCROLL ─────────────────────────────────────────── */
const navbar = document.getElementById("navbar");

const navObserver = new IntersectionObserver(
  ([entry]) => {
    navbar.classList.toggle("scrolled", !entry.isIntersecting);
  },
  { threshold: 0, rootMargin: "-72px 0px 0px 0px" },
);

const heroSection = document.getElementById("hero");
if (heroSection) navObserver.observe(heroSection);

/* ── HAMBURGER MENU ────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close on link click
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
    });
  });
}

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
const revealEls = document.querySelectorAll(".reveal, .reveal-up");

function getDelay(el) {
  const d = parseInt(el.dataset.delay || 0);
  return d;
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = getDelay(el);
        setTimeout(() => {
          el.classList.add("visible");
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ── COUNTER ANIMATION ─────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out-expo
    const eased = 1 - Math.pow(2, -10 * progress);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll(".stat-num[data-target]");
let countersStarted = false;

const statsSection = document.querySelector(".hero-stats");
if (statsSection) {
  const counterObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach((c) => animateCounter(c));
        counterObserver.unobserve(statsSection);
      }
    },
    { threshold: 0.5 },
  );
  counterObserver.observe(statsSection);
}

/* ── PRICING TOGGLE ────────────────────────────────────────── */
const billingToggle = document.getElementById("billingToggle");
const monthlyLabel = document.getElementById("monthlyLabel");
const annualLabel = document.getElementById("annualLabel");
const monthlyPrices = document.querySelectorAll(".monthly-price");
const annualPrices = document.querySelectorAll(".annual-price");

let isAnnual = false;

if (billingToggle) {
  billingToggle.addEventListener("click", () => {
    isAnnual = !isAnnual;
    billingToggle.classList.toggle("on", isAnnual);

    if (isAnnual) {
      monthlyLabel.classList.remove("active");
      annualLabel.classList.add("active");
      monthlyPrices.forEach((p) => p.classList.add("hidden"));
      annualPrices.forEach((p) => p.classList.remove("hidden"));
    } else {
      annualLabel.classList.remove("active");
      monthlyLabel.classList.add("active");
      annualPrices.forEach((p) => p.classList.add("hidden"));
      monthlyPrices.forEach((p) => p.classList.remove("hidden"));
    }
  });
}

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* ── SERVICE CARD MAGNETIC HOVER ───────────────────────────── */
if (window.matchMedia("(pointer: fine)").matches) {
  document
    .querySelectorAll(".service-card:not(.service-card--cta)")
    .forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        card.style.transform = `translateY(-4px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
        card.style.transformOrigin = "center center";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
}

/* ── PARALLAX HERO ORBS ────────────────────────────────────── */
if (window.matchMedia("(pointer: fine)").matches) {
  const orb1 = document.querySelector(".hero-orb-1");
  const orb2 = document.querySelector(".hero-orb-2");

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
    if (orb2) orb2.style.transform = `translate(${-x * 0.7}px, ${-y * 0.7}px)`;
  });
}

/* ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────── */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach((a) => {
          a.style.color =
            a.getAttribute("href") === `#${id}` ? "var(--gold)" : "";
        });
      }
    });
  },
  { threshold: 0.4 },
);

sections.forEach((s) => sectionObserver.observe(s));
