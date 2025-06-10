// src/components/Footer.js
import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 text-center text-gray-500 bg-black bg-opacity-40">
      Powered by the ULTRA MAGA XRP community – 2025
      <div className="mt-4 space-x-4">
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
      <div className="mt-4 text-xs max-w-3xl mx-auto text-gray-400">
        Crypto assets are highly volatile and carry risk. This project is for entertainment and community engagement purposes only and does not constitute financial advice. Always do your own research before investing in any digital asset.
      </div>
    </footer>
  );
}
