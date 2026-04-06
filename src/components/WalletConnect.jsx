import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { connectWallet, formatAddress } from '../utils/ethereum.js';

export default function WalletConnect() {
  const { wallet, setWallet } = useApp();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const hasMetaMask = typeof window !== 'undefined' && Boolean(window.ethereum);

  async function handleConnect() {
    if (connecting) return;
    setConnecting(true);
    setError(null);
    try {
      const result = await connectWallet();
      setWallet(result);
    } catch (err) {
      setError(err.message || 'Failed to connect');
    } finally {
      setConnecting(false);
    }
  }

  if (!hasMetaMask) {
    return (
      <a
        className="wallet-install-link"
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        title="Install MetaMask to use wallet features"
      >
        🦊 Install MetaMask
      </a>
    );
  }

  if (wallet.address) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {wallet.network && (
          <span className="wallet-network-badge">{wallet.network}</span>
        )}
        <button className="wallet-btn wallet-btn--connected" title={wallet.address}>
          <span className="wallet-dot" />
          {formatAddress(wallet.address)}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#fca5a5', maxWidth: '160px' }} title={error}>
          Connection failed
        </span>
      )}
      <button
        className="wallet-btn wallet-btn--connect"
        onClick={handleConnect}
        disabled={connecting}
      >
        {connecting ? (
          <>
            <span className="spinner" style={{ width: '12px', height: '12px' }} />
            Connecting…
          </>
        ) : (
          <>
            🦊 Connect Wallet
          </>
        )}
      </button>
    </div>
  );
}
