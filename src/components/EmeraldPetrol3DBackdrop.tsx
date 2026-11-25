import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ExperienceCameraState } from "./pearl-dream/PearlDreamTypes";

interface EmeraldPetrol3DBackdropProps {
  cameraState?: ExperienceCameraState;
}

function createRadialMistTexture(innerRgba: string, midRgba: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(
      size * 0.5,
      size * 0.5,
      size * 0.04,
      size * 0.5,
      size * 0.5,
      size * 0.5
    );
    g.addColorStop(0, innerRgba);
    g.addColorStop(0.45, midRgba);
    g.addColorStop(1, "rgba(5, 29, 34, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createPinpointLightTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    g.addColorStop(0, "rgba(255, 248, 228, 1)");
    g.addColorStop(0.28, "rgba(216, 185, 130, 0.72)");
    g.addColorStop(0.62, "rgba(95, 211, 204, 0.25)");
    g.addColorStop(1, "rgba(95, 211, 204, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createPetrolStudioEnv(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color("#062126");

  const panels: Array<{
    pos: [number, number, number];
    size: [number, number];
    color: string;
  }> = [
    { pos: [10, 12, 8], size: [18, 18], color: "#5FD3CC" },
    { pos: [-12, 6, 6], size: [20, 14], color: "#0D3B3E" },
    { pos: [8, -8, 6], size: [16, 10], color: "#D8B982" },
    { pos: [-6, -10, -8], size: [18, 12], color: "#0B2E36" },
  ];

  for (const p of panels) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(p.size[0], p.size[1]),
      new THREE.MeshBasicMaterial({ color: p.color, side: THREE.DoubleSide })
    );
    mesh.position.set(...p.pos);
    mesh.lookAt(0, 0, 0);
    envScene.add(mesh);
  }

  const rt = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  return rt.texture;
}

const SCENE_DEPTH_Z: Record<ExperienceCameraState, number> = {
  intro: 12.2,
  envelope: 11.4,
  hub: 10.6,
  welcome: 9.8,
  jirtiq: 9.4,
  date: 9.0,
  location: 8.6,
};

/**
 * Luxury Cinematic Deep Petrol Green & Midnight Teal 3D Background
 * Combines:
 * 1. Real verified slow-motion HD emerald silk footage (Mixkit #1842, hosted locally at /video/emerald-silk-1842.mp4)
 *    with seamless loop cross-dip, deep petrol-emerald film grade, and subtle parallax shift.
 * 2. Real-time Three.js 3D depth layer: glass/water refracting lenses, far/near turquoise mist layers,
 *    sparse champagne-gold light motes, and ultra-slow pointer/gyroscope camera parallax.
 */
