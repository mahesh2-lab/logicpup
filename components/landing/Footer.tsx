import React from 'react';
import {
  Boxes,
  BookOpen,
  Terminal,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="teachflow-footer"
      className="border-t border-black/[0.06] bg-white/60 py-12 md:py-16 text-[#666666]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-black/[0.06]">
          
          {/* Brand Col (4 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#F26A3D] text-white flex items-center justify-center shadow-xs">
                <Boxes className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-lg text-[#121212] tracking-tight">
                TeachFlow
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-sm">
              The modern interactive learning environment for visual logic programming,
              AST compilation, and asynchronous workflows.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs font-mono text-[#888888]">
              <span>Made for Developers & Learners</span>
            </div>
          </div>

          {/* Nav Links (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-[#121212] uppercase tracking-wider font-mono">
                Curriculum
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#curriculum" className="hover:text-[#121212] transition-colors">
                    Level 1: Logic Gates
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="hover:text-[#121212] transition-colors">
                    Level 2: Conditionals
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="hover:text-[#121212] transition-colors">
                    Level 3: Webhook Streams
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="hover:text-[#121212] transition-colors">
                    Level 6: Gemini AI Nodes
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs text-[#121212] uppercase tracking-wider font-mono">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#features" className="hover:text-[#121212] transition-colors">
                    React Flow Engine
                  </a>
                </li>
                <li>
                  <a href="#interactive-demo-playground" className="hover:text-[#121212] transition-colors">
                    In-Browser Playground
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#121212] transition-colors">
                    AST Code Generator
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#121212] transition-colors">
                    Local-First Storage
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs text-[#121212] uppercase tracking-wider font-mono">
                Community
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="hover:text-[#121212] transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#121212] transition-colors">
                    Flow Examples
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#121212] transition-colors">
                    Discord Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#121212] transition-colors">
                    GitHub Repo
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#888888]">
          <div>
            © {new Date().getFullYear()} TeachFlow Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#121212] transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-[#121212] transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-[#121212] transition-colors">
              Security
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
