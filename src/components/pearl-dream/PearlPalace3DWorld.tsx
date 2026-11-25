import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ExperienceCameraState, GateId } from "./PearlDreamTypes";

interface PearlPalace3DWorldProps {
  cameraState: ExperienceCameraState;
  hoveredGate?: GateId | null;
}

interface WorldCameraPreset {
  pos: [number, number, number];
  lookAt: [number, number, number];
  fogColor: string;
  fogDensity: number;
  sunColor: string;
  sunIntensity: number;
  accentColor: string;
  accentIntensity: number;
}

const CAMERA_PRESETS: Record<ExperienceCameraState, WorldCameraPreset> = {
  intro: {
    pos: [0, 1.4, 15.5],
    lookAt: [0, 0.5, -4],
    fogColor: "#F3ECF8",
    fogDensity: 0.03,
    sunColor: "#FFF2DF",
    sunIntensity: 1.65,
    accentColor: "#E8C3DC",
    accentIntensity: 1.1,
  },
  envelope: {
    pos: [0, 0.9, 13.0],
    lookAt: [0, 0.4, -4],
    fogColor: "#F6EDF7",
    fogDensity: 0.028,
    sunColor: "#FFF5E4",
    sunIntensity: 1.75,
    accentColor: "#F2C6DC",
    accentIntensity: 1.15,
  },
  hub: {
    pos: [0, 0.55, 10.6],
    lookAt: [0, 0.35, -5],
    fogColor: "#F2ECF9",
    fogDensity: 0.026,
    sunColor: "#FFF4E0",
    sunIntensity: 1.82,
    accentColor: "#D6C8F4",
    accentIntensity: 1.2,
  },
  welcome: {
    pos: [-1.45, 1.05, 5.2],
    lookAt: [-0.8, 0.7, -8],
    fogColor: "#FBEFF4",
    fogDensity: 0.024,
    sunColor: "#FFF3DE",
    sunIntensity: 1.9,
    accentColor: "#F6BDD6",
    accentIntensity: 1.35,
  },
  jirtiq: {
    pos: [1.55, 0.75, 4.4],
    lookAt: [0.6, 0.35, -9],
    fogColor: "#F6E5EA",
    fogDensity: 0.028,
    sunColor: "#FFEBD4",
    sunIntensity: 1.72,
    accentColor: "#C84B6E",
    accentIntensity: 1.35,
  },
  date: {
    pos: [0.0, 2.25, 3.6],
    lookAt: [0, 1.2, -11],
    fogColor: "#E5ECFC",
    fogDensity: 0.024,
    sunColor: "#F0F5FF",
    sunIntensity: 1.65,
    accentColor: "#B7C6F8",
    accentIntensity: 1.4,
  },
  location: {
    pos: [0.0, 1.2, 2.2],
    lookAt: [0, -0.35, -12],
    fogColor: "#EAF4F2",
    fogDensity: 0.025,
    sunColor: "#FFF7E8",
    sunIntensity: 1.82,
    accentColor: "#BFE4DC",
    accentIntensity: 1.2,
  },
};

/**
 * Procedural Carrara White Marble Texture with delicate ivory/champagne veining.
 */
function createMarbleTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Base warm pearl marble
    const baseGrad = ctx.createLinearGradient(0, 0, size, size);
    baseGrad.addColorStop(0, "#FCFBF9");
    baseGrad.addColorStop(0.5, "#F6F3ED");
    baseGrad.addColorStop(1, "#FAF8F4");
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, size, size);

    // Subtle cloudy mineral patches
    for (let i = 0; i < 16; i++) {
      const x = ((i * 97) % size);
      const y = ((i * 151) % size);
      const r = 60 + (i % 4) * 35;
      const g = ctx.createRadialGradient(x, y, 4, x, y, r);
      g.addColorStop(0, "rgba(220, 230, 238, 0.16)");
      g.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }

    // Delicate organic marble veins
    ctx.lineCap = "round";
    for (let v = 0; v < 9; v++) {
      ctx.beginPath();
      let x = (v * 68) % size;
      let y = 0;
      ctx.moveTo(x, y);
      for (let step = 1; step <= 14; step++) {
        y = (step / 14) * size;
        x += Math.sin(step * 0.9 + v * 1.7) * 24 + (v % 2 === 0 ? 8 : -7);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle =
        v % 3 === 0
          ? "rgba(216, 193, 154, 0.17)"
          : "rgba(165, 178, 192, 0.14)";
      ctx.lineWidth = v % 3 === 0 ? 1.4 : 2.2;
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Soft radial cloud & mist sprite texture.
 */
function createCloudMistTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size * 0.5,
      size * 0.5,
      size * 0.05,
      size * 0.5,
      size * 0.5,
      size * 0.5
    );
    grad.addColorStop(0, "rgba(255, 255, 255, 0.82)");
    grad.addColorStop(0.42, "rgba(246, 242, 236, 0.42)");
    grad.addColorStop(0.75, "rgba(220, 234, 244, 0.14)");
    grad.addColorStop(1, "rgba(250, 250, 248, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Soft golden sparkle sprite texture for sparse champagne motes.
 */
function createSparkleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, "rgba(255, 250, 236, 1)");
    grad.addColorStop(0.32, "rgba(216, 193, 154, 0.65)");
    grad.addColorStop(1, "rgba(216, 193, 154, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Procedural architectural studio HDRI reflection map for realistic marble, crystal, and pearl.
 */
function createPalaceStudioEnvironment(
  renderer: THREE.WebGLRenderer
): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color("#F3ECF8");

  const panels: Array<{
    pos: [number, number, number];
    size: [number, number];
    color: string;
  }> = [
    { pos: [12, 14, 10], size: [22, 22], color: "#FFF8EE" },
    { pos: [-14, 8, 6], size: [24, 16], color: "#D6E3FC" },
    { pos: [-6, -10, 8], size: [20, 14], color: "#F7CFE2" },
    { pos: [10, -5, -10], size: [16, 10], color: "#E6BC78" },
    { pos: [0, 16, -6], size: [28, 18], color: "#FDFBFF" },
  ];

  for (const p of panels) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(p.size[0], p.size[1]),
      new THREE.MeshBasicMaterial({ color: p.color, side: THREE.DoubleSide })
    );
    mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
    mesh.lookAt(0, 0, 0);
    envScene.add(mesh);
  }

  const envRT = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  return envRT.texture;
}

/**
 * Builds a monumental architectural white-marble arch (two fluted-feeling pillars + semi-circular lintel).
 */
function createMarbleArchGroup(
  radius: number,
  pillarHeight: number,
  thickness: number,
  marbleMat: THREE.Material,
  goldMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();

  // Semicircular arch crown
  const archGeom = new THREE.TorusGeometry(radius, thickness, 24, 64, Math.PI);
  const archMesh = new THREE.Mesh(archGeom, marbleMat);
  archMesh.position.y = pillarHeight * 0.5;
  archMesh.castShadow = true;
  archMesh.receiveShadow = true;
  group.add(archMesh);

  // Subtle pale champagne inner hairline trim
  const trimGeom = new THREE.TorusGeometry(
    radius - thickness * 0.92,
    0.022,
    10,
    64,
    Math.PI
  );
  const trimMesh = new THREE.Mesh(trimGeom, goldMat);
  trimMesh.position.y = pillarHeight * 0.5;
  group.add(trimMesh);

  // Left & right sculpted marble pillars
  const pillarGeom = new THREE.CylinderGeometry(
    thickness * 0.94,
    thickness * 1.06,
    pillarHeight,
    24
  );
  const leftPillar = new THREE.Mesh(pillarGeom, marbleMat);
  leftPillar.position.set(-radius, 0, 0);
  leftPillar.castShadow = true;
  leftPillar.receiveShadow = true;
  group.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeom, marbleMat);
  rightPillar.position.set(radius, 0, 0);
  rightPillar.castShadow = true;
  rightPillar.receiveShadow = true;
  group.add(rightPillar);

  // Subtle capital rings
  const capGeom = new THREE.CylinderGeometry(
    thickness * 1.18,
    thickness * 1.02,
    0.16,
    24
  );
  const leftCap = new THREE.Mesh(capGeom, marbleMat);
  leftCap.position.set(-radius, pillarHeight * 0.5, 0);
  group.add(leftCap);

  const rightCap = new THREE.Mesh(capGeom, marbleMat);
  rightCap.position.set(radius, pillarHeight * 0.5, 0);
  group.add(rightCap);

  return group;
}

