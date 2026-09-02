import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hero 3D — "Molecular Lattice".
 *
 * A polished icosahedral molecule (navy sapphire nodes, one vibrant-red marker
 * node, hairline bonds) suspended inside two orbital rings, with three floating
 * capsules. Rendered over the white ground with a soft ambient contact shadow.
 *
 * Performance contract:
 *  - Renders only while on-screen and while the tab is visible.
 *  - Device pixel ratio capped at 1.75.
 *  - prefers-reduced-motion renders a single static frame, then stops.
 *  - Pointer parallax is lerped inside the existing rAF loop — no extra listeners
 *    doing layout work.
 */

const NAVY = 0x06028a;
const NAVY_LIGHT = 0x2a1fd6;
const RED = 0xf23d26;
const PHI = (1 + Math.sqrt(5)) / 2;

function icosahedronVertices(radius: number): THREE.Vector3[] {
  const raw: [number, number, number][] = [
    [0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI],
    [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
    [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1]
  ];
  return raw.map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize().multiplyScalar(radius));
}

function icosahedronEdges(points: THREE.Vector3[]): [number, number][] {
  let min = Infinity;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      min = Math.min(min, points[i].distanceTo(points[j]));
    }
  }
  const edges: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (points[i].distanceTo(points[j]) < min * 1.05) edges.push([i, j]);
    }
  }
  return edges;
}

/** Soft radial falloff used as a fake, very cheap contact shadow. */
function contactShadowTexture(): THREE.Texture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(6, 2, 138, 0.30)');
  gradient.addColorStop(0.45, 'rgba(6, 2, 138, 0.12)');
  gradient.addColorStop(1, 'rgba(6, 2, 138, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface MoleculeSceneProps {
  className?: string;
  style?: React.CSSProperties;
}

