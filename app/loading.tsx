"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Boxes, ArrowRight, FileCode2 } from "lucide-react";

export default function Loading() {
  const [loadingText, setLoadingText] = useState("Connecting logic blocks");

  useEffect(() => {
    const texts = [
      "Connecting logic blocks...",
      "Compiling abstract syntax...",
      "Fetching Python runtime...",
      "Almost ready..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF9F5] font-sans">
      <div className="flex flex-col items-center">
        {/* Animated Icons Container */}
        <div className="flex items-center gap-4 mb-8">
          
          {/* Block 1 */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-14 h-14 rounded-lg bg-white border-2 border-[#121212] shadow-[4px_4px_0px_#121212] flex items-center justify-center text-[#F26A3D]"
          >
            <Boxes className="w-7 h-7" />
          </motion.div>

          {/* Flow Arrow */}
          <motion.div
            animate={{ 
              x: [0, 10, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="text-[#121212]"
          >
            <ArrowRight className="w-6 h-6" strokeWidth={3} />
          </motion.div>

          {/* Block 2 */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              delay: 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-14 h-14 rounded-lg bg-[#121212] border-2 border-[#121212] shadow-[4px_4px_0px_#F26A3D] flex items-center justify-center text-white"
          >
            <FileCode2 className="w-7 h-7" />
          </motion.div>
        </div>

        {/* Loading Text */}
        <div className="h-6 flex items-center justify-center">
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm font-mono font-semibold text-[#121212] tracking-wide"
          >
            {loadingText}
          </motion.p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-48 h-1.5 bg-black/5 rounded-full mt-4 overflow-hidden">
          <motion.div 
            animate={{ 
              x: ["-100%", "100%"] 
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-1/2 h-full bg-[#F26A3D] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
