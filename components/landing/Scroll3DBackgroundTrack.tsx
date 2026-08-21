import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Scroll3DBackgroundTrack: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    // 2. Ambient & Subtle Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xF26A3D, 1.2);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x356A9A, 1.0);
    dirLight2.position.set(-10, -15, 10);
    scene.add(dirLight2);

    // 3. Floating 3D Geometric Node Clusters distributed along a vertical helical track
    const group = new THREE.Group();
    scene.add(group);

    const objects: {
      mesh: THREE.Mesh | THREE.LineSegments;
      baseY: number;
      baseX: number;
      baseZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      depthFactor: number;
    }[] = [];

    // Distinct materials matching TeachFlow tokens
    const matOrange = new THREE.MeshStandardMaterial({
      color: 0xF26A3D,
      roughness: 0.25,
      metalness: 0.5,
      transparent: true,
      opacity: 0.45,
    });
    const matBlue = new THREE.MeshStandardMaterial({
      color: 0x356A9A,
      roughness: 0.3,
      metalness: 0.6,
      transparent: true,
      opacity: 0.4,
    });
    const matGreen = new THREE.MeshStandardMaterial({
      color: 0x287A52,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.4,
    });
    const matWire = new THREE.MeshBasicMaterial({
      color: 0xD8D4CC,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.TorusGeometry(1.4, 0.08, 12, 48),
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.DodecahedronGeometry(1.0, 0),
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      new THREE.ConeGeometry(0.8, 1.6, 6),
      new THREE.TorusKnotGeometry(0.9, 0.2, 64, 8),
    ];

    const materials = [matOrange, matBlue, matGreen, matWire];

    // Create 18 distributed 3D models along the scroll track
    const total3DModels = 18;
    for (let i = 0; i < total3DModels; i++) {
      const geo = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geo, mat);

      // Distribute along left and right side gutters of the page
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * (8.5 + Math.random() * 3.5);
      const baseY = ((i / total3DModels) - 0.5) * 55;
      const baseZ = -2 + (Math.random() - 0.5) * 4;

      mesh.position.set(baseX, baseY, baseZ);
      group.add(mesh);

      objects.push({
        mesh,
        baseX,
        baseY,
        baseZ,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        depthFactor: 0.8 + Math.random() * 0.5,
      });
    }

    // Connective Data Spline Curve through 3D points
    const splinePoints = [];
    for (let i = 0; i < 9; i++) {
      splinePoints.push(
        new THREE.Vector3(
          Math.sin(i * 1.2) * 9,
          ((i / 8) - 0.5) * 55,
          -3 + Math.cos(i * 1.5) * 2
        )
      );
    }
    const spline = new THREE.CatmullRomCurve3(splinePoints);
    const tubeGeo = new THREE.TubeGeometry(spline, 100, 0.03, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xD8D4CC,
      transparent: true,
      opacity: 0.25,
    });
    const splineMesh = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(splineMesh);

    // 4. Scroll Tracking
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScrollable > 0 ? scrollY / totalScrollable : 0;
      targetScrollProgress = progress;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 5. Render Loop
    let animationFrameId: number;
    let timer = new THREE.Timer();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update();
      const delta = timer.getDelta();
      const elapsed = timer.getElapsed();

      // Smooth lerp scroll progress
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06;

      // Group position smoothly follows the scroll
      group.position.y = currentScrollProgress * 55 - 27.5;
      group.rotation.y = currentScrollProgress * Math.PI * 0.8 + Math.sin(elapsed * 0.1) * 0.05;

      // Rotate individual 3D objects
      objects.forEach((obj, idx) => {
        obj.mesh.rotation.x += obj.rotSpeedX;
        obj.mesh.rotation.y += obj.rotSpeedY;
        obj.mesh.rotation.z += obj.rotSpeedZ;

        // Subtle floating oscillation
        obj.mesh.position.y = obj.baseY + Math.sin(elapsed * 1.5 + idx) * 0.4;
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize Handler
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      id="scroll-3d-background-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-70"
    />
  );
};