/**
 * THE PEARL DREAM — Surreal Floating White Marble & Pearl Palace (Real-Time Three.js WebGL)
 */
export function PearlPalace3DWorld({
  cameraState,
  hoveredGate = null,
}: PearlPalace3DWorldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const cameraStateRef = useRef<ExperienceCameraState>(cameraState);
  const hoveredGateRef = useRef<GateId | null>(hoveredGate);

  useEffect(() => {
    cameraStateRef.current = cameraState;
  }, [cameraState]);

  useEffect(() => {
    hoveredGateRef.current = hoveredGate;
  }, [hoveredGate]);

  useEffect(() => {
    const container = containerRef.current;
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
      setWebglFailed(true);
      return;
    }

    const maxDpr = isNarrow ? 1.25 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isNarrow;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2("#F4F0E9", 0.028);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(
      44,
      window.innerWidth / window.innerHeight,
      0.1,
      90
    );
    const initialPreset = CAMERA_PRESETS[cameraStateRef.current];
    camera.position.set(...initialPreset.pos);

    // Procedural HDRI Environment
    const envMap = createPalaceStudioEnvironment(renderer);
    scene.environment = envMap;

    // Global Illumination & Volumetric Morning Sunrise Lighting
    const hemiLight = new THREE.HemisphereLight("#DCEAF4", "#F4E4E5", 1.22);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(
      initialPreset.sunColor,
      initialPreset.sunIntensity
    );
    sunLight.position.set(10, 14, 9);
    if (!isNarrow) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 40;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    const accentLight = new THREE.PointLight(
      initialPreset.accentColor,
      initialPreset.accentIntensity,
      36
    );
    accentLight.position.set(-5, 3, -3);
    scene.add(accentLight);

    const rimLight = new THREE.DirectionalLight("#DCEAF4", 0.72);
    rimLight.position.set(-9, 2, -10);
    scene.add(rimLight);

    // Shared PBR Materials
    const marbleTex = createMarbleTexture();
    const marbleMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FCFBF9"),
      map: marbleTex,
      roughness: 0.24,
      metalness: 0.02,
      clearcoat: 0.42,
      clearcoatRoughness: 0.22,
      envMapIntensity: 1.15,
    });

    const silkMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F9ECF4"),
      roughness: 0.3,
      metalness: 0.04,
      clearcoat: 0.38,
      sheen: 0.9,
      sheenColor: new THREE.Color("#FFFFFF"),
      sheenRoughness: 0.32,
    });

    const crystalGlassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FDFBFF"),
      roughness: 0.05,
      metalness: 0.0,
      transmission: 0.9,
      ior: 1.46,
      thickness: 1.25,
      transparent: true,
      opacity: 0.88,
      envMapIntensity: 1.55,
    });

    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FDFBFF"),
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 0.98,
      clearcoatRoughness: 0.08,
      iridescence: 0.88,
      iridescenceIOR: 1.35,
      transmission: 0.22,
      thickness: 0.85,
      envMapIntensity: 1.45,
    });

    const blushPearlMat = pearlMat.clone();
    blushPearlMat.color = new THREE.Color("#F8D4E4");

    const paleGoldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E2B670"),
      metalness: 0.94,
      roughness: 0.18,
      envMapIntensity: 1.5,
    });

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // =========================================================
    // 1. COLOSSAL WHITE MARBLE & PEARL ARCHES (Palace Colonnade)
    // =========================================================
    const arch1 = createMarbleArchGroup(4.2, 5.2, 0.28, marbleMat, paleGoldMat);
    arch1.position.set(0, -1.5, -2.6);
    worldGroup.add(arch1);

    const arch2 = createMarbleArchGroup(5.4, 6.2, 0.32, marbleMat, paleGoldMat);
    arch2.position.set(0, -1.7, -8.8);
    worldGroup.add(arch2);

    const arch3 = createMarbleArchGroup(6.6, 7.2, 0.36, marbleMat, paleGoldMat);
    arch3.position.set(0, -2.0, -15.5);
    worldGroup.add(arch3);

    // =========================================================
    // 2. FLOATING CURVED STAIRWAY INTO THE CLOUDS (InstancedMesh)
    // =========================================================
    const stepCount = 18;
    const stepGeom = new THREE.BoxGeometry(1.55, 0.11, 0.56);
    const stairInstanced = new THREE.InstancedMesh(
      stepGeom,
      marbleMat,
      stepCount
    );
    stairInstanced.castShadow = !isNarrow;
    stairInstanced.receiveShadow = !isNarrow;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < stepCount; i++) {
      const t = i / (stepCount - 1);
      const angle = -0.75 + t * 1.35;
      const radius = 4.6 - t * 1.1;
      const x = -Math.cos(angle) * radius - 0.6;
      const y = -3.6 + t * 4.9;
      const z = -1.2 - t * 11.5;
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, angle * 0.65, 0);
      dummy.scale.set(1 - t * 0.18, 1, 1);
      dummy.updateMatrix();
      stairInstanced.setMatrixAt(i, dummy.matrix);
    }
    stairInstanced.instanceMatrix.needsUpdate = true;
    worldGroup.add(stairInstanced);

    // =========================================================
    // 3. FLOATING CIRCULAR MARBLE PLATFORMS ABOVE CLOUDS
    // =========================================================
    const platformGeom = new THREE.CylinderGeometry(3.8, 3.4, 0.22, 56);
    const mainPlatform = new THREE.Mesh(platformGeom, marbleMat);
    mainPlatform.position.set(0, -3.7, -4.5);
    mainPlatform.receiveShadow = true;
    worldGroup.add(mainPlatform);

    const platformRimGeom = new THREE.TorusGeometry(3.82, 0.025, 12, 80);
    const platformRim = new THREE.Mesh(platformRimGeom, paleGoldMat);
    platformRim.position.set(0, -3.59, -4.5);
    platformRim.rotation.x = Math.PI / 2;
    worldGroup.add(platformRim);

    const farPlatformGeom = new THREE.CylinderGeometry(2.6, 2.2, 0.18, 44);
    const farPlatform = new THREE.Mesh(farPlatformGeom, marbleMat);
    farPlatform.position.set(2.4, -2.5, -11.5);
    worldGroup.add(farPlatform);

    // =========================================================
    // 4. 3D SCULPTED SILK RIBBONS WRAPPING THE PALACE
    // =========================================================
    const silkGeomA = new THREE.TorusKnotGeometry(
      2.6,
      0.24,
      isNarrow ? 90 : 140,
      isNarrow ? 16 : 26,
      2,
      3
    );
    const silkRibbonA = new THREE.Mesh(silkGeomA, silkMat);
    silkRibbonA.position.set(-4.1, 2.2, -6.2);
    silkRibbonA.scale.set(1.25, 0.72, 0.9);
    worldGroup.add(silkRibbonA);

    const silkGeomB = new THREE.TorusKnotGeometry(
      2.1,
      0.19,
      isNarrow ? 80 : 120,
      isNarrow ? 14 : 22,
      3,
      5
    );
    const silkRibbonB = new THREE.Mesh(silkGeomB, silkMat);
    silkRibbonB.position.set(4.5, -1.6, -7.8);
    silkRibbonB.scale.set(1.15, 0.68, 0.85);
    worldGroup.add(silkRibbonB);

    // =========================================================
    // 5. TRANSLUCENT CRYSTAL GLASS PANES (Realistic Reflections)
    // =========================================================
    const glassPaneGeom = new THREE.BoxGeometry(1.7, 4.4, 0.08);
    const glassPaneL = new THREE.Mesh(glassPaneGeom, crystalGlassMat);
    glassPaneL.position.set(-3.55, 0.25, -4.9);
    glassPaneL.rotation.set(0, 0.42, 0.04);
    worldGroup.add(glassPaneL);

    const glassPaneR = new THREE.Mesh(glassPaneGeom, crystalGlassMat);
    glassPaneR.position.set(3.65, 0.65, -5.6);
    glassPaneR.rotation.set(0, -0.46, -0.05);
    worldGroup.add(glassPaneR);

    // =========================================================
    // 6. LUMINOUS GEOMETRIC PORTAL RINGS (Distant Sanctuary)
    // =========================================================
    const haloGeomA = new THREE.TorusGeometry(2.85, 0.028, 12, 96);
    const haloA = new THREE.Mesh(haloGeomA, paleGoldMat);
    haloA.position.set(0, 1.0, -12.6);
    worldGroup.add(haloA);

    const haloGeomB = new THREE.TorusGeometry(3.5, 0.045, 16, 96);
    const haloB = new THREE.Mesh(haloGeomB, crystalGlassMat);
    haloB.position.set(0, 1.0, -12.8);
    haloB.rotation.set(0.22, 0.18, 0);
    worldGroup.add(haloB);

    // =========================================================
    // 7. MONUMENTAL & TRANSLUCENT PEARL SPHERES
    // =========================================================
    const sphereGeom = new THREE.SphereGeometry(
      1,
      isNarrow ? 28 : 42,
      isNarrow ? 28 : 42
    );
    const pearlSpecs: Array<{
      pos: [number, number, number];
      r: number;
      mat: THREE.MeshPhysicalMaterial;
      speed: number;
      phase: number;
    }> = [
      { pos: [-3.2, 2.9, -2.0], r: 0.72, mat: pearlMat, speed: 0.34, phase: 0.2 },
      { pos: [3.4, 2.4, -3.2], r: 0.54, mat: blushPearlMat, speed: 0.28, phase: 1.5 },
      { pos: [3.8, -1.2, -1.6], r: 0.92, mat: pearlMat, speed: 0.24, phase: 2.7 },
      { pos: [-3.9, -1.8, -3.6], r: 0.62, mat: blushPearlMat, speed: 0.31, phase: 3.9 },
      { pos: [0.6, 3.8, -6.5], r: 0.68, mat: pearlMat, speed: 0.26, phase: 5.1 },
      { pos: [-2.1, 1.4, -10.5], r: 1.15, mat: pearlMat, speed: 0.19, phase: 1.0 },
      { pos: [2.7, -0.5, -13.2], r: 0.95, mat: blushPearlMat, speed: 0.22, phase: 4.3 },
    ];

    const pearls = pearlSpecs.map((spec) => {
      const mesh = new THREE.Mesh(sphereGeom, spec.mat);
      mesh.position.set(...spec.pos);
      mesh.scale.setScalar(spec.r);
      worldGroup.add(mesh);
      return { mesh, baseY: spec.pos[1], speed: spec.speed, phase: spec.phase };
    });

    // =========================================================
    // 8. VOLUMETRIC GOLDEN SUNRISE SHAFTS PASSING THROUGH ARCHES
    // =========================================================
    const beamMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFF6E3"),
      transparent: true,
      opacity: 0.085,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const beamGeom = new THREE.PlaneGeometry(3.2, 16);
    const beamA = new THREE.Mesh(beamGeom, beamMat);
    beamA.position.set(1.8, 2.2, -5.4);
    beamA.rotation.set(0, 0.22, -0.34);
    worldGroup.add(beamA);

    const beamB = new THREE.Mesh(beamGeom, beamMat);
    beamB.position.set(-1.4, 2.6, -11.2);
    beamB.rotation.set(0, -0.18, -0.38);
    worldGroup.add(beamB);

    // =========================================================
    // 9. SPARSE SPARKLING CHAMPAGNE-GOLD MOTES
    // =========================================================
    const moteCount = isNarrow ? 36 : 56;
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePositions[i * 3] = (Math.random() - 0.5) * 14;
      motePositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      motePositions[i * 3 + 2] = -Math.random() * 18 + 2;
    }
    const moteGeom = new THREE.BufferGeometry();
    moteGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(motePositions, 3)
    );
    const sparkleTex = createSparkleTexture();
    const moteMat = new THREE.PointsMaterial({
      map: sparkleTex,
      size: 0.24,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const goldMotes = new THREE.Points(moteGeom, moteMat);
    worldGroup.add(goldMotes);

    // =========================================================
    // 10. LAYERED 3D VOLUMETRIC MIST CLOUDS (Below & Behind Palace)
    // =========================================================
    const cloudTex = createCloudMistTexture();
    const cloudMat = new THREE.SpriteMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.64,
      depthWrite: false,
    });

    const cloudSpecs: Array<{ pos: [number, number, number]; scale: [number, number] }> = [
      { pos: [-5.5, -3.9, -4.5], scale: [11, 5.5] },
      { pos: [5.4, -3.8, -6.2], scale: [12, 5.8] },
      { pos: [0.0, -4.4, -9.8], scale: [15, 6.2] },
      { pos: [-6.2, 2.8, -14.5], scale: [14, 7.2] },
      { pos: [6.0, 2.2, -16.0], scale: [14, 7.0] },
      { pos: [0.0, 4.4, -18.5], scale: [16, 7.5] },
    ];

    const clouds = cloudSpecs.map((c, idx) => {
      const sprite = new THREE.Sprite(cloudMat);
      sprite.position.set(...c.pos);
      sprite.scale.set(c.scale[0], c.scale[1], 1);
      worldGroup.add(sprite);
      return { sprite, baseX: c.pos[0], phase: idx * 1.4 };
    });

    // Pointer & Mobile Gyroscope Parallax
    let parallaxTargetX = 0;
    let parallaxTargetY = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    const onPointerMove = (e: PointerEvent) => {
      parallaxTargetX = (e.clientX / window.innerWidth - 0.5) * 1.15;
      parallaxTargetY = (e.clientY / window.innerHeight - 0.5) * -0.75;
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      parallaxTargetX = Math.max(-1.0, Math.min(1.0, (e.gamma / 38) * 1.0));
      parallaxTargetY = Math.max(
        -0.7,
        Math.min(0.7, ((e.beta - 45) / 40) * -0.7)
      );
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, {
      passive: true,
    });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Smooth camera & lighting interpolation vectors
    const currentCamPos = new THREE.Vector3(...initialPreset.pos);
    const currentLookAt = new THREE.Vector3(...initialPreset.lookAt);
    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();
    const targetFogColor = new THREE.Color();
    const targetSunColor = new THREE.Color();
    const targetAccentColor = new THREE.Color();

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
        if (slowFrames === 24) {
          renderer.setPixelRatio(1);
        }
      }

      const t = clock.getElapsedTime();
      const preset = CAMERA_PRESETS[cameraStateRef.current];
      const hovered = hoveredGateRef.current;

      // Mobile depth offset so portrait screens see the full palace arches comfortably
      const narrowZOffset = window.innerWidth < 640 ? 2.4 : 0;

      // Subtle hover nudge when hovering a Dream Gate in the hub
      let hoverNudgeX = 0;
      let hoverNudgeY = 0;
      let hoverNudgeZ = 0;
      if (cameraStateRef.current === "hub" && hovered) {
        if (hovered === "welcome") {
          hoverNudgeX = 0.55;
          hoverNudgeY = 0.25;
          hoverNudgeZ = -0.6;
        } else if (hovered === "jirtiq") {
          hoverNudgeX = -0.55;
          hoverNudgeY = 0.2;
          hoverNudgeZ = -0.6;
        } else if (hovered === "date") {
          hoverNudgeX = 0.4;
          hoverNudgeY = -0.25;
          hoverNudgeZ = -0.7;
        } else if (hovered === "location") {
          hoverNudgeX = -0.4;
          hoverNudgeY = -0.25;
          hoverNudgeZ = -0.7;
        }
      }

      parallaxX += (parallaxTargetX - parallaxX) * 0.045;
      parallaxY += (parallaxTargetY - parallaxY) * 0.045;

      targetCamPos.set(
        preset.pos[0] + parallaxX + hoverNudgeX,
        preset.pos[1] + parallaxY + hoverNudgeY,
        preset.pos[2] + narrowZOffset + hoverNudgeZ
      );
      targetLookAt.set(
        preset.lookAt[0] + parallaxX * 0.25,
        preset.lookAt[1] + parallaxY * 0.25,
        preset.lookAt[2]
      );

      // Cinematic Camera Flight Damping
      currentCamPos.lerp(targetCamPos, 0.048);
      currentLookAt.lerp(targetLookAt, 0.055);
      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      // Smooth Lighting & Fog Atmosphere Transition per World
      targetFogColor.set(preset.fogColor);
      fog.color.lerp(targetFogColor, 0.04);
      fog.density += (preset.fogDensity - fog.density) * 0.04;

      targetSunColor.set(preset.sunColor);
      sunLight.color.lerp(targetSunColor, 0.04);
      sunLight.intensity +=
        (preset.sunIntensity + Math.sin(t * 0.25) * 0.08 - sunLight.intensity) *
        0.04;
      sunLight.position.x = 10 + Math.sin(t * 0.16) * 1.8;

      targetAccentColor.set(preset.accentColor);
      accentLight.color.lerp(targetAccentColor, 0.04);
      accentLight.intensity +=
        (preset.accentIntensity - accentLight.intensity) * 0.04;

      // Living Architectural Elements Motion (Serene, Slow, Dreamlike)
      silkRibbonA.rotation.x = 0.35 + Math.sin(t * 0.14) * 0.12;
      silkRibbonA.rotation.y = 0.5 + t * 0.042;
      silkRibbonA.position.y = 2.2 + Math.sin(t * 0.2) * 0.24;

      silkRibbonB.rotation.x = -0.25 + Math.cos(t * 0.12) * 0.1;
      silkRibbonB.rotation.y = 0.7 - t * 0.036;
      silkRibbonB.position.y = -1.6 + Math.cos(t * 0.18) * 0.22;

      glassPaneL.position.y = 0.25 + Math.sin(t * 0.22) * 0.14;
      glassPaneR.position.y = 0.65 + Math.cos(t * 0.2) * 0.14;

      haloA.rotation.z = t * 0.04;
      haloB.rotation.z = -t * 0.03;
      haloB.rotation.y = 0.18 + Math.sin(t * 0.15) * 0.12;

      goldMotes.rotation.y = t * 0.018;
      goldMotes.position.y = Math.sin(t * 0.25) * 0.18;

      for (let i = 0; i < pearls.length; i++) {
        const p = pearls[i];
        p.mesh.position.y = p.baseY + Math.sin(t * p.speed + p.phase) * 0.26;
        p.mesh.rotation.y = t * 0.09 + p.phase;
      }

      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        c.sprite.position.x = c.baseX + Math.sin(t * 0.08 + c.phase) * 0.75;
      }

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

      stepGeom.dispose();
      platformGeom.dispose();
      platformRimGeom.dispose();
      farPlatformGeom.dispose();
      silkGeomA.dispose();
      silkGeomB.dispose();
      glassPaneGeom.dispose();
      haloGeomA.dispose();
      haloGeomB.dispose();
      sphereGeom.dispose();
      beamGeom.dispose();
      moteGeom.dispose();

      marbleMat.dispose();
      silkMat.dispose();
      crystalGlassMat.dispose();
      pearlMat.dispose();
      blushPearlMat.dispose();
      paleGoldMat.dispose();
      beamMat.dispose();
      moteMat.dispose();
      cloudMat.dispose();

      marbleTex.dispose();
      cloudTex.dispose();
      sparkleTex.dispose();
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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 86% 6%, #FFFBF4 0%, rgba(250, 224, 236, 0.88) 34%, transparent 68%), radial-gradient(ellipse at 12% 20%, rgba(212, 225, 250, 0.92) 0%, transparent 58%), radial-gradient(ellipse at 76% 90%, rgba(246, 206, 226, 0.82) 0%, transparent 58%), radial-gradient(ellipse at 25% 86%, rgba(226, 214, 250, 0.72) 0%, transparent 56%), linear-gradient(180deg, #FDFBFF 0%, #F5EEFA 46%, #E2EAFC 100%)",
      }}
    >
      {!webglFailed && (
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      )}

      {/* Subtle Atmospheric Rose-Gold Dawn Glow */}
      <div
        className="absolute -top-28 -right-24 h-[76vh] w-[88vw] rotate-12 opacity-65"
        style={{
          background:
            "conic-gradient(from 196deg at 82% 8%, transparent 0deg, rgba(255, 248, 236, 0.82) 16deg, transparent 34deg, rgba(226, 182, 112, 0.3) 48deg, rgba(246, 198, 222, 0.25) 60deg, transparent 74deg)",
          filter: "blur(26px)",
        }}
      />
    </div>
  );
}
