// src/components/HowToBuy.js
import React from 'react';

export default function HowToBuy() {
  return (
    <section id="buy" className="relative w-full py-20 px-6 text-white text-center">
      <div className="bg-black bg-opacity-60 backdrop-blur-sm border border-red-600 rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-6 text-white drop-shadow">HOW TO BUY ULTRA $MAGA</h2>
        <div className="space-y-10 text-left">
          <div>
            <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-2 text-white drop-shadow">1. Choose a wallet</h3>
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white drop-shadow">Download one of the wallets below.</p>
            <a
              href="https://joeywallet.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Joey Wallet
            </a>
            <br />
            <a
              href="https://xaman.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-blue-400 underline"
            >
              XAMAN Wallet
            </a>
          </div>

          <div>
            <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-2 text-white drop-shadow">2. Get Some XRP</h3>
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white drop-shadow">
              Buy XRP from any exchange and send it to your chosen wallet. Leave some for fees.
            </p>
            <a
              href="https://www.binance.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Binance
            </a>
            <br />
            <a
              href="https://www.coinbase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Coinbase
            </a>
            <br />
            <a
              href="https://www.crypto.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Crypto.com
            </a>
            <br />
          </div>

          <div>
            <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-2 text-white drop-shadow">3. Swap for ULTRA $MAGA</h3>
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-2xl text-white drop-shadow">
              Head to XMagnetic, XP Market, First Ledger or any reputable XRPL DEX and swap your XRP for ULTRA $MAGA. It's fast and easy.
            </p>
            <a
              href="https://xmagnetic.org/?token=rwH49FHnr48FeUP7NX9EuL4k1peLrPwS3d"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              XMagnetic
            </a>
            <br />
            <a
              href="https://xpmarket.com/token/MAGA-rwH49FHnr48FeUP7NX9EuL4k1peLrPwS3d"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              XPMarket
            </a>
            <br />
            <a
              href="https://firstledger.net/token/rwH49FHnr48FeUP7NX9EuL4k1peLrPwS3d/4D41474100000000000000000000000000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              First Ledger
            </a>
            <br />
          </div>
        </div>
      </div>
    </section>
  );
}
