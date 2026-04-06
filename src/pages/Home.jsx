import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const features = [
  {
    icon: '📄',
    title: 'Legal Contract',
    desc: 'Generate a professional, legally-sound freelance service agreement with IP assignment, confidentiality clauses, kill fees, and governing law — ready to sign.',
  },
  {
    icon: '🧾',
    title: 'Milestone Invoices',
    desc: 'Break your project into structured invoices — full upfront, 50/50 split, or per-milestone. Every invoice is tracked and linked to your on-chain payment.',
  },
  {
    icon: '⟠',
    title: 'Pay with ETH',
    desc: 'Clients pay directly via MetaMask. No middlemen, no payment processors. Funds flow peer-to-peer on the Ethereum blockchain with a permanent transaction record.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { project, setProject } = useApp();

  function handleClearProject() {
    if (window.confirm('Are you sure you want to clear the current project and start fresh?')) {
      setProject(null);
      navigate('/new');
    }
  }

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="hero">
        <div className="hero__eyebrow">
          <span>⟠</span>
          Ethereum-Powered Freelancing
        </div>
        <h1 className="hero__title">
          Smart Contracts &amp; Invoices<br />
          for <span>Freelancers</span>
        </h1>
        <p className="hero__subtitle">
          Create legally-sound service agreements, generate structured invoices,
          and receive ETH payments directly on-chain — no banks, no delays.
        </p>
        <div className="hero__actions">
          <button className="btn btn--primary btn--lg" onClick={() => navigate('/new')}>
            <span>🚀</span>
            Start New Project
          </button>
          {project && (
            <button className="btn btn--secondary btn--lg" onClick={() => navigate('/contract')}>
              View Contract
            </button>
          )}
        </div>
      </div>

      {/* Continue existing project */}
      {project && (
        <div className="continue-card">
          <div className="continue-card__info">
            <div className="continue-card__eyebrow">Continue Where You Left Off</div>
            <div className="continue-card__title">{project.projectTitle || 'Untitled Project'}</div>
            <div className="continue-card__meta">
              {project.freelancerName && <span>Freelancer: {project.freelancerName}</span>}
              {project.clientName && <span style={{ marginLeft: '16px' }}>Client: {project.clientName}</span>}
              {project.totalFeeUSD && (
                <span style={{ marginLeft: '16px' }}>
                  Fee: ${parseFloat(project.totalFeeUSD).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="continue-card__actions">
            <button className="btn btn--primary" onClick={() => navigate('/contract')}>
              View Contract →
            </button>
            <button className="btn btn--secondary" onClick={() => navigate('/invoices')}>
              Invoices
            </button>
            <button className="btn btn--secondary" onClick={handleClearProject} style={{ color: '#ef4444' }}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Feature cards */}
      <div className="feature-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {[
            { step: '01', title: 'Enter Project Details', desc: 'Fill in party information, scope, deliverables, and payment terms in our guided 4-step form.' },
            { step: '02', title: 'Generate Contract', desc: 'Instantly produce a complete freelance service agreement with professional legal language.' },
            { step: '03', title: 'Review Invoices', desc: 'Invoices are auto-generated based on your payment schedule — per milestone, split, or upfront.' },
            { step: '04', title: 'Pay On-Chain', desc: 'Clients connect MetaMask and pay each invoice directly in ETH. Receipts are recorded forever on Ethereum.' },
          ].map((item) => (
            <div key={item.step} className="card" style={{ position: 'relative', paddingTop: '20px' }}>
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: '28px',
                background: 'var(--indigo)',
                color: 'white',
                borderRadius: '8px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: '800',
                letterSpacing: '0.06em',
              }}>
                {item.step}
              </div>
              <div className="feature-title" style={{ marginBottom: '8px', marginTop: '8px' }}>{item.title}</div>
              <p className="feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        textAlign: 'center',
        padding: '48px 24px',
        background: 'linear-gradient(135deg, var(--indigo-bg) 0%, #f0f4ff 100%)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⛓</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '12px' }}>
          Ready to get paid on-chain?
        </h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '28px', maxWidth: '420px', margin: '0 auto 28px' }}>
          Set up your first blockchain-backed freelance engagement in under 5 minutes.
        </p>
        <button className="btn btn--primary btn--lg" onClick={() => navigate('/new')}>
          Create Your First Project
        </button>
      </div>
    </div>
  );
}
