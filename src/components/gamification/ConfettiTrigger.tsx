import confetti from "canvas-confetti";

export function smallBurst() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ["#d4a843", "#2dd4bf", "#1a1a2e"],
  });
}

export function largeBurst() {
  const duration = 3000;
  const end = Date.now() + duration;

  function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ["#d4a843", "#2dd4bf", "#e8c96a"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ["#d4a843", "#2dd4bf", "#e8c96a"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }

  frame();
}

export function goldConfetti() {
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.5 },
    colors: ["#d4a843", "#e8c96a", "#f59e0b", "#fbbf24"],
    shapes: ["circle", "square"],
  });
}
