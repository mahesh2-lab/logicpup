import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Terminal,
  Zap,
  Network,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Workflow,
  Compass,
  Code2,
} from 'lucide-react';
import { HeroFlowCanvas } from './HeroFlowCanvas';
import { MagneticWrapper } from './MagneticWrapper';

interface HeroSectionProps {
  onStartLearning: () => void;
  onExploreDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartLearning,
  onExploreDemo,
}) => {
  const heroRef = useRef<HTMLElement>(null);

  // Scroll Progress for Parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Spring physics for organic fluid motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Parallax transforms for various elements
  const tagY = useTransform(smoothProgress, [0, 1], [0, -25]);
  const headlineY = useTransform(smoothProgress, [0, 1], [0, -45]);
  const headlineScale = useTransform(smoothProgress, [0, 1], [1, 0.98]);
  const subheadlineY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const buttonsY = useTransform(smoothProgress, [0, 1], [0, -75]);
  const badgesY = useTransform(smoothProgress, [0, 1], [0, -90]);
  const canvasY = useTransform(smoothProgress, [0, 1], [0, 35]);
  const canvasScale = useTransform(smoothProgress, [0, 1], [1, 0.99]);

  // Floating background ambient depth elements transforms
  const floatNode1Y = useTransform(smoothProgress, [0, 1], [0, -130]);
  const floatNode1Rotate = useTransform(smoothProgress, [0, 1], [-2, 6]);
  const floatNode2Y = useTransform(smoothProgress, [0, 1], [0, -160]);
  const floatNode2Rotate = useTransform(smoothProgress, [0, 1], [3, -8]);
  const orb1Y = useTransform(smoothProgress, [0, 1], [0, -100]);
  const orb2Y = useTransform(smoothProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={heroRef}
      id="logicpup-hero-section"
      className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden"
    >
      {/* Ambient Parallax Gradient Orbs */}
      <motion.div
        style={{ y: orb1Y }}
        className="absolute top-10 left-1/4 w-96 h-96 rounded-sm bg-[#F26A3D]/[0.035] blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="absolute bottom-20 right-1/4 w-96 h-96 rounded-sm bg-[#356A9A]/[0.035] blur-3xl pointer-events-none -z-10"
      />

      {/* Floating Background Parallax Code Chips */}
      <motion.div
        style={{ y: floatNode1Y, rotate: floatNode1Rotate }}
        className="hidden xl:flex absolute left-8 top-32 z-0 items-center gap-2 px-3 py-2 rounded-sm bg-white/90 backdrop-blur-md border border-[#D8D4CC] shadow-xs text-xs font-mono text-[#171717] pointer-events-none"
      >
        <span className="w-2 h-2 rounded-sm bg-[#F26A3D]" />
        <span className="text-[#806A55]">if pup_knows_python == True:</span>
        <span className="text-[10px] text-[#287A52] font-semibold bg-[#287A52]/10 px-1.5 py-0.5 rounded-sm">
          Python 3.12 🐾
        </span>
      </motion.div>

      <motion.div
        style={{ y: floatNode2Y, rotate: floatNode2Rotate }}
        className="hidden xl:flex absolute right-8 top-40 z-0 items-center gap-2 px-3 py-2 rounded-sm bg-white/90 backdrop-blur-md border border-[#D8D4CC] shadow-xs text-xs font-mono text-[#171717] pointer-events-none"
      >
        <Code2 className="w-3.5 h-3.5 text-[#356A9A]" />
        <span className="text-[#555555]">LogicPup Engine:</span>
        <span className="font-semibold text-[#171717]">FETCH_CODE_SUCCESS</span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Top Header & Value Proposition */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Minimal Tag Pill with Parallax */}
          <motion.div
            style={{ y: tagY }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-white/90 backdrop-blur-md border border-[#D8D4CC] text-xs font-semibold text-[#171717] shadow-xs"
          >
            <Workflow className="w-3.5 h-3.5 text-[#F26A3D]" />
            <span>Visual Flowchart Coding for Python</span>
            <span className="hidden sm:inline text-[#806A55] font-mono">• No Leash, No Syntax Bites 🐶</span>
          </motion.div>

          {/* Primary Heading with Magnetic Cursor Drift Effect */}
          <motion.div
            style={{ y: headlineY, scale: headlineScale }}
            className="perspective-1000"
          >
            <MagneticWrapper
              id="hero-magnetic-heading"
              strength={0.16}
              radius={320}
              enableTilt={true}
              className="cursor-default"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-[#171717] tracking-tight leading-[1.15] sm:leading-[1.08] select-none transition-colors">
                Teach Yourself Python <br className="hidden sm:inline" />
                <span className="text-[#F26A3D] relative inline-block">
                  Through Visual Flowcharts.
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#F26A3D]/20 rounded-sm" />
                </span>
              </h1>
            </MagneticWrapper>
          </motion.div>

          {/* Subheadline with Parallax */}
          <motion.p
            style={{ y: subheadlineY }}
            className="text-sm sm:text-xl text-[#555555] leading-relaxed max-w-2xl mx-auto pt-3 sm:pt-0"
          >
            Connect blocks, branch decisions, and let LogicPup fetch real executable Python 3 code in real-time. Because chasing bugs should feel like a fun game of fetch — not barking up the wrong tree.
          </motion.p>

          {/* Primary Action Buttons with Magnetic Cursor Drift & Parallax */}
          <motion.div
            style={{ y: buttonsY }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
          >
            {/* Magnetic Primary Call to Action */}
            <MagneticWrapper
              id="hero-magnetic-cta-wrapper"
              strength={0.38}
              radius={180}
              enableTilt={true}
              className="w-auto"
            >
              <button
                id="hero-start-learning-cta"
                onClick={() => { window.location.href = "/login?mode=signup"; }}
                className="w-auto px-5 py-2.5 sm:px-6 sm:py-3.5 bg-[#F26A3D] hover:bg-[#D9552A] active:scale-98 text-white font-semibold text-sm sm:text-base rounded-sm shadow-[0_4px_14px_rgba(242,106,61,0.25)] hover:shadow-[0_6px_20px_rgba(242,106,61,0.35)] transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Start Learning <span className="hidden sm:inline">Python </span>(Free<span className="hidden sm:inline"> Forever</span>)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
            </MagneticWrapper>

            {/* Magnetic Secondary Action Button */}
            <MagneticWrapper
              id="hero-magnetic-demo-wrapper"
              strength={0.25}
              radius={150}
              enableTilt={false}
              className="w-auto"
            >
              <button
                id="hero-view-demo-cta"
                onClick={onExploreDemo}
                className="w-auto px-5 py-2.5 sm:px-6 sm:py-3.5 bg-white hover:bg-[#F4F1EA] text-[#171717] font-semibold text-sm sm:text-base rounded-sm border border-[#D8D4CC] shadow-xs hover:border-[#806A55]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-[#356A9A]" />
                <span>Try <span className="hidden sm:inline">Flowchart </span>Playground 🐾</span>
              </button>
            </MagneticWrapper>
          </motion.div>

          {/* Minimal Key Feature Badges with Parallax */}
          <motion.div
            style={{ y: badgesY }}
            className="hidden sm:flex pt-1 flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#555555]"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#287A52]" /> 4-Port Connecting Blocks (Top/Bottom/Left/Right)
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#287A52]" /> Real-Time Python 3.12 Code Generation
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#287A52]" /> Step-by-Step Logic & Live Variable Sniffing
            </span>
          </motion.div>
        </div>

        {/* Hero Interactive React Flow Canvas Display with Framer Motion Depth Layer */}
        <motion.div
          style={{
            y: canvasY,
            scale: canvasScale,
          }}
          className="relative will-change-transform pt-2"
        >
          <HeroFlowCanvas />
        </motion.div>
      </div>
    </section>
  );
};
