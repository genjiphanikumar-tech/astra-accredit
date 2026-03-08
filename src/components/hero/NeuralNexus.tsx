import { useEffect, useRef } from "react";

const NODES = [
  { id: "NAAC", x: 15, y: 30, delay: 0 },
  { id: "NBA", x: 40, y: 15, delay: 0.5 },
  { id: "ABET", x: 65, y: 30, delay: 1 },
  { id: "AI", x: 50, y: 55, delay: 1.5 },
  { id: "REPORT", x: 85, y: 50, delay: 2 },
];

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 3], [2, 3], [3, 4], [2, 4],
];

// Extra ambient nodes for depth
const AMBIENT_NODES = Array.from({ length: 12 }, (_, i) => ({
  x: 5 + Math.random() * 90,
  y: 5 + Math.random() * 90,
  size: 2 + Math.random() * 3,
  delay: Math.random() * 4,
}));

export default function NeuralNexus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const getPos = (node: (typeof NODES)[0]) => ({
      x: (node.x / 100) * w(),
      y: (node.y / 100) * h(),
    });

    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w(), h());

      // Draw ambient particles
      AMBIENT_NODES.forEach((an) => {
        const pulse = 0.3 + 0.7 * Math.abs(Math.sin(time * 0.5 + an.delay));
        ctx.beginPath();
        ctx.arc((an.x / 100) * w(), (an.y / 100) * h(), an.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 146, 60, ${0.1 * pulse})`;
        ctx.fill();
      });

      // Draw connections
      CONNECTIONS.forEach(([a, b], ci) => {
        const pa = getPos(NODES[a]);
        const pb = getPos(NODES[b]);

        // Connection line
        const gradient = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        gradient.addColorStop(0, "rgba(251, 146, 60, 0.15)");
        gradient.addColorStop(0.5, "rgba(234, 179, 8, 0.25)");
        gradient.addColorStop(1, "rgba(251, 146, 60, 0.15)");

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Traveling data packet
        const speed = 0.3 + ci * 0.05;
        const t = ((time * speed + ci * 1.2) % 3) / 3;
        const px = pa.x + (pb.x - pa.x) * t;
        const py = pa.y + (pb.y - pa.y) * t;

        // Packet glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 12);
        glow.addColorStop(0, "rgba(251, 146, 60, 0.9)");
        glow.addColorStop(0.5, "rgba(234, 179, 8, 0.3)");
        glow.addColorStop(1, "rgba(251, 146, 60, 0)");
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Packet core
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
      });

      // Draw nodes
      NODES.forEach((node) => {
        const pos = getPos(node);
        const pulse = 1 + 0.15 * Math.sin(time * 2 + node.delay * 2);
        const baseRadius = node.id === "AI" ? 32 : 26;
        const r = baseRadius * pulse;

        // Outer glow
        const outerGlow = ctx.createRadialGradient(pos.x, pos.y, r * 0.5, pos.x, pos.y, r * 2);
        outerGlow.addColorStop(0, "rgba(251, 146, 60, 0.15)");
        outerGlow.addColorStop(1, "rgba(251, 146, 60, 0)");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Node ring
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        const ringGrad = ctx.createRadialGradient(pos.x, pos.y, r * 0.6, pos.x, pos.y, r);
        ringGrad.addColorStop(0, "rgba(251, 146, 60, 0.05)");
        ringGrad.addColorStop(0.8, "rgba(234, 179, 8, 0.1)");
        ringGrad.addColorStop(1, "rgba(251, 146, 60, 0.3)");
        ctx.fillStyle = ringGrad;
        ctx.fill();
        ctx.strokeStyle = `rgba(251, 146, 60, ${0.5 + 0.3 * Math.sin(time * 2 + node.delay)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node label
        ctx.font = `bold ${node.id === "AI" ? 13 : 11}px 'Orbitron', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = node.id === "AI" ? "#fbbf24" : "#fb923c";
        ctx.shadowColor = "rgba(251, 146, 60, 0.6)";
        ctx.shadowBlur = 8;
        ctx.fillText(node.id, pos.x, pos.y);
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
