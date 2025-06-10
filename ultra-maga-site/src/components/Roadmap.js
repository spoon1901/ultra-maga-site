// src/components/Roadmap.js
import React from 'react';

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative w-full py-16 px-6 text-white text-center">
      <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-12 text-white drop-shadow">THE GOLDEN AGE ROADMAP</h2>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Phase 1 */}
        <div className="bg-black bg-opacity-60 backdrop-blur-sm border border-red-600 rounded-xl p-8 shadow-lg">
          <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-4 text-white drop-shadow">Phase 1: Rise of the Golden Age</h3>
          <ul className="list-disc list-inside text-left max-w-xl mx-auto space-y-2">
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30 text-xl sm:text-3xl md:text-4xl lg:text-2xl">Relaunch $MAGA on XRPL with updated vision</span>
            </li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30 text-xl sm:text-3xl md:text-4xl lg:text-2xl">Deploy smart contract and lock liquidity</span>
            </li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30 text-xl sm:text-3xl md:text-4xl lg:text-2xl">Activate social channels (X, Telegram)</span>
            </li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30 text-xl sm:text-3xl md:text-4xl lg:text-2xl">Launch new website</span>
            </li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30 text-xl sm:text-3xl md:text-4xl lg:text-2xl">Build trust through transparency and consistency</span>
            </li>
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="bg-black bg-opacity-60 backdrop-blur-sm border border-red-600 rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-4 text-white drop-shadow">Phase 2: Spread the Flame</h3>
          <ul className="list-disc list-inside text-left max-w-xl mx-auto space-y-2">
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30 text-xl sm:text-3xl md:text-4xl lg:text-2xl">Grow the core community and mod team</span>
            </li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30 text-xl sm:text-3xl md:text-4xl lg:text-2xl">Add $MAGA to analytics platforms like Dexscreener</span>
            </li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30 text-xl sm:text-3xl md:text-4xl lg:text-2xl">Integrate Trump AI to the chat</span>
            </li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30 text-xl sm:text-3xl md:text-4xl lg:text-2xl">Create a Memedeck profile for $MAGA meme creation and contests</span>
            </li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">Update all sites with latest updates</li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">Launch NFTs</li>
          </ul>
        </div>

        {/* Phase 3 */}
        <div className="bg-black bg-opacity-60 backdrop-blur-sm border border-red-600 rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-4 text-white drop-shadow">Phase 3: Build the Empire</h3>
          <ul className="list-disc list-inside text-left max-w-xl mx-auto space-y-2">
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">Introduce a reward-based system for HODLers of $MAGA</li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">Launch community voting tools to shape decisions</li>
            <li className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white">TBD</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
