// src/components/Hero.js
import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-8 bg-black bg-opacity-60 backdrop-blur-sm border border-red-600 rounded-xl p-8 shadow-lg max-w-4xl w-full text-center">
        <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-4 text-white drop-shadow">
          ULTRA $MAGA
        </h1>

        <p className="text-xl sm:text-3xl md:text-4xl lg:text-2xl mb-4 text-white">
          The people’s token is back. Fuel the freedom. Dominate the XRPL. <br />
          Welcome to the Golden Age of Memes.
        </p>

        <div className="bg-black text-white rounded-md px-4 py-2 text-base sm:text-2xl md:text-3xl lg:text-xl font-mono mb-6 border border-red-600 flex items-center justify-center">
          rwH49FHnr48FeUP7NX9EuL4k1peLrPwS3d
          <button
            onClick={() => navigator.clipboard.writeText("rwH49FHnr48FeUP7NX9EuL4k1peLrPwS3d")}
            className="ml-2 text-white hover:text-red-500"
            title="Copy to clipboard"
          >
            <img
              src="https://files.catbox.moe/m51h4t.png"
              alt="Copy"
              className="w-full h-full object-contain"
            />
          </button>
        </div>

        <div className="flex justify-center items-center space-x-6 mt-4">

          <a href="https://x.com/Ultra_MAGA_XRPL" target="_blank" rel="noopener noreferrer" className="hover:animate-bounce" title="X">
            <div className="w-[3rem] h-[3rem] flex items-center justify-center">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X" className="w-full h-full object-contain" />
            </div>
          </a>

          <a href="https://t.me/UltraMAGAXRP" target="_blank" rel="noopener noreferrer" className="hover:animate-bounce" title="Telegram">
            <div className="w-[3rem] h-[3rem] flex items-center justify-center">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg" alt="Telegram" className="w-full h-full object-contain" />
            </div>
          </a>

          <a href="https://www.tiktok.com/@ultra_maga_xrpl" target="_blank" rel="noopener noreferrer" className="hover:animate-bounce" title="TikTok">
            <div className="w-[3rem] h-[3rem] flex items-center justify-center">
              <img src="https://files.catbox.moe/rtxl3m.png" alt="TikTok" className="w-full h-full object-contain" />
            </div>
          </a>

          <a href="https://dexscreener.com/xrpl/4d41474100000000000000000000000000000000.rwh49fhnr48feup7nx9eul4k1pelrpws3d_xrp" target="_blank" rel="noopener noreferrer" className="hover:animate-bounce" title="DexScreener">
            <div className="w-[3rem] h-[3rem] flex items-center justify-center">
              <img src="https://i.imgur.com/pXfkND9.png" alt="DexScreener" className="w-full h-full object-contain" />
            </div>
          </a>

          <a href="https://xmagnetic.org/?token=rwH49FHnr48FeUP7NX9EuL4k1peLrPwS3d" target="_blank" rel="noopener noreferrer" className="hover:animate-bounce" title="XMagnetic">
            <div className="w-[3rem] h-[3rem] flex items-center justify-center">
              <img src="https://i.imgur.com/bjIraur.png" alt="XMagnetic" className="w-full h-full object-contain" />
            </div>
          </a>

          <a href="https://firstledger.net/token/rwH49FHnr48FeUP7NX9EuL4k1peLrPwS3d/4D41474100000000000000000000000000000000" target="_blank" rel="noopener noreferrer" className="hover:animate-bounce" title="FirstLedger (Verified)">
            <div className="w-[3rem] h-[3rem] flex items-center justify-center">
              <img src="https://files.catbox.moe/hnqcbg.png" alt="FirstLedger" className="w-full h-full object-contain" />
            </div>
          </a>

          <a href="https://xpmarket.com/token/MAGA-rwH49FHnr48FeUP7NX9EuL4k1peLrPwS3d" target="_blank" rel="noopener noreferrer" className="hover:animate-bounce" title="xpmarket">
            <div className="w-[3rem] h-[3rem] flex items-center justify-center">
              <img src="https://files.catbox.moe/wlebau.png" alt="xpmarket" className="w-full h-full object-contain" />
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
