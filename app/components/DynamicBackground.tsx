"use client";

import React from 'react';

export default function DynamicBackground() {
  // Positions et durées fixes pour les particules
  const particles = [
    { left: "10%", top: "20%", duration: "3s", delay: "0s" },
    { left: "20%", top: "40%", duration: "4s", delay: "0.5s" },
    { left: "30%", top: "60%", duration: "3.5s", delay: "1s" },
    { left: "40%", top: "30%", duration: "4.2s", delay: "1.5s" },
    { left: "50%", top: "50%", duration: "3.8s", delay: "0.2s" },
    { left: "60%", top: "70%", duration: "4.5s", delay: "0.8s" },
    { left: "70%", top: "40%", duration: "3.2s", delay: "1.2s" },
    { left: "80%", top: "60%", duration: "4s", delay: "0.3s" },
    { left: "90%", top: "30%", duration: "3.7s", delay: "0.7s" },
    { left: "15%", top: "80%", duration: "4.3s", delay: "1.1s" },
    { left: "25%", top: "90%", duration: "3.9s", delay: "0.4s" },
    { left: "35%", top: "10%", duration: "4.1s", delay: "0.9s" },
    { left: "45%", top: "25%", duration: "3.4s", delay: "1.3s" },
    { left: "55%", top: "35%", duration: "4.4s", delay: "0.6s" },
    { left: "65%", top: "45%", duration: "3.6s", delay: "1.4s" },
    { left: "75%", top: "55%", duration: "4.6s", delay: "0.1s" },
    { left: "85%", top: "65%", duration: "3.3s", delay: "0.8s" },
    { left: "95%", top: "75%", duration: "4.7s", delay: "1.5s" },
    { left: "5%", top: "85%", duration: "3.8s", delay: "0.2s" },
    { left: "15%", top: "95%", duration: "4.8s", delay: "0.9s" }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Demi-cercle coucher de soleil */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80rem] h-[40rem] bg-gradient-to-t from-orange-500/20 via-purple-500/20 to-transparent rounded-t-[50%] blur-3xl"></div>

      {/* Cercles lumineux */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] bg-blue-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-violet-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Lignes verticales animées */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/40 to-transparent animate-pulse"></div>
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/40 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Particules flottantes avec positions fixes */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-floatingParticle"
          style={{
            left: particle.left,
            top: particle.top,
            animationDuration: particle.duration,
            animationDelay: particle.delay,
          }}
        ></div>
      ))}

      {/* Styles pour les animations */}
      <style jsx global>{`
        @keyframes floatingParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) translateX(20px);
            opacity: 0;
          }
        }

        .animate-floatingParticle {
          animation: floatingParticle 3s infinite;
        }
      `}</style>
    </div>
  );
} 