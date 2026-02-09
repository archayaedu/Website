// Particle Canvas Animation
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

// Set canvas size
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

setCanvasSize();
window.addEventListener("resize", setCanvasSize);

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off edges
    if (this.x > canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }

    // Mouse interaction
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      const force = (mouse.radius - distance) / mouse.radius;
      const directionX = dx / distance;
      const directionY = dy / distance;
      this.x -= directionX * force * 2;
      this.y -= directionY * force * 2;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(201, 169, 97, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize particles
function initParticles() {
  particles = [];
  const numberOfParticles = (canvas.width * canvas.height) / 15000;
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle());
  }
}

// Connect particles with lines
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const opacity = (1 - distance / 120) * 0.2;
        ctx.strokeStyle = `rgba(201, 169, 97, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  connectParticles();
  requestAnimationFrame(animateParticles);
}

// Mouse move event
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

// Mouse leave event
window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

// Initialize and start animation
initParticles();
animateParticles();

// Reinitialize on resize
window.addEventListener("resize", () => {
  setCanvasSize();
  initParticles();
});

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Mobile menu toggle
function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  if (navLinks.style.display === "flex") {
    navLinks.style.display = "none";
  } else {
    navLinks.style.display = "flex";
    navLinks.style.flexDirection = "column";
    navLinks.style.position = "absolute";
    navLinks.style.top = "80px";
    navLinks.style.right = "30px";
    navLinks.style.background = "rgba(10, 22, 40, 0.98)";
    navLinks.style.padding = "30px";
    navLinks.style.borderRadius = "12px";
    navLinks.style.border = "1px solid rgba(201, 169, 97, 0.3)";
    navLinks.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.5)";
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Close mobile menu if open
      const navLinks = document.querySelector(".nav-links");
      if (window.innerWidth <= 768) {
        navLinks.style.display = "none";
      }
    }
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll(".pillar-card, .passion-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

// Parallax effect for hero image
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector(".hero-image");
  if (heroImage) {
    heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// Add hover sound effect (optional - can be removed if not needed)
document
  .querySelectorAll(".pillar-card, .passion-card, .social-btn")
  .forEach((element) => {
    element.addEventListener("mouseenter", () => {
      element.style.transition =
        "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    });
  });

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const h3 = entry.target.querySelector("h3");
        const text = h3.textContent;

        // Extract number from text (e.g., "4.0" -> 4.0)
        const match = text.match(/[\d.]+/);
        if (match) {
          const number = parseFloat(match[0]);
          const suffix = text.replace(/[\d.]+/, "");

          let current = 0;
          const increment = number / 100;

          const interval = setInterval(() => {
            current += increment;
            if (current >= number) {
              h3.textContent = text;
              clearInterval(interval);
            } else {
              if (text.includes(".")) {
                h3.textContent = current.toFixed(1) + suffix;
              } else {
                h3.textContent = Math.floor(current) + suffix;
              }
            }
          }, 20);
        }

        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".stat-item").forEach((stat) => {
  statsObserver.observe(stat);
});

// Add ripple effect to buttons
document.querySelectorAll(".cta-btn, .social-btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    this.appendChild(ripple);

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add tilt effect to cards
document.querySelectorAll(".pillar-card, .passion-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  });
});

// Cursor trail effect (subtle)
let cursorTrail = [];
const trailLength = 10;

document.addEventListener("mousemove", (e) => {
  cursorTrail.push({ x: e.clientX, y: e.clientY });

  if (cursorTrail.length > trailLength) {
    cursorTrail.shift();
  }
});
