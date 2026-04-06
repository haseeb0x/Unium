import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import NewProject from './pages/NewProject.jsx';
import ContractView from './pages/ContractView.jsx';
import InvoicesView from './pages/InvoicesView.jsx';

export default function App() {
  return (
    <AppProvider>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NewProject />} />
            <Route path="/contract" element={<ContractView />} />
            <Route path="/invoices" element={<InvoicesView />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}
