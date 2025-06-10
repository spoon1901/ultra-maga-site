// src/components/Tokenomics.js
import React from 'react';

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="relative w-full py-20 px-6 text-white text-center">
      <div className="bg-black bg-opacity-60 backdrop-blur-sm border border-red-600 rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-6 text-white drop-shadow">
TOKENOMICS</h2>
        <div className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white space-y-4 text-left">

          <p><strong>Name:</strong> ULTRA $MAGA</p>
          <p><strong>Issuer:</strong> rwH49FHnr48FeUP7NX9EuL4k1peLrPwS3d</p>
          <p><strong>Total Supply:</strong> 99.9M $MAGA</p>
          <p><strong>Circulating Supply:</strong> 90.8M $MAGA</p>
          <p><strong>Blackholed Issuer:</strong> Yes ✅</p>
          <p><strong>Liquidity Locked:</strong> Yes ✅</p>
        </div>
      </div>
    </section>
  );
}
