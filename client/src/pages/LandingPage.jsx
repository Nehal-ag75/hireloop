import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#111827] font-sans antialiased selection:bg-[#4338CA]/10 flex flex-col justify-between">
      
      {/* Minimal Header */}
      <header className="max-w-6xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#4338CA] flex items-center justify-center text-white text-xs font-black">
            H
          </div>
          <span className="font-bold text-sm tracking-tight text-[#111827]">HireLoop</span>
        </div>
        <button className="text-xs font-semibold border border-[#E5E7EB] bg-white hover:bg-[#FAFAFC] px-4 py-2 rounded-xl transition-all duration-150 shadow-xs">
          Sign In
        </button>
      </header>

      {/* Main Ultra-Minimal Layout */}
      <main className="max-w-3xl w-full mx-auto px-6 py-24 my-auto">
        <div className="text-[11px] font-bold tracking-widest uppercase text-[#4338CA] mb-4">
          Welcome to HireLoop
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111827] leading-[1.12] mb-6">
          An intentional workspace engineered for focused placement preparation.
        </h1>
        
        {/* Clean Interaction Layout */}
        <div className="pt-4">
          <button className="bg-[#4338CA] hover:bg-[#4338CA]/90 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all duration-150 shadow-sm shadow-[#4338CA]/10">
            Start Preparation
          </button>
        </div>
      </main>

      {/* Empty Footer for balanced vertical spacing alignment */}
      <footer className="h-20" />
    </div>
  );
}