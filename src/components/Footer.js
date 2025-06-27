// src/components/Footer.js
import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-20 bg-black bg-opacity-80 text-white text-center py-6 mt-16 text-lg sm:text-base md:text-xl">
      <div className="font-semibold mb-2">
        Powered by the ULTRA MAGA XRP community – 2025
      </div>

      <div className="mt-2 space-x-4">
        <a
          href="https://t.me/UltraMagaXRP"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          Telegram
        </a>
        <span>|</span>
        <a
          href="https://x.com/Ultra_MAGA_XRPL"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          X
        </a>
      </div>

      <div className="mt-4 text-md sm:text-md md:text-base max-w-3xl mx-auto text-gray-400 px-4">
        Crypto assets are highly volatile and carry risk. This project is for entertainment and community engagement purposes only and does not constitute financial advice. Always do your own research before investing in any digital asset.
      </div>
    </footer>
  );
}
