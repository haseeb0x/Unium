import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { generateContract } from '../utils/contractGenerator.js';

export default function ContractView() {
  const navigate = useNavigate();
  const { project } = useApp();

  if (!project) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state__icon">📄</div>
          <div className="empty-state__title">No contract yet</div>
          <p className="empty-state__desc">
            You haven't created a project yet. Fill in the project details to generate your contract.
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/new')}>
            Start New Project
          </button>
        </div>
      </div>
    );
  }

  const contract = generateContract(project);

  return (
    <div className="page-container">
      {/* Toolbar */}
      <div className="contract-toolbar">
        <div className="contract-toolbar__title">
          📄 Freelance Service Agreement — {contract.projectTitle}
        </div>
        <div className="contract-toolbar__actions">
          <button
            className="btn btn--secondary"
            onClick={() => navigate('/new')}
          >
            ← Edit Details
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => window.print()}
          >
            🖨 Print / Save PDF
          </button>
          <button
            className="btn btn--primary"
            onClick={() => navigate('/invoices')}
          >
            Proceed to Invoices →
          </button>
        </div>
      </div>

      {/* Contract document */}
      <div className="contract-document">
        <div className="contract-document__inner">

          {/* Document header */}
          <div className="contract-header">
            <div className="contract-header__title">Freelance Service Agreement</div>
            <div className="contract-header__date">Dated: {contract.date}</div>
          </div>

          {/* Parties */}
          <div style={{ marginBottom: '40px' }}>
            <p style={{ marginBottom: '16px', lineHeight: '1.8', color: '#333' }}>
              This Freelance Service Agreement (the <strong>"Agreement"</strong>) is entered into as of{' '}
              <strong>{contract.date}</strong>, by and between:
            </p>
            <div className="contract-parties">
              <div className="contract-party">
                <div className="contract-party__role">Freelancer</div>
                <div className="contract-party__name">{contract.freelancer.name}</div>
                {contract.freelancer.email && (
                  <div className="contract-party__detail">✉ {contract.freelancer.email}</div>
                )}
                {contract.freelancer.ethAddress && (
                  <div className="contract-party__address">{contract.freelancer.ethAddress}</div>
                )}
              </div>
              <div className="contract-party">
                <div className="contract-party__role">Client</div>
                <div className="contract-party__name">{contract.client.name}</div>
                {contract.client.company && (
                  <div className="contract-party__detail">🏢 {contract.client.company}</div>
                )}
                {contract.client.email && (
                  <div className="contract-party__detail">✉ {contract.client.email}</div>
                )}
              </div>
            </div>
            <p style={{ lineHeight: '1.8', color: '#333' }}>
              Each individually referred to herein as a <strong>"Party"</strong> and collectively as the <strong>"Parties."</strong>
            </p>
          </div>

          {/* Sections */}
          {contract.sections.map((section) => (
            <div className="contract-section" key={section.number}>
              <div className="contract-section__number">{section.number}</div>
              <div className="contract-section__title">{section.title}</div>
              <div className="contract-section__body">{section.body}</div>
            </div>
          ))}

          {/* Signature block */}
          <div className="contract-signatures">
            <div className="contract-signature">
              <div className="contract-signature__role">Freelancer Signature</div>
              <div className="contract-signature__line" />
              <div className="contract-signature__name">{contract.freelancer.name}</div>
              <div className="contract-signature__date">Date: ________________________</div>
              {contract.freelancer.ethAddress && (
                <div className="contract-signature__address">
                  ETH: {contract.freelancer.ethAddress}
                </div>
              )}
            </div>
            <div className="contract-signature">
              <div className="contract-signature__role">Client Signature</div>
              <div className="contract-signature__line" />
              <div className="contract-signature__name">{contract.client.name}</div>
              <div className="contract-signature__date">Date: ________________________</div>
              {contract.client.company && (
                <div className="contract-signature__date">{contract.client.company}</div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div style={{
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e5e5',
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: '#aaa',
            fontStyle: 'italic',
          }}>
            Generated by Unium · {contract.date} · Total Fee: ${parseFloat(project.totalFeeUSD || 0).toLocaleString()} USD ≈ {contract.ethAmount} ETH
          </div>
        </div>
      </div>

      {/* Bottom toolbar (repeat for convenience) */}
      <div className="contract-toolbar" style={{ marginTop: '24px' }}>
        <div />
        <div className="contract-toolbar__actions">
          <button
            className="btn btn--secondary"
            onClick={() => window.print()}
          >
            🖨 Print / Save PDF
          </button>
          <button
            className="btn btn--primary"
            onClick={() => navigate('/invoices')}
          >
            Proceed to Invoices →
          </button>
        </div>
      </div>
    </div>
  );
}
