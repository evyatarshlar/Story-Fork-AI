import { useEffect, useRef } from "react";

// --------------- Confetti ---------------

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    shape: "rect" | "circle";
}

const COLORS = [
    "#ff595e", "#ffca3a", "#6a4c93",
    "#1982c4", "#8ac926", "#ff6d00", "#48cae4",
];

function makeParticles(count: number, width: number): Particle[] {
    return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: -10 - Math.random() * 120,
        vx: (Math.random() - 0.5) * 5,
        vy: 2 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 7 + Math.random() * 7,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.18,
        shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
}

/**
 * Canvas-based confetti burst.
 * Runs a requestAnimationFrame loop; auto-stops when all particles
 * have fallen below the viewport. No external libraries.
 */
export function Confetti({ active }: { active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (!active) {
            cancelAnimationFrame(rafRef.current);
            particlesRef.current = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particlesRef.current = makeParticles(130, canvas.width);

        const step = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current = particlesRef.current.filter(
                (p) => p.y < canvas.height + 30
            );

            for (const p of particlesRef.current) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.06; // gravity
                p.rotation += p.rotationSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;

                if (p.shape === "rect") {
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }

            if (particlesRef.current.length > 0) {
                rafRef.current = requestAnimationFrame(step);
            }
        };

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 9999,
                // Hidden but kept in DOM so the ref is always valid
                opacity: active ? 1 : 0,
            }}
        />
    );
}

// --------------- Dark Flash ---------------

/**
 * A brief dark overlay that fades in then out on a losing ending.
 * Driven entirely by a CSS animation; no JS timers here.
 */
export function DarkFlash({ active }: { active: boolean }) {
    if (!active) return null;
    return <div className="ending-dark-flash" aria-hidden="true" />;
}
