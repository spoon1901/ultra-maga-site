import React, { useState } from 'react';
import './style.css';
import Hero from './components/Hero';
import About from './components/About';
import Tokenomics from './components/Tokenomics';
import Roadmap from './components/Roadmap';
import HowToBuy from './components/HowToBuy';
import Footer from './components/Footer';

export default function App() {
  const isDev = process.env.NODE_ENV === 'development';
  const [showRoadmap, setShowRoadmap] = useState(true);
  const renderRoadmap = isDev ? showRoadmap : true;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <nav className="fixed top-0 left-0 w-full z-40 px-6 py-4 flex items-center bg-black bg-opacity-50 backdrop-blur-md">
        <div className="text-2xl font-bold">ULTRA $MAGA</div>
        <div className="ml-auto flex space-x-4">
          <a href="#home" className="hover:text-blue-400">HOME</a>
          <a href="#about" className="hover:text-blue-400">ABOUT</a>
          <a href="#tokenomics" className="hover:text-blue-400">TOKENOMICS</a>
          <a href="#roadmap" className="hover:text-blue-400">ROADMAP</a>
          <a href="#buy" className="hover:text-blue-400">HOW TO BUY</a>
        </div>
      </nav>
      <div className="relative z-10 flex flex-col">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed top-0 left-0 w-full h-full object-contain z-0 brightness-100 contrast-125 saturate-150"
        >
          <source src="https://files.catbox.moe/dk5iyo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Hero />
        <About />
        <Tokenomics />
        {renderRoadmap && <Roadmap />}
        <HowToBuy />
        <Footer />
      </div>
    </div>
  );
}