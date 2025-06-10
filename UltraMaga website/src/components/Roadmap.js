// src/components/Roadmap.js
import React from 'react';

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative w-full py-16 px-6 text-white text-center">
      <h2 className="text-4xl font-bold mb-12 text-white drop-shadow">THE GOLDEN AGE ROADMAP</h2>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Phase 1 */}
        <div className="bg-black bg-opacity-60 backdrop-blur-sm border border-red-600 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 drop-shadow">Phase 1: Rise of the Golden Age</h3>
          <ul className="list-disc list-inside text-lg text-left max-w-xl mx-auto">
            <li>
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30">Relaunch $MAGA on XRPL with updated vision</span>
            </li>
            <li>
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30">Deploy smart contract and lock liquidity</span>
            </li>
            <li>
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30">Activate social channels (X, Telegram)</span>
            </li>
            <li>
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30">Launch new website</span>
            </li>
            <li>
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30">Build trust through transparency and consistency</span>
            </li>
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="bg-black bg-opacity-60 backdrop-blur-sm border border-red-600 rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 drop-shadow">Phase 2: Spread the Flame</h3>
          <ul className="list-disc list-inside text-lg text-left max-w-xl mx-auto">
            <li>
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30">Grow the core community and mod team</span>
            </li>
            <li>
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30">Add $MAGA to analytics platforms like Dexscreener</span>
            </li>
            <li>
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30">Integrate Trump AI to the chat</span>
            </li>
            <li>
              <span className="text-green-400 mr-2">✔</span>
              <span className="text-white/30">Create a Memedeck profile for $MAGA meme creation and contests</span>
            </li>
            <li>Update all sites with latest updates</li>
            <li>Launch NFTs</li>
            </ul>
        </div>

        {/* Phase 3 */}
        <div className="bg-black bg-opacity-60 backdrop-blur-sm border border-red-600 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 drop-shadow">Phase 3: Build the Empire</h3>
          <ul className="list-disc list-inside text-lg text-left max-w-xl mx-auto">
            <li>Introduce a reward-based system for HODLers of $MAGA</li>
            <li>Launch community voting tools to shape decisions</li>
            <li>TBD</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
