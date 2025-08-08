import { CanvasTexture, NearestFilter, SRGBColorSpace, Texture } from "three";
import type { MeshStandardMaterial } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

// Helper: create a canvas-based texture for different ball types
function makeBallTexture(type: BallType): Texture {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;

  // Background fill per type
  const fill = (color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
  };

  // Stroke helper
  const stroke = (color: string, width: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
  };

  // Draw patterns
  switch (type) {
    case "basketball": {
      fill("#d68628");
      // subtle dots
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      for (let y = 0; y < size; y += 10) {
        for (let x = 0; x < size; x += 10) {
          ctx.beginPath();
          ctx.arc(x + (y % 20 === 0 ? 0 : 5), y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // black lines
      stroke("#1f1f1f", 16);
      // horizontal
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      // vertical
      ctx.beginPath();
      ctx.moveTo(size * 0.5, 0);
      ctx.lineTo(size * 0.5, size);
      ctx.stroke();
      // side curves
      const r = size * 0.35;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.5);
      ctx.bezierCurveTo(size * 0.15, size * 0.25, size * 0.35, size * 0.15, size * 0.5, size * 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size, size * 0.5);
      ctx.bezierCurveTo(size * 0.85, size * 0.75, size * 0.65, size * 0.85, size * 0.5, size * 0.8);
      ctx.stroke();
      break;
    }
    case "tennis": {
      fill("#b7ff4a");
      // fuzz noise
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      for (let i = 0; i < 1200; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        ctx.fillRect(x, y, 1, 1);
      }
      // white curved seams
      stroke("#ffffff", 14);
      ctx.beginPath();
      ctx.moveTo(0, size * 0.35);
      ctx.bezierCurveTo(size * 0.35, size * 0.25, size * 0.65, size * 0.45, size, size * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, size * 0.65);
      ctx.bezierCurveTo(size * 0.35, size * 0.55, size * 0.65, size * 0.75, size, size * 0.65);
      ctx.stroke();
      break;
    }
    case "volleyball": {
      fill("#f1f5f9");
      // colored bands
      const bands = ["#0ea5e9", "#f59e0b", "#22c55e"]; // blue, amber, green
      bands.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(-50, size * (0.2 + i * 0.25));
        ctx.bezierCurveTo(size * 0.3, size * (0.05 + i * 0.25), size * 0.7, size * (0.35 + i * 0.25), size + 50, size * (0.2 + i * 0.25));
        ctx.lineTo(size + 50, size * (0.2 + i * 0.25) + 36);
        ctx.bezierCurveTo(size * 0.7, size * (0.35 + i * 0.25) + 36, size * 0.3, size * (0.05 + i * 0.25) + 36, -50, size * (0.2 + i * 0.25) + 36);
        ctx.closePath();
        ctx.fill();
      });
      break;
    }
    case "soccer":
    default: {
      fill("#ffffff");
      // simple hex/pent pattern approximation
      ctx.fillStyle = "#111";
      const cells = 10;
      const step = size / cells;
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          if ((x + y) % 2 === 0) continue;
          ctx.beginPath();
          const px = x * step + (y % 2 ? step * 0.5 : 0);
          const py = y * step;
          ctx.moveTo(px + step * 0.2, py + step * 0.5);
          ctx.lineTo(px + step * 0.4, py + step * 0.1);
          ctx.lineTo(px + step * 0.6, py + step * 0.1);
          ctx.lineTo(px + step * 0.8, py + step * 0.5);
          ctx.lineTo(px + step * 0.6, py + step * 0.9);
          ctx.lineTo(px + step * 0.4, py + step * 0.9);
          ctx.closePath();
          ctx.fill();
        }
      }
      break;
    }
  }

  const texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  return texture;
}

// Procedural background textures for each sport
type BallType = "soccer" | "basketball" | "volleyball" | "tennis";

