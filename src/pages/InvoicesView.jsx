import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { generateInvoices } from '../utils/invoiceGenerator.js';
import { sendPayment, etherscanUrl } from '../utils/ethereum.js';

/* Payment status for a single invoice */
const PAY_IDLE = 'idle';
const PAY_WAITING = 'waiting';
const PAY_SUCCESS = 'success';
const PAY_ERROR = 'error';

function InvoiceCard({ invoice, freelancerAddress, wallet, onPaid }) {
  const [payStatus, setPayStatus] = useState(PAY_IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [localPaid, setLocalPaid] = useState(invoice.status === 'paid');
  const [localTxHash, setLocalTxHash] = useState(invoice.txHash);

  useEffect(() => {
    setLocalPaid(invoice.status === 'paid');
    setLocalTxHash(invoice.txHash);
  }, [invoice.status, invoice.txHash]);

  async function handlePay() {
    if (!wallet.signer) return;
    setPayStatus(PAY_WAITING);
    setErrorMsg('');
    try {
      const txHash = await sendPayment(wallet.signer, freelancerAddress, invoice.amountETH);
      setLocalPaid(true);
      setLocalTxHash(txHash);
      setPayStatus(PAY_SUCCESS);
      onPaid(invoice.id, txHash);
    } catch (err) {
      const msg =
        err?.code === 4001 || err?.code === 'ACTION_REJECTED'
          ? 'Transaction rejected in MetaMask.'
          : err?.message || 'Transaction failed. Please try again.';
      setErrorMsg(msg);
      setPayStatus(PAY_ERROR);
    }
  }

  const isPaid = localPaid;

  return (
    <div className={`invoice-card invoice-card--${isPaid ? 'paid' : 'unpaid'}`}>
      <div className="invoice-card__header">
        <div>
          <div className="invoice-card__number">Invoice #{invoice.id}</div>
          <div className="invoice-card__title">{invoice.title}</div>
        </div>
        <span className={`badge badge--${isPaid ? 'paid' : 'unpaid'}`}>
          {isPaid ? 'Paid' : 'Unpaid'}
        </span>
      </div>

      <div className="invoice-card__body">
        <div className="invoice-card__meta">
          <p className="invoice-card__desc">{invoice.description}</p>
          <div className="invoice-card__detail">
            <span className="invoice-card__detail-label">Due:</span>
            <span>{invoice.dueDate}</span>
          </div>
          {isPaid && localTxHash && (
            <div className="invoice-card__detail">
              <span className="invoice-card__detail-label">Tx:</span>
              <a
                className="tx-link"
                href={etherscanUrl(localTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Sepolia Etherscan"
              >
                {localTxHash.slice(0, 12)}…{localTxHash.slice(-8)} ↗
              </a>
            </div>
          )}
        </div>

        <div className="invoice-card__amounts">
          <div className="invoice-card__usd">
            ${invoice.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="invoice-card__eth">⟠ {invoice.amountETH} ETH</div>

          {/* Action area */}
          <div className="invoice-card__action">
            {isPaid ? (
              <span className="badge badge--paid">✓ Payment Confirmed</span>
            ) : payStatus === PAY_WAITING ? (
              <div className="payment-loading">
                <span className="spinner" />
                Waiting for confirmation…
              </div>
            ) : payStatus === PAY_SUCCESS ? (
              <div className="payment-success">
                ✓ Transaction sent!
              </div>
            ) : payStatus === PAY_ERROR ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                <div className="payment-error">⚠ {errorMsg}</div>
                <button className="btn btn--danger btn--sm" onClick={handlePay}>
                  Retry Payment
                </button>
              </div>
            ) : wallet.address ? (
              <button
                className="btn btn--primary"
                onClick={handlePay}
                disabled={payStatus === PAY_WAITING}
              >
                <span>⟠</span>
                Pay {invoice.amountETH} ETH via MetaMask
              </button>
            ) : (
              <div className="wallet-notice">
                🔒 Connect wallet to pay this invoice
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvoicesView() {
  const navigate = useNavigate();
  const { project, wallet, txHistory, addTx } = useApp();

  const [invoices, setInvoices] = useState(() =>
    project ? generateInvoices(project) : []
  );

  useEffect(() => {
    if (!project) return;
    const fresh = generateInvoices(project);
    // Re-apply any paid state from txHistory
    const updated = fresh.map((inv) => {
      const tx = txHistory.find((t) => t.invoiceIndex === inv.id);
      if (tx) return { ...inv, status: 'paid', txHash: tx.txHash };
      return inv;
    });
    setInvoices(updated);
  }, [project, txHistory]);

  function handlePaid(invoiceId, txHash) {
    addTx(invoiceId, txHash);
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: 'paid', txHash } : inv
      )
    );
  }

  if (!project) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state__icon">🧾</div>
          <div className="empty-state__title">No project found</div>
          <p className="empty-state__desc">
            Create a project first to generate invoices.
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/new')}>
            Start New Project
          </button>
        </div>
      </div>
    );
  }

  const totalUSD = invoices.reduce((sum, inv) => sum + inv.amountUSD, 0);
  const paidUSD = invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.amountUSD, 0);
  const remainingUSD = totalUSD - paidUSD;

  const totalETH = invoices.reduce((sum, inv) => sum + parseFloat(inv.amountETH), 0);
  const paidETH = invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + parseFloat(inv.amountETH), 0);
  const remainingETH = totalETH - paidETH;

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtEth = (n) => n.toFixed(4);

  const freelancerAddress = project.freelancerEthAddress;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="invoices-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
          <h1 style={{ margin: 0 }}>Invoices — {project.projectTitle}</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn--secondary btn--sm" onClick={() => navigate('/contract')}>
              ← View Contract
            </button>
          </div>
        </div>
        <p>
          {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} · Pay via MetaMask on Sepolia testnet
        </p>
      </div>

      {/* Summary stats */}
      <div className="invoice-summary">
        <div className="summary-stat">
          <div className="summary-stat__label">Total</div>
          <div className="summary-stat__value">${fmt(totalUSD)}</div>
          <div className="summary-stat__sub">⟠ {fmtEth(totalETH)} ETH</div>
        </div>
        <div className="summary-stat summary-stat--paid">
          <div className="summary-stat__label">Paid</div>
          <div className="summary-stat__value">${fmt(paidUSD)}</div>
          <div className="summary-stat__sub">⟠ {fmtEth(paidETH)} ETH</div>
        </div>
        <div className="summary-stat summary-stat--pending">
          <div className="summary-stat__label">Remaining</div>
          <div className="summary-stat__value">${fmt(remainingUSD)}</div>
          <div className="summary-stat__sub">⟠ {fmtEth(remainingETH)} ETH</div>
        </div>
      </div>

      {/* Wallet / network info */}
      {!wallet.address && (
        <div className="alert alert--warning" style={{ marginBottom: '28px' }}>
          <span className="alert__icon">🦊</span>
          <span>
            Connect your MetaMask wallet using the button in the top-right corner to pay invoices.
          </span>
        </div>
      )}

      {wallet.address && wallet.network && wallet.network !== 'Sepolia' && (
        <div className="alert alert--warning" style={{ marginBottom: '28px' }}>
          <span className="alert__icon">⚠</span>
          <span>
            You are connected to <strong>{wallet.network}</strong>. Switch to <strong>Sepolia</strong> testnet
            in MetaMask for test payments, or to Mainnet for real transactions.
          </span>
        </div>
      )}

      {wallet.address && (
        <div className="alert alert--info" style={{ marginBottom: '28px' }}>
          <span className="alert__icon">ℹ</span>
          <span>
            Connected: <strong style={{ fontFamily: 'monospace' }}>{wallet.address}</strong>
            {wallet.network && <span> · {wallet.network}</span>}
            {' · '}Payments go directly to the freelancer's address:{' '}
            <strong style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {freelancerAddress}
            </strong>
          </span>
        </div>
      )}

      {/* Invoice list */}
      <div className="invoice-list">
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            freelancerAddress={freelancerAddress}
            wallet={wallet}
            onPaid={handlePaid}
          />
        ))}
      </div>

      {/* All paid celebration */}
      {invoices.length > 0 && invoices.every((inv) => inv.status === 'paid') && (
        <div className="alert alert--success" style={{ marginTop: '32px' }}>
          <span className="alert__icon">🎉</span>
          <span>
            <strong>All invoices paid!</strong> The project is fully settled on-chain.
            All transactions are permanently recorded on the Ethereum blockchain.
          </span>
        </div>
      )}

      {/* tx history */}
      {txHistory.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '16px' }}>
            Transaction History
          </h3>
          <div className="card card--flat" style={{ padding: '0', overflow: 'hidden' }}>
            {txHistory.map((tx, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: i < txHistory.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge--paid">Paid</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    Invoice #{tx.invoiceIndex}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                    {new Date(tx.timestamp).toLocaleString()}
                  </span>
                </div>
                <a
                  href={etherscanUrl(tx.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  {tx.txHash.slice(0, 14)}…{tx.txHash.slice(-8)} ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