export const MoleculeScene: React.FC<MoleculeSceneProps> = ({ className, style }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return; // No WebGL — the hero degrades to its CSS ambient layers.
    }

    const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 13.6);
    camera.lookAt(0, 0, 0);

    // ---------- Lighting: studio-soft, cool key from upper right ----------
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d2ec, 1.25));

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(5, 6.5, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xdfe6ff, 1.0);
    fill.position.set(-6, -1.5, 3.5);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffd9d2, 1.5);
    rim.position.set(-2.5, 3, -6);
    scene.add(rim);

    // ---------- Root group (all animated transforms live here) ----------
    const root = new THREE.Group();
    scene.add(root);

    // ---------- Contact shadow ----------
    const shadowTexture = contactShadowTexture();
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(11, 11),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.75
      })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -3.6;
    scene.add(shadow);

    // ---------- Molecule ----------
    const molecule = new THREE.Group();
    root.add(molecule);

    const radius = 2.35;
    const points = icosahedronVertices(radius);
    const edges = icosahedronEdges(points);

    const nodeMaterial = new THREE.MeshPhysicalMaterial({
      color: NAVY,
      roughness: 0.16,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      reflectivity: 0.6
    });
    const accentMaterial = new THREE.MeshPhysicalMaterial({
      color: RED,
      roughness: 0.2,
      metalness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color(RED),
      emissiveIntensity: 0.14
    });
    const bondMaterial = new THREE.MeshStandardMaterial({
      color: NAVY_LIGHT,
      roughness: 0.42,
      metalness: 0.1,
      transparent: true,
      opacity: 0.42
    });

    const nodeGeometry = new THREE.SphereGeometry(0.3, 32, 24);
    const accentIndices = new Set([0, 7]);

    points.forEach((point, index) => {
      const isAccent = accentIndices.has(index);
      const node = new THREE.Mesh(nodeGeometry, isAccent ? accentMaterial : nodeMaterial);
      node.position.copy(point);
      node.scale.setScalar(isAccent ? 1.16 : 1);
      molecule.add(node);
    });

    // Bonds via a single instanced cylinder
    const bondGeometry = new THREE.CylinderGeometry(0.028, 0.028, 1, 10, 1, true);
    const bonds = new THREE.InstancedMesh(bondGeometry, bondMaterial, edges.length);
    const up = new THREE.Vector3(0, 1, 0);
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const midpoint = new THREE.Vector3();
    const direction = new THREE.Vector3();

    edges.forEach(([a, b], index) => {
      midpoint.addVectors(points[a], points[b]).multiplyScalar(0.5);
      direction.subVectors(points[b], points[a]);
      const length = direction.length();
      quaternion.setFromUnitVectors(up, direction.clone().normalize());
      matrix.compose(midpoint, quaternion, new THREE.Vector3(1, length, 1));
      bonds.setMatrixAt(index, matrix);
    });
    bonds.instanceMatrix.needsUpdate = true;
    molecule.add(bonds);

    // Faceted inner core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.18, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.08,
        metalness: 0.0,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        transparent: true,
        opacity: 0.9,
        flatShading: true
      })
    );
    molecule.add(core);

    // ---------- Orbital rings ----------
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: NAVY,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.3
    });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.013, 8, 180), ringMaterial);
    ringA.rotation.set(Math.PI / 2.35, 0.15, 0);
    root.add(ringA);

    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(4.3, 0.009, 8, 180),
      new THREE.MeshStandardMaterial({
        color: RED,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: 0.34
      })
    );
    ringB.rotation.set(Math.PI / 1.75, 0.6, 0.4);
    root.add(ringB);

    // ---------- Floating capsules (dosage forms) ----------
    const capsuleGeometry = new THREE.CapsuleGeometry(0.2, 0.44, 12, 24);
    const capsules: { mesh: THREE.Mesh; orbit: number; speed: number; phase: number; y: number; tilt: number }[] = [];

    const capsuleSpecs = [
      { color: NAVY, orbit: 3.95, speed: 0.22, phase: 0.0, y: 1.45, tilt: 0.6, opacity: 1 },
      { color: RED, orbit: 4.45, speed: -0.17, phase: 2.2, y: -1.3, tilt: -0.9, opacity: 1 },
      { color: 0xffffff, orbit: 3.4, speed: 0.29, phase: 4.1, y: -2.0, tilt: 0.3, opacity: 1 }
    ];

    capsuleSpecs.forEach((spec) => {
      const mesh = new THREE.Mesh(
        capsuleGeometry,
        new THREE.MeshPhysicalMaterial({
          color: spec.color,
          roughness: spec.color === 0xffffff ? 0.22 : 0.18,
          metalness: 0.02,
          clearcoat: 1,
          clearcoatRoughness: 0.06
        })
      );
      root.add(mesh);
      capsules.push({ mesh, orbit: spec.orbit, speed: spec.speed, phase: spec.phase, y: spec.y, tilt: spec.tilt });
    });

    // ---------- Interaction & loop ----------
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handlePointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    if (!reduceMotion) window.addEventListener('pointermove', handlePointer, { passive: true });

    const clock = new THREE.Clock();
    let frameId = 0;
    let visible = true;

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();

      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;

      root.rotation.y = elapsed * 0.13 + pointer.x * 0.32;
      root.rotation.x = Math.sin(elapsed * 0.22) * 0.06 - pointer.y * 0.18;
      root.position.y = Math.sin(elapsed * 0.5) * 0.16;

      molecule.rotation.y = elapsed * 0.2;
      molecule.rotation.z = Math.sin(elapsed * 0.3) * 0.1;

      core.rotation.x = -elapsed * 0.35;
      core.rotation.y = -elapsed * 0.28;

      ringA.rotation.z = elapsed * 0.14;
      ringB.rotation.z = -elapsed * 0.1;

      capsules.forEach((capsule) => {
        const angle = elapsed * capsule.speed + capsule.phase;
        capsule.mesh.position.set(
          Math.cos(angle) * capsule.orbit,
          capsule.y + Math.sin(elapsed * 0.6 + capsule.phase) * 0.28,
          Math.sin(angle) * capsule.orbit * 0.55
        );
        capsule.mesh.rotation.set(capsule.tilt, angle * 1.4, angle * 0.8);
      });

      shadow.material.opacity = 0.62 + Math.sin(elapsed * 0.5) * 0.05;

      renderer.render(scene, camera);
    };

    const loop = () => {
      frameId = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      renderFrame();
    };

    if (reduceMotion) {
      renderFrame();
    } else {
      loop();
    }

    // Pause when scrolled out of view
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(mount);

    // ---------- Resize ----------
    const resizeObserver = new ResizeObserver(() => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (reduceMotion) renderFrame();
    });
    resizeObserver.observe(mount);

    // ---------- Teardown ----------
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('pointermove', handlePointer);

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else if (material) material.dispose();
      });
      shadowTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} style={style} aria-hidden="true" />;
};