function makeBackgroundTexture(type: BallType): Texture {
  const w = 1024, h = 1024;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d")!;

  const grad = (stops: [number, string][]) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    stops.forEach(([p, col]) => g.addColorStop(p, col));
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  };

  switch (type) {
    case "basketball": {
      // warm wood court
      grad([[0, "#7a4a18"], [1, "#c08a4a"]]);
      ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 6;
      for (let y = 100; y < h; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 8;
      ctx.strokeRect(w * 0.1, h * 0.15, w * 0.8, h * 0.7);
      break;
    }
    case "volleyball": {
      // beach vibe
      grad([[0, "#87CEEB"], [0.6, "#d1ecff"], [0.61, "#e6d5a4"], [1, "#d9b86c"]]);
      // net hints
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2;
      for (let x = 200; x < w - 200; x += 22) { ctx.beginPath(); ctx.moveTo(x, h * 0.5); ctx.lineTo(x, h * 0.7); ctx.stroke(); }
      for (let y = h * 0.5; y < h * 0.7; y += 18) { ctx.beginPath(); ctx.moveTo(200, y); ctx.lineTo(w - 200, y); ctx.stroke(); }
      break;
    }
    case "tennis": {
      // court green
      grad([[0, "#0b6b2d"], [1, "#2e8b57"]]);
      ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 10;
      ctx.strokeRect(w * 0.2, h * 0.25, w * 0.6, h * 0.5);
      ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.25); ctx.lineTo(w * 0.5, h * 0.75); ctx.stroke();
      break;
    }
    case "soccer":
    default: {
      // stadium grass with subtle stripes
      grad([[0, "#0f6a1f"], [1, "#0e4f18"]]);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      for (let y = 0; y < h; y += 60) { ctx.fillRect(0, y, w, 30); }
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 6;
      ctx.strokeRect(w * 0.1, h * 0.2, w * 0.8, h * 0.6);
      break;
    }
  }

  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = NearestFilter; tex.magFilter = NearestFilter;
  return tex;
}

function makeShadowTexture(): Texture {
  const size = 512; const c = document.createElement("canvas");
  c.width = size; c.height = size; const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size/2, size/2, size*0.1, size/2, size/2, size*0.5);
  g.addColorStop(0, "rgba(0,0,0,0.35)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(size/2, size/2, size*0.5, 0, Math.PI*2); ctx.fill();
  const tex = new CanvasTexture(c); tex.colorSpace = SRGBColorSpace; tex.minFilter = NearestFilter; tex.magFilter = NearestFilter; return tex;
}

const order: BallType[] = ["soccer", "basketball", "volleyball", "tennis"];

function RotatingBall({ texture, visible, scaleFactor = 1 }: { texture: Texture; visible: boolean; scaleFactor?: number }) {
  const ref = useRef<any>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.8; // constant rotation
    }
  });
  return (
    <mesh ref={ref} visible={visible} scale={scaleFactor} castShadow receiveShadow>
      <sphereGeometry args={[1.6, 64, 64]} />
      {/* @ts-ignore - r3f type mismatch for material map prop in some setups */}
      <meshStandardMaterial {...({ map: texture, metalness: 0.1, roughness: 0.8 } as any)} />
    </mesh>
  );
}

export default function BallCarousel3D() {
  const textures = useMemo(() => order.map((t) => makeBallTexture(t)), []);
  const bgTextures = useMemo(() => order.map((t) => makeBackgroundTexture(t)), []);
  const shadowTex = useMemo(() => makeShadowTexture(), []);
  const [index, setIndex] = useState(0);
  const [cross, setCross] = useState(0); // 0..1 crossfade progress
  const [nextIndex, setNextIndex] = useState(1);
  const group = useRef<any>(null);
  const rot = useRef(0);

  useFrame((_, delta) => {
    // track rotation on group to detect full turns
    if (group.current) {
      group.current.rotation.y += delta * 1;
      rot.current += delta * 1;
      if (rot.current >= Math.PI * 2) {
        rot.current = 0;
        // trigger crossfade
        setNextIndex((i) => (i + 1) % textures.length);
        setCross(0.0001); // start animation next frame
      }
    }
    if (cross > 0 && cross < 1) {
      const speed = 1.2; // seconds
      const step = delta / speed;
      const v = Math.min(1, cross + step);
      setCross(v);
      if (v >= 1) {
        setIndex(nextIndex);
        setCross(0);
      }
    }
  });

  const currentTex = textures[index];
  const nextTex = textures[nextIndex];
  const currentBg = bgTextures[index];
  const nextBg = bgTextures[nextIndex];
  const nextVisible = cross > 0;

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* background crossfading planes */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[12, 8]} />
        {/* @ts-ignore */}
        <meshBasicMaterial {...({ map: currentBg, transparent: true, opacity: 1 - cross } as any)} />
      </mesh>
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[12, 8]} />
        {/* @ts-ignore */}
        <meshBasicMaterial {...({ map: nextBg, transparent: true, opacity: cross } as any)} />
      </mesh>

      {/* lights */}
      <hemisphereLight intensity={0.4} groundColor="#444" color="#ffffff" />
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1} position={[3, 5, 5]} />

      {/* fake soft shadow */}
      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 3.8]} />
        {/* @ts-ignore */}
        <meshBasicMaterial {...({ map: shadowTex, transparent: true, opacity: 0.6 } as any)} />
      </mesh>

      <RotatingBall texture={currentTex} visible={true} scaleFactor={1 - cross * 0.8} />
      <RotatingBall texture={nextTex} visible={nextVisible} scaleFactor={0.2 + cross * 0.8} />
    </group>
  );
}

// Wrapper to provide Canvas with sensible defaults for responsive container
export function BallScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
      <BallCarousel3D />
    </Canvas>
  );
}
