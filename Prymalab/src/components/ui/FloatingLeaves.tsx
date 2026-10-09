'use client';

import React from 'react';
import { motion } from 'framer-motion';

const petals = [
  {
    // Sakura petal 1
    path: "M12.4,2.5c-0.4-0.1-0.8,0.2-0.9,0.5C11.1,4.5,10,5.7,8.5,6C6.7,6.3,5.1,5.3,4,4C3.8,3.7,3.3,3.7,3.1,4C1.9,5.7,1.4,7.8,1.6,9.9c0.4,3.8,3,7.2,6.5,8.7c1.2,0.5,2.6,0.8,4,0.8c1.3,0,2.7-0.3,3.9-0.8c3.5-1.5,6.1-4.9,6.5-8.7c0.2-2.1-0.2-4.2-1.4-5.9C20.8,3.7,20.4,3.7,20.1,4c-1.1,1.3-2.6,2.3-4.5,2c-1.5-0.3-2.6-1.5-3-3C12.5,2.7,12.2,2.4,12.4,2.5z",
    width: 24,
    height: 24
  },
  {
    // Sakura petal 2 (Heart-like)
    path: "M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z",
    width: 24,
    height: 24
  },
  {
    // Sakura petal 3 (Teardrop)
    path: "M12,2C12,2,4,9,4,14C4,18.42,7.58,22,12,22C16.42,22,20,18.42,20,14C20,9,12,2,12,2Z",
    width: 24,
    height: 24
  }
];

export function FloatingLeaves() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Generate 15 petals spread across the screen */}
      {[...Array(15)].map((_, i) => {
        const petal = petals[i % petals.length];
        // Stable across server rendering, hydration and subsequent renders.
        const randomX = ((i * 37 + 11) % 100);
        const randomDelay = ((i * 17) % 50) / 10;
        const randomDuration = 12 + ((i * 7) % 15);
        const randomScale = 0.4 + ((i * 13) % 8) / 10;
        const randomRotation = (i * 137) % 360;
        
        return (
          <motion.div
            key={i}
            className="absolute text-[#FFB7C5]/70" // Soft sakura pink with higher opacity
            initial={{ 
              x: `${randomX}vw`, 
              y: '-10vh', 
              rotate: randomRotation,
              scale: randomScale 
            }}
            animate={{ 
              y: '110vh',
              rotate: randomRotation + (i % 2 ? 360 : -360),
              x: `${randomX + ((i * 11) % 20 - 10)}vw`
            }}
            transition={{ 
              duration: randomDuration, 
              repeat: Infinity, 
              ease: 'linear',
              delay: randomDelay 
            }}
          >
            <svg 
              width={petal.width * 2} 
              height={petal.height * 2} 
              viewBox={`0 0 ${petal.width} ${petal.height}`} 
              fill="currentColor"
            >
              <path d={petal.path} />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
