import { useEffect } from "react";

export default function AnimatedBackground() {
  useEffect(() => {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.y < 0) p.y = h;
        if (p.x > w) p.x = 0;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    loop();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas id="bg-canvas" className="fixed inset-0 -z-10" />;
}

