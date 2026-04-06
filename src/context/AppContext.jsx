import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

function loadProjectFromStorage() {
  try {
    const raw = localStorage.getItem('freelancechain_project');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadTxHistoryFromStorage() {
  try {
    const raw = localStorage.getItem('freelancechain_txhistory');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }) {
  const [project, setProjectState] = useState(() => loadProjectFromStorage());
  const [wallet, setWallet] = useState({ address: null, provider: null, signer: null, network: null });
  const [txHistory, setTxHistory] = useState(() => loadTxHistoryFromStorage());

  const setProject = useCallback((data) => {
    setProjectState(data);
    if (data === null) {
      localStorage.removeItem('freelancechain_project');
    } else {
      try {
        localStorage.setItem('freelancechain_project', JSON.stringify(data));
      } catch {
        // Storage quota exceeded — fail silently
      }
    }
  }, []);

  const addTx = useCallback((invoiceIndex, txHash) => {
    const entry = { invoiceIndex, txHash, timestamp: Date.now() };
    setTxHistory((prev) => {
      const updated = [...prev, entry];
      try {
        localStorage.setItem('freelancechain_txhistory', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const clearProject = useCallback(() => {
    setProjectState(null);
    setTxHistory([]);
    localStorage.removeItem('freelancechain_project');
    localStorage.removeItem('freelancechain_txhistory');
  }, []);

  return (
    <AppContext.Provider value={{ project, setProject, wallet, setWallet, txHistory, addTx, clearProject }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
