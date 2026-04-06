import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import WalletConnect from './WalletConnect.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Navbar() {
  const { project } = useApp();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        <span className="navbar__logo-icon">⛓</span>
        <span className="navbar__logo-text">
          Uni<span>um</span>
        </span>
      </Link>

      <div className="navbar__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
        >
          Home
        </NavLink>

        <NavLink
          to="/new"
          className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
        >
          New Project
        </NavLink>

        {project && (
          <>
            <NavLink
              to="/contract"
              className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
            >
              Contract
            </NavLink>
            <NavLink
              to="/invoices"
              className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
            >
              Invoices
            </NavLink>
          </>
        )}
      </div>

      <div className="navbar__right">
        <WalletConnect />
      </div>
    </nav>
  );
}
