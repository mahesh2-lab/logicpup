"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MousePointer2, FileCode2, PlayCircle } from 'lucide-react';
import * as THREE from 'three';

export const HowItWorksSection: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: "1. Connect Blocks",
      description: "Drag and drop visual logic blocks onto the canvas. Connect them to build the flow of your program without worrying about syntax.",
      icon: MousePointer2,
      color: "#F26A3D",
    },
    {
      title: "2. Fetch Real Code",
      description: "Behind the scenes, our AST engine translates your visual flowchart directly into clean, readable Python 3 code in real-time.",
      icon: FileCode2,
      color: "#356A9A",
    },
    {
      title: "3. Run & Learn",
      description: "Hit play to execute your program in the browser. See exactly how the code runs, step-by-step, making logic finally click.",
      icon: PlayCircle,
      color: "#287A52",
    },
  ];

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#FAF9F5', 10, 30);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2, 12);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xF26A3D, 2, 20);
    pointLight.position.set(-3, 0, 2);
    scene.add(pointLight);

    // 5. 3D Objects
    const group = new THREE.Group();
    scene.add(group);

    // Step 1: Blocks (Cubes)
    const blockMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      roughness: 0.2, 
      metalness: 0.1,
      transparent: true,
      opacity: 0.9
    });
    const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    
    const block1 = new THREE.Mesh(boxGeo, blockMat);
    block1.position.set(-4.5, 0, 0);
    block1.rotation.set(0.2, 0.4, 0.1);
    
    const block2 = new THREE.Mesh(boxGeo, blockMat);
    block2.position.set(-3.5, 1.5, -1);
    block2.rotation.set(-0.2, 0.1, 0.2);
    
    // Step 1: Edges (Tubes) connecting blocks
    class CustomCurve extends THREE.Curve<THREE.Vector3> {
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const x = -4.5 + (1 * t);
        const y = 0 + (1.5 * t);
        const z = 0 + (-1 * t);
        return optionalTarget.set(x, y, z);
      }
    }
    const tubeGeo = new THREE.TubeGeometry(new CustomCurve(), 20, 0.08, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xF26A3D });
    const cable = new THREE.Mesh(tubeGeo, tubeMat);
    
    group.add(block1, block2, cable);

    // Step 2: Code Particles (Floating snippets)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 100;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i+=3) {
      // Center them around x=0
      posArray[i] = (Math.random() - 0.5) * 4;
      posArray[i+1] = (Math.random() - 0.5) * 4;
      posArray[i+2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x356A9A,
      transparent: true,
      opacity: 0.8
    });
    const codeParticles = new THREE.Points(particleGeo, particleMat);
    group.add(codeParticles);

    // Step 3: Execution Runtime (Glowing Sphere / Torus)
    const gearGeo = new THREE.TorusGeometry(1, 0.2, 16, 32);
    const gearMat = new THREE.MeshStandardMaterial({
      color: 0x287A52,
      roughness: 0.3,
      metalness: 0.6,
      emissive: 0x287A52,
      emissiveIntensity: 0.4
    });
    const runtimeGear = new THREE.Mesh(gearGeo, gearMat);
    runtimeGear.position.set(4.5, 0.5, 0);
    group.add(runtimeGear);
    
    const coreGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.8
    });
    const runtimeCore = new THREE.Mesh(coreGeo, coreMat);
    runtimeCore.position.copy(runtimeGear.position);
    group.add(runtimeCore);

    // 6. Interaction (Mouse Follow)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Resize Handler
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let timer = new THREE.Timer();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update();
      const elapsed = timer.getElapsed();

      // Mouse Parallax
      targetX = mouseX * 2;
      targetY = mouseY * 2;
      group.rotation.y += (targetX - group.rotation.y) * 0.05;
      group.rotation.x += (targetY - group.rotation.x) * 0.05;

      // Animate Blocks
      block1.position.y = Math.sin(elapsed * 1.5) * 0.2;
      block2.position.y = 1.5 + Math.cos(elapsed * 1.2) * 0.2;
      
      // Animate Particles
      codeParticles.rotation.y = elapsed * 0.1;
      codeParticles.position.y = Math.sin(elapsed * 0.5) * 0.3;
      
      // Animate Runtime Gear
      runtimeGear.rotation.x = elapsed * 1.2;
      runtimeGear.rotation.y = elapsed * 1.5;
      runtimeCore.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.1);

      renderer.render(scene, camera);
    };
    animate();

    // 9. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      
      // Dispose materials/geometries
      boxGeo.dispose();
      blockMat.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      gearGeo.dispose();
      gearMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-b border-black/6 relative overflow-hidden bg-[#FAF9F5]">
      
      {/* 3D Canvas Background Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white border border-black/6 text-xs font-mono font-semibold text-[#121212] shadow-xs">
            <span>SIMPLE 3-STEP PROCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121212] tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-[#666666]">
            Transitioning from visual blocks to real code has never been smoother. Here's how we bridge the gap.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ originX: 0 }}
            className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-black/15 to-transparent z-0" 
          />
          
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-md border border-black/8 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-shadow duration-300"
            >
              <div 
                className="w-16 h-16 rounded-sm flex items-center justify-center mb-6 shadow-xs border border-black/6 transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: `${step.color}15`, color: step.color }}
              >
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-[#121212] mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