export function EmeraldPetrol3DBackdrop({
  cameraState = "intro",
}: EmeraldPetrol3DBackdropProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<HTMLDivElement | null>(null);
  const cameraStateRef = useRef<ExperienceCameraState>(cameraState);
  const [loopDip, setLoopDip] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    cameraStateRef.current = cameraState;
  }, [cameraState]);

  // Configure slow-motion playback, iOS defaultMuted fix, and hide video until actually playing
  // (prevents iOS Safari / Android from ever showing a native play button icon in the background)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.playbackRate = prefersReduced ? 0.25 : 0.58;

    const tryPlay = () => {
      video.muted = true;
      video.playbackRate = prefersReduced ? 0.25 : 0.58;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Stay hidden if browser Low Power Mode blocks autoplay; retry on first touch
        });
      }
    };

    tryPlay();

    const onPlaying = () => setVideoPlaying(true);
    const onPause = () => {
      if (!document.hidden) tryPlay();
    };

    const onTimeUpdate = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      const remaining = video.duration - video.currentTime;
      setLoopDip(remaining < 0.65 || video.currentTime < 0.35);
    };

    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        tryPlay();
      }
    };

    const onFirstGesture = () => {
      if (video.paused) tryPlay();
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointerdown", onFirstGesture, { passive: true });
    window.addEventListener("touchstart", onFirstGesture, { passive: true });

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
    };
  }, []);

  // Real-time 3D Depth, Glass/Water Reflections & Sparse Champagne Motes Overlay
  useEffect(() => {
    const container = webglRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isNarrow = window.innerWidth < 640;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isNarrow,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const maxDpr = isNarrow ? 1.25 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#062126", 0.045);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      60
    );
    camera.position.set(0, 0, SCENE_DEPTH_Z[cameraStateRef.current]);

    const envMap = createPetrolStudioEnv(renderer);
    scene.environment = envMap;

    // Soft Turquoise & Subtle Champagne Gold Lighting
    const hemiLight = new THREE.HemisphereLight("#5FD3CC", "#051B20", 0.9);
    scene.add(hemiLight);

    const turquoiseKey = new THREE.DirectionalLight("#5FD3CC", 1.35);
    turquoiseKey.position.set(8, 10, 8);
    scene.add(turquoiseKey);

    const champagneRim = new THREE.PointLight("#D8B982", 1.25, 28);
    champagneRim.position.set(-6, 5, 4);
    scene.add(champagneRim);

    const world = new THREE.Group();
    scene.add(world);

    // 1. Translucent Glass & Water-Like Refracting Orbs (Far & Near Depth)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#7BE0DA"),
      roughness: 0.08,
      metalness: 0.04,
      transmission: 0.9,
      ior: 1.42,
      thickness: 1.2,
      transparent: true,
      opacity: 0.42,
      envMapIntensity: 1.5,
    });

    const goldHairlineMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#D8B982"),
      metalness: 0.92,
      roughness: 0.22,
      transparent: true,
      opacity: 0.48,
      envMapIntensity: 1.4,
    });

    const sphereGeom = new THREE.SphereGeometry(1, isNarrow ? 24 : 36, isNarrow ? 24 : 36);
    const orbSpecs: Array<{
      pos: [number, number, number];
      r: number;
      speed: number;
      phase: number;
    }> = [
      { pos: [-3.8, 2.3, -1.5], r: 0.72, speed: 0.22, phase: 0.3 },
      { pos: [4.1, -1.9, -2.2], r: 0.95, speed: 0.18, phase: 1.9 },
      { pos: [2.8, 2.8, -5.2], r: 1.15, speed: 0.15, phase: 3.1 },
      { pos: [-3.4, -2.6, -4.6], r: 0.85, speed: 0.2, phase: 4.5 },
    ];

    const orbs = orbSpecs.map((spec) => {
      const mesh = new THREE.Mesh(sphereGeom, glassMat);
      mesh.position.set(...spec.pos);
      mesh.scale.setScalar(spec.r);
      world.add(mesh);
      return { mesh, baseY: spec.pos[1], speed: spec.speed, phase: spec.phase };
    });

    // 2. Subtle Champagne-Gold Horizon Reflection Rings (Very Minimal)
    const ringGeomA = new THREE.TorusGeometry(3.8, 0.014, 10, 96);
    const ringA = new THREE.Mesh(ringGeomA, goldHairlineMat);
    ringA.position.set(1.8, 0.2, -5.8);
    ringA.rotation.set(0.55, -0.45, 0.12);
    world.add(ringA);

    const ringGeomB = new THREE.TorusGeometry(2.7, 0.011, 10, 84);
    const ringB = new THREE.Mesh(ringGeomB, goldHairlineMat);
    ringB.position.set(-2.4, -0.8, -4.2);
    ringB.rotation.set(-0.42, 0.52, -0.18);
    world.add(ringB);

    // 3. Far & Near Depth Mist Layers (Turquoise & Deep Emerald Fog)
    const turquoiseMistTex = createRadialMistTexture(
      "rgba(95, 211, 204, 0.22)",
      "rgba(13, 59, 62, 0.14)"
    );
    const champagneMistTex = createRadialMistTexture(
      "rgba(216, 185, 130, 0.16)",
      "rgba(11, 46, 54, 0.10)"
    );

    const mistSpecs: Array<{
      pos: [number, number, number];
      scale: [number, number];
      tex: THREE.CanvasTexture;
    }> = [
      { pos: [-4.8, 2.6, -8.5], scale: [12, 7], tex: turquoiseMistTex },
      { pos: [5.2, -2.0, -9.2], scale: [13, 7.5], tex: champagneMistTex },
      { pos: [0.2, 3.8, -11.0], scale: [14, 8], tex: turquoiseMistTex },
      { pos: [-1.8, -3.5, -7.8], scale: [11, 6.5], tex: champagneMistTex },
    ];

    const mistMats: THREE.SpriteMaterial[] = [];
    const mists = mistSpecs.map((m, idx) => {
      const mat = new THREE.SpriteMaterial({
        map: m.tex,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      mistMats.push(mat);
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(...m.pos);
      sprite.scale.set(m.scale[0], m.scale[1], 1);
      world.add(sprite);
      return { sprite, baseX: m.pos[0], phase: idx * 1.6 };
    });

    // 4. Sparse, Widely Spaced Luminous Champagne & Turquoise Light Pinpoints
    const moteCount = isNarrow ? 28 : 42;
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePositions[i * 3] = (Math.random() - 0.5) * 16;
      motePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      motePositions[i * 3 + 2] = -Math.random() * 14 + 2;
    }
    const moteGeom = new THREE.BufferGeometry();
    moteGeom.setAttribute("position", new THREE.BufferAttribute(motePositions, 3));
    const moteTex = createPinpointLightTexture();
    const moteMat = new THREE.PointsMaterial({
      map: moteTex,
      size: 0.22,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const motes = new THREE.Points(moteGeom, moteMat);
    world.add(motes);

    // Ultra-Slow Pointer & Device Gyroscope Parallax
    let targetX = 0;
    let targetY = 0;
    let currX = 0;
    let currY = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 1.1;
      targetY = (e.clientY / window.innerHeight - 0.5) * -0.75;
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      targetX = Math.max(-0.95, Math.min(0.95, (e.gamma / 40) * 0.95));
      targetY = Math.max(-0.65, Math.min(0.65, ((e.beta - 45) / 40) * -0.65));
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let rafId = 0;
    let slowFrames = 0;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;
      if (dt > 34) {
        slowFrames += 1;
        if (slowFrames === 25) renderer.setPixelRatio(1);
      }

      const t = clock.getElapsedTime();

      currX += (targetX - currX) * 0.032;
      currY += (targetY - currY) * 0.032;

      const desiredZ =
        SCENE_DEPTH_Z[cameraStateRef.current] + (window.innerWidth < 640 ? 1.8 : 0);
      camera.position.x = currX;
      camera.position.y = currY;
      camera.position.z += (desiredZ - camera.position.z) * 0.035;
      camera.lookAt(0, 0, -4);

      // Subtle counter-depth parallax on the real MP4 video layer
      if (videoWrapRef.current && !prefersReduced) {
        const vx = -currX * 12;
        const vy = currY * 10;
        videoWrapRef.current.style.transform = `translate3d(${vx.toFixed(1)}px, ${vy.toFixed(1)}px, 0) scale(1.12)`;
      }

      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        o.mesh.position.y = o.baseY + Math.sin(t * o.speed + o.phase) * 0.25;
        o.mesh.rotation.y = t * 0.05 + o.phase;
      }

      ringA.rotation.z = 0.12 + t * 0.025;
      ringB.rotation.z = -0.18 - t * 0.022;

      for (let i = 0; i < mists.length; i++) {
        const m = mists[i];
        m.sprite.position.x = m.baseX + Math.sin(t * 0.06 + m.phase) * 0.65;
      }

      motes.rotation.y = t * 0.012;
      motes.position.y = Math.sin(t * 0.18) * 0.16;

      renderer.render(scene, camera);
      if (!prefersReduced) {
        rafId = requestAnimationFrame(animate);
      }
    };

    animate();

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else if (!prefersReduced) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);

      sphereGeom.dispose();
      ringGeomA.dispose();
      ringGeomB.dispose();
      moteGeom.dispose();
      glassMat.dispose();
      goldHairlineMat.dispose();
      moteMat.dispose();
      mistMats.forEach((m) => m.dispose());
      turquoiseMistTex.dispose();
      champagneMistTex.dispose();
      moteTex.dispose();
      envMap.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#051C21]"
    >
      {/* Layer 1: Real Verified Slow-Motion Emerald Silk MP4 Video (Hidden until playing so no play button ever shows) */}
      <div
        ref={videoWrapRef}
        className="absolute inset-0 h-full w-full scale-[1.12] will-change-transform transition-opacity duration-700"
        style={{ opacity: !videoPlaying ? 0 : loopDip ? 0.84 : 1 }}
      >
        <video
          ref={videoRef}
          src="/video/emerald-silk-1842.mp4"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
          preload="auto"
          className="bg-ambient-video pointer-events-none h-full w-full object-cover"
          style={{
            filter:
              "brightness(0.46) contrast(1.18) saturate(1.12) hue-rotate(18deg)",
          }}
        />
      </div>

      {/* Layer 2: Deep Petrol Green, Midnight Teal & Dark Emerald Atmospheric Film Grade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 78% 12%, rgba(95, 211, 204, 0.22) 0%, transparent 48%), radial-gradient(ellipse at 18% 82%, rgba(216, 185, 130, 0.15) 0%, transparent 46%), radial-gradient(circle at 50% 45%, rgba(13, 59, 62, 0.34) 0%, rgba(11, 46, 54, 0.62) 58%, rgba(4, 24, 29, 0.88) 100%)",
        }}
      />

      {/* Layer 3: Real-Time Three.js 3D Depth, Glass/Water Refraction & Champagne Light Motes */}
      <div ref={webglRef} className="absolute inset-0 h-full w-full" />

      {/* Layer 4: Subtle Champagne-Gold Top-Right Volumetric Reflection Shaft */}
      <div
        className="absolute -top-24 -right-24 h-[68vh] w-[82vw] rotate-12 opacity-40"
        style={{
          background:
            "conic-gradient(from 198deg at 82% 8%, transparent 0deg, rgba(95, 211, 204, 0.28) 16deg, transparent 34deg, rgba(216, 185, 130, 0.22) 48deg, transparent 70deg)",
          filter: "blur(28px)",
        }}
      />
    </div>
  );
}
