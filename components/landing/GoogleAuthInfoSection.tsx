"use client";
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCircle, Database } from 'lucide-react';
import Link from 'next/link';

export const GoogleAuthInfoSection: React.FC = () => {
  return (
    <section id="google-auth-info" className="py-16 md:py-24 border-t border-black/6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#FAF9F5] border border-black/6 text-xs font-mono font-semibold text-[#121212] shadow-xs">
            <ShieldCheck size={14} className="text-[#F26A3D]" />
            <span>SECURE AUTHENTICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121212] tracking-tight">
            Why we use Google
          </h2>
          <p className="text-base sm:text-lg text-[#666666]">
            We use Google Sign-In so you can create an account and save your progress across coding levels without creating a separate password.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 bg-[#FAF9F5] border border-black/8 rounded-sm shadow-sm flex flex-col items-start"
          >
            <div className="w-12 h-12 rounded-sm bg-white border border-black/6 flex items-center justify-center mb-6 shadow-xs text-[#356A9A]">
              <UserCircle size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-[#121212] mb-3 tracking-tight">
              Scopes Requested
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-[#666666] leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#F26A3D] font-bold">•</span>
                <span><strong>openid, email, profile</strong> — to identify you and create your LogicPup account.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="p-8 bg-[#FAF9F5] border border-black/8 rounded-sm shadow-sm flex flex-col items-start"
          >
            <div className="w-12 h-12 rounded-sm bg-white border border-black/6 flex items-center justify-center mb-6 shadow-xs text-[#287A52]">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-[#121212] mb-3 tracking-tight">
              Data Privacy
            </h3>
            <p className="text-sm sm:text-base text-[#666666] leading-relaxed mb-4">
              Your data is stored securely and is strictly used to maintain your project states, coding level progression, and account identification.
            </p>
            <Link href="/privacy" className="inline-flex items-center text-sm font-bold text-[#F26A3D] hover:text-[#171717] transition-colors underline decoration-[#F26A3D]/30 underline-offset-4">
              Read our full Privacy Policy &rarr;
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
